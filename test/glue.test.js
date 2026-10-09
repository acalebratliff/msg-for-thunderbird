// Unit tests for the glue (attachment read -> convert -> open / import),
// run against the vendored core bundle that ships in the XPI and the
// synthetic fixtures in test/fixtures (scripts/make-fixtures.mjs).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as core from '../core/msg-eml-core.js';
import {
  isMsgAttachment, emlName, menuStateFor, ensureMessageId, hasMessageId, convertMsg, convertMsgBytes, convertFile, collectWarnings, ConversionError,
  openMsgFile, importMsgFile, openMsgAttachments, showWarnings, messagesOf, inThreadConverter,
  MAX_MSG_BYTES,
} from '../extension/lib/glue.js';

const convert = inThreadConverter(core);

const fx = (n) => new Uint8Array(readFileSync(new URL(`./fixtures/${n}`, import.meta.url)));
const fxFile = (n, name = n) => new File([fx(n)], name, { type: 'application/vnd.ms-outlook' });
const text = async (file) => Buffer.from(await file.arrayBuffer()).toString('latin1');

/** A fake messenger API that records what the glue asks of Thunderbird. */
function fakeApi({ attachments = {}, displayed = [{ id: 7 }], inject = 'shown', importError = null, listed = null, tabDisplayed = null, granted = true } = {}) {
  const calls = { open: [], inject: [], import: [], getAttachmentFile: [], request: [] };
  let nextTab = 100;
  const api = {
    calls,
    messageDisplay: {
      async open(props) { calls.open.push(props); return { id: nextTab++ }; },
      async getDisplayedMessages(tabId) {
        if (tabId !== undefined && tabDisplayed) return tabDisplayed(tabId);
        return { id: null, messages: displayed };
      },
    },
    messages: {
      async listAttachments() {
        return listed || Object.entries(attachments).map(([partName, f]) => ({ partName, name: f.name, size: f.size }));
      },
      async getAttachmentFile(messageId, partName) {
        calls.getAttachmentFile.push([messageId, partName]);
        if (!(partName in attachments)) throw new Error(`no part ${partName}`);
        return attachments[partName];
      },
      async import(file, folderId) {
        calls.import.push([file, folderId]);
        if (importError) throw new Error(importError);
        return { id: 55, subject: 'x' };
      },
    },
    scripting: {
      async executeScript(inj) {
        calls.inject.push(inj);
        if (inject === 'throw') throw new Error('Missing host permission');
        return [{ result: inject }];
      },
    },
  };
  return api;
}
const noticeRecorder = () => {
  const notices = [];
  const fn = async (n) => { notices.push(n); };
  fn.notices = notices;
  return fn;
};

test('isMsgAttachment picks .msg files and Outlook types, not embedded messages', () => {
  assert.ok(isMsgAttachment({ name: 'Report.MSG', contentType: 'application/octet-stream' }));
  assert.ok(isMsgAttachment({ name: 'noext', contentType: 'application/vnd.ms-outlook' }));
  assert.ok(!isMsgAttachment({ name: 'fwd.msg', contentType: 'message/rfc822' }));
  assert.ok(!isMsgAttachment({ name: 'photo.jpg', contentType: 'image/jpeg' }));
  assert.ok(!isMsgAttachment({ name: 'gone.msg', contentType: 'text/x-moz-deleted' }));
  assert.ok(!isMsgAttachment(null));
});

test('emlName swaps the extension and keeps the name safe', () => {
  assert.equal(emlName('Quarterly report.msg'), 'Quarterly report.eml');
  assert.equal(emlName('a/b.MSG'), 'a_b.eml');
  assert.equal(emlName(''), 'message.eml');
});

test('a plain .msg converts to a message/rfc822 File with no warnings', async () => {
  const r = convertMsg(core, fx('simple.msg'), 'simple.msg');
  assert.equal(r.file.name, 'simple.eml');
  assert.equal(r.file.type, 'message/rfc822');
  const eml = await text(r.file);
  assert.match(eml, /^Subject: Synthetic plain message$/m);
  assert.match(eml, /^From: Alice Example <alice@example.com>$/m);
  assert.deepEqual(r.warnings, []);
});

test('the core warnings come through', () => {
  const r = convertMsg(core, fx('warnings.msg'), 'warnings.msg');
  assert.ok(r.warnings.some((w) => /^The file has no email address for the sender \(Exchange Person\)\./.test(w)), r.warnings.join('\n'));
  assert.ok(r.warnings.includes('The file has no date, so the message has none.'));
});

test('warnings of embedded messages are collected with their message named', async () => {
  const r = convertMsg(core, fx('nested.msg'), 'nested.msg');
  assert.ok(r.warnings.some((w) => /^In the attached message ".*": The file has no date, so the message has none\.$/.test(w)), r.warnings.join('\n'));
  const eml = await text(r.file);
  assert.match(eml, /Content-Type: message\/rfc822/);
  assert.match(eml, /attached copy\.msg/);
  assert.deepEqual(collectWarnings({ warnings: ['a'], attachments: [{ name: 'x.eml', embedded: { warnings: ['b'], attachments: [] } }] }),
    ['a', 'In the attached message "x.eml": b']);
});

test('bad input gives an honest ConversionError, never an empty message', async () => {
  const cases = [
    ['not-a-msg.msg', fx('not-a-msg.msg'), 'NOT_MSG', /^"not-a-msg\.msg" was not opened\. It is not an Outlook \.msg file\.$/],
    ['truncated.msg', fx('truncated.msg'), 'CORRUPT_CFB', /^"truncated\.msg" could not be opened\. The file is damaged and cannot be read/],
    ['empty.msg', new Uint8Array(0), 'BAD_INPUT', /is empty or could not be read/],
  ];
  for (const [name, bytes, code, re] of cases) {
    assert.throws(() => convertMsg(core, bytes, name), (e) => e instanceof ConversionError && e.code === code && re.test(e.message) && e.message.includes(name));
  }
  const unreadable = { name: 'locked.msg', arrayBuffer: async () => { throw new Error('denied'); } };
  await assert.rejects(convertFile(core, unreadable), (e) => e instanceof ConversionError && /could not be read/.test(e.message));
});

test('disk path: a picked file opens with messageDisplay.open and no bar when clean', async () => {
  const api = fakeApi();
  const r = await openMsgFile(api, convert, fxFile('simple.msg'));
  assert.equal(api.calls.open.length, 1);
  assert.equal(api.calls.open[0].file.name, 'simple.eml');
  assert.equal(api.calls.open[0].active, true);
  assert.equal(api.calls.open[0].location, 'tab', 'always a new tab, whatever the open-messages setting');
  assert.equal(r.shown, 'none');
  assert.equal(api.calls.inject.length, 0);
});

test('warnings are shown once as a bar in the opened tab', async () => {
  const api = fakeApi();
  const notice = noticeRecorder();
  const r = await openMsgFile(api, convert, fxFile('warnings.msg'), { showNotice: notice });
  assert.equal(r.shown, 'bar');
  assert.equal(api.calls.inject.length, 1);
  const inj = api.calls.inject[0];
  assert.equal(inj.target.tabId, 100);
  assert.equal(typeof inj.func, 'function');
  assert.equal(inj.args[0], 'Converted from "warnings.msg". Some details differ from the original:');
  assert.equal(inj.args[1].length, 2, 'the added message ID is not shown when opening');
  assert.ok(!inj.args[1].some((w) => /message ID/i.test(w)));
  assert.deepEqual(inj.args[1], r.warnings);
  assert.equal(notice.notices.length, 0);
});

test('if the bar cannot be placed, the warnings go to a notice instead of being dropped', async () => {
  for (const mode of ['throw', 'nothing', 'hidden', 'present']) {
    const api = fakeApi({ inject: mode });
    const notice = noticeRecorder();
    const r = await openMsgFile(api, convert, fxFile('warnings.msg'), { showNotice: notice });
    assert.equal(r.shown, 'notice');
    assert.equal(notice.notices.length, 1);
    assert.deepEqual(notice.notices[0].lines, r.warnings);
  }
  const notDisplayed = fakeApi({ displayed: [] });
  const notice = noticeRecorder();
  const shown = await showWarnings({ ...notDisplayed, messageDisplay: { getDisplayedMessages: async () => ({ messages: [] }) } },
    { id: 1 }, 'x.msg', ['w'], notice, { timeoutMs: 50, stepMs: 10 });
  assert.equal(shown, 'notice');
  assert.equal(notice.notices.length, 1);
});

test('attachment path: getAttachmentFile -> convert -> open, only for .msg attachments', async () => {
  const api = fakeApi({ attachments: { '1.2': new File([fx('simple.msg')], 'simple.msg') } });
  const notice = noticeRecorder();
  const res = await openMsgAttachments(api, convert, { id: 3 }, [
    { name: 'simple.msg', partName: '1.2', contentType: 'application/octet-stream' },
    { name: 'photo.jpg', partName: '1.3', contentType: 'image/jpeg' },
  ], { showNotice: notice });
  assert.deepEqual(api.calls.getAttachmentFile, [[7, '1.2']]);
  assert.equal(api.calls.open.length, 1);
  assert.equal(api.calls.open[0].file.name, 'simple.eml');
  assert.equal(res.length, 1);
  assert.equal(notice.notices.length, 0);
});

test('attachment path: one bad attachment is reported and the others still open', async () => {
  const api = fakeApi({ attachments: {
    '1.2': new File([fx('not-a-msg.msg')], 'bad.msg'),
    '1.3': new File([fx('simple.msg')], 'good.msg'),
  } });
  const notice = noticeRecorder();
  const res = await openMsgAttachments(api, convert, { id: 3 }, [
    { name: 'bad.msg', partName: '1.2', contentType: 'application/octet-stream' },
    { name: 'good.msg', partName: '1.3', contentType: 'application/vnd.ms-outlook' },
  ], { showNotice: notice });
  assert.equal(api.calls.open.length, 1);
  assert.equal(api.calls.open[0].file.name, 'good.eml');
  assert.equal(notice.notices.length, 1);
  assert.match(notice.notices[0].lines[0], /^"bad.msg" was not opened\. It is not an Outlook \.msg file\.$/);
  assert.ok(res[0].error && !res[1].error);
});

test('attachment path: no .msg selected, or no single displayed message, gives a notice', async () => {
  const notice = noticeRecorder();
  await openMsgAttachments(fakeApi(), convert, { id: 3 }, [{ name: 'a.pdf', partName: '1', contentType: 'application/pdf' }], { showNotice: notice });
  assert.match(notice.notices[0].lines[0], /None of the selected attachments/);
  const n2 = noticeRecorder();
  await openMsgAttachments(fakeApi({ displayed: [{ id: 1 }, { id: 2 }], listed: [] }), convert, { id: 3 }, [{ name: 'a.msg', partName: '1' }], { showNotice: n2 });
  assert.match(n2.notices[0].lines[0], /more than one message/);
  const n3 = noticeRecorder();
  await openMsgAttachments(fakeApi({ displayed: [] }), convert, { id: 3 }, [{ name: 'a.msg', partName: '1' }], { showNotice: n3 });
  assert.match(n3.notices[0].lines[0], /no message is displayed/);
});

test('attachment path: a tab id Thunderbird does not know falls back to the active tab, checked by attachment', async () => {
  const api = fakeApi({
    attachments: { '1.3': new File([fx('simple.msg')], 'simple.msg') },
    tabDisplayed: () => { throw new Error('Invalid tab ID: 5'); },
  });
  const notice = noticeRecorder();
  await openMsgAttachments(api, convert, { id: 5 }, [{ name: 'simple.msg', partName: '1.3', contentType: 'application/vnd.ms-outlook' }], { showNotice: notice });
  assert.equal(notice.notices.length, 0);
  assert.deepEqual(api.calls.getAttachmentFile, [[7, '1.3']]);
  // The active message lacks the clicked attachment: refuse rather than guess.
  const wrong = fakeApi({ attachments: { '1.3': new File([fx('simple.msg')], 'simple.msg') }, listed: [{ partName: '1.3', name: 'other.msg' }] });
  const n2 = noticeRecorder();
  await openMsgAttachments(wrong, convert, { id: 5 }, [{ name: 'simple.msg', partName: '1.3' }], { showNotice: n2 });
  assert.equal(wrong.calls.getAttachmentFile.length, 0);
  assert.match(n2.notices[0].lines[0], /does not have that attachment/);
});

test('nested path: a .msg attached inside a converted message opens the same way', async () => {
  const outer = convertMsg(core, fx('nested.msg'), 'nested.msg');
  const eml = await text(outer.file);
  // Pull the attached .msg out of the MIME, as Thunderbird would hand it over.
  const m = /filename="attached copy\.msg"\r\n(?:[^\r\n]+\r\n)*\r\n([A-Za-z0-9+/=\r\n]+?)\r\n--/.exec(eml);
  assert.ok(m, 'attached .msg part found');
  const inner = Buffer.from(m[1].replace(/\r\n/g, ''), 'base64');
  assert.deepEqual(new Uint8Array(inner), fx('simple.msg'));
  const api = fakeApi({ attachments: { '1.3': new File([inner], 'attached copy.msg') } });
  await openMsgAttachments(api, convert, { id: 9 }, [{ name: 'attached copy.msg', partName: '1.3', contentType: 'application/vnd.ms-outlook' }]);
  assert.equal(api.calls.open[0].file.name, 'attached copy.eml');
  assert.match(await text(api.calls.open[0].file), /^Subject: Synthetic plain message$/m);
});

test('import path: messages.import gets the .eml and the folder', async () => {
  const api = fakeApi();
  const r = await importMsgFile(api, convert, fxFile('warnings.msg'), 'folder-1');
  assert.equal(api.calls.import[0][0].name, 'warnings.eml');
  assert.equal(api.calls.import[0][1], 'folder-1');
  assert.equal(r.header.id, 55);
  assert.ok(r.warnings.length >= 2);
  assert.equal(r.warnings.at(-1), 'The file had no message ID, so one was added. Importing it twice into a folder will be refused.');
  assert.match(Buffer.from(await api.calls.import[0][0].arrayBuffer()).toString('latin1'), /^Message-ID: <[0-9a-f]{32}@msg-opener\.invalid>\r\n/);
  const withId = await importMsgFile(fakeApi(), convert, fxFile('simple.msg'), 'f');
  assert.deepEqual(withId.warnings, [], 'a file with its own Message-ID gets no note');
});

test('import path: a duplicate Message-ID and other failures are worded plainly', async () => {
  const dup = fakeApi({ importError: 'Destination folder already contains a message with id <simple.fixture@example.com>' });
  await assert.rejects(importMsgFile(dup, convert, fxFile('simple.msg'), 'f'), (e) => e.code === 'DUPLICATE' && e.message === '"simple.msg" was not imported. That folder already has this message.');
  const other = fakeApi({ importError: 'Folder is read-only' });
  await assert.rejects(importMsgFile(other, convert, fxFile('simple.msg'), 'f'), (e) => e.code === 'IMPORT_FAILED' && e.message === '"simple.msg" could not be imported into that folder (Folder is read-only). Try another folder.');
  await assert.rejects(importMsgFile(fakeApi(), convert, fxFile('truncated.msg'), 'f'), ConversionError);
});

test('messagesOf accepts a MessageList or an array', () => {
  assert.deepEqual(messagesOf({ messages: [1] }), [1]);
  assert.deepEqual(messagesOf([2]), [2]);
  assert.deepEqual(messagesOf(null), []);
});

test('files over the size cap are refused before they are read', async () => {
  const big = { name: 'huge.msg', size: MAX_MSG_BYTES + 1, arrayBuffer: async () => { throw new Error('must not be read'); } };
  await assert.rejects(convertFile(convert, big), (e) => e.code === 'TOO_LARGE' && e.message === '"huge.msg" was not opened. It is 25.0 MB, and this add-on opens files up to 25 MB.');
  assert.throws(() => convertMsgBytes(core, new Uint8Array(MAX_MSG_BYTES + 1), 'x.msg'), (e) => e.code === 'TOO_LARGE');
  const api = fakeApi({ attachments: { '1.2': new File([fx('simple.msg')], 'big.msg') }, listed: [{ partName: '1.2', name: 'big.msg', size: MAX_MSG_BYTES + 5 }] });
  const notice = noticeRecorder();
  await openMsgAttachments(api, convert, { id: 3 }, [{ name: 'big.msg', partName: '1.2', size: MAX_MSG_BYTES + 5 }], { showNotice: notice });
  assert.equal(api.calls.getAttachmentFile.length, 0);
  assert.match(notice.notices[0].lines[0], /this add-on opens files up to 25 MB\.$/);
});

test('attachment path: a large attachment shows "Converting…" and closes it when opened', async () => {
  const f = new File([fx('simple.msg')], 'mid.msg');
  const api = fakeApi({ attachments: { '1.2': f }, listed: [{ partName: '1.2', name: 'mid.msg', size: 2 * 1024 * 1024 }] });
  const events = [];
  const progress = async (name) => { events.push(`start ${name}`); return { done: async () => { events.push('done'); } }; };
  await openMsgAttachments(api, convert, { id: 3 }, [{ name: 'mid.msg', partName: '1.2', size: 2 * 1024 * 1024 }], { progress });
  assert.deepEqual(events, ['start mid.msg', 'done']);
  assert.equal(api.calls.open[0].location, 'tab');
  const small = fakeApi({ attachments: { '1.2': f } });
  const ev2 = [];
  await openMsgAttachments(small, convert, { id: 3 }, [{ name: 'mid.msg', partName: '1.2', size: f.size }], { progress: async () => { ev2.push('start'); return { done: async () => {} }; } });
  assert.deepEqual(ev2, [], 'no flash of a window for a small file');
  // a failing conversion still closes the progress window
  const bad = fakeApi({ attachments: { '1.2': new File([fx('truncated.msg')], 'bad.msg') }, listed: [{ partName: '1.2', name: 'bad.msg', size: 3e6 }] });
  const ev3 = [];
  await openMsgAttachments(bad, convert, { id: 3 }, [{ name: 'bad.msg', partName: '1.2', size: 3e6 }],
    { showNotice: async () => ev3.push('notice'), progress: async () => { ev3.push('start'); return { done: async () => ev3.push('done') }; } });
  assert.deepEqual(ev3, ['start', 'done', 'notice']);
});

test('fallback match also checks size and refuses two matching messages', async () => {
  const f = new File([fx('simple.msg')], 'simple.msg');
  const api = fakeApi({ attachments: { '1.3': f }, listed: [{ partName: '1.3', name: 'simple.msg', size: 999 }] });
  const n = noticeRecorder();
  await openMsgAttachments(api, convert, { id: 5 }, [{ name: 'simple.msg', partName: '1.3', size: f.size }], { showNotice: n });
  assert.equal(api.calls.getAttachmentFile.length, 0);
  const two = fakeApi({ attachments: { '1.3': f }, displayed: [{ id: 1 }, { id: 2 }] });
  const n2 = noticeRecorder();
  await openMsgAttachments(two, convert, { id: 5 }, [{ name: 'simple.msg', partName: '1.3', size: f.size }], { showNotice: n2 });
  assert.equal(two.calls.getAttachmentFile.length, 0);
  assert.match(n2.notices[0].lines[0], /more than one displayed message has that attachment/);
});

test('the worker converts and reports errors in the same shape', async () => {
  const posted = [];
  // The worker imports ../core/ as laid out in the XPI, so load it from the staged build.
  execFileSync(process.execPath, [fileURLToPath(new URL('../scripts/build.mjs', import.meta.url))], { stdio: 'ignore' });
  globalThis.self = { postMessage: (m) => posted.push(m) };
  await import('../build/stage/lib/convert-worker.js');
  const buf = fx('warnings.msg').buffer.slice(0);
  await self.onmessage({ data: { buf, fileName: 'warnings.msg', options: {} } });
  assert.equal(posted[0].ok, true);
  assert.equal(posted[0].name, 'warnings.eml');
  assert.ok(posted[0].eml instanceof ArrayBuffer);
  assert.match(Buffer.from(posted[0].eml).toString('latin1'), /^Subject: Synthetic message with warnings$/m);
  assert.equal(posted[0].warnings.length, 2);
  assert.equal(posted[0].addedMessageId, true);
  assert.match(Buffer.from(posted[0].eml).toString('latin1'), /^Message-ID: <[0-9a-f]{32}@msg-opener\.invalid>\r\n/);
  await self.onmessage({ data: { buf: fx('not-a-msg.msg').buffer.slice(0), fileName: 'n.msg', options: {} } });
  assert.deepEqual(posted[1], { ok: false, error: { code: 'NOT_MSG', fileName: 'n.msg', message: posted[1].error.message } });
  assert.match(posted[1].error.message, /was not opened\. It is not an Outlook \.msg file\./);
  delete globalThis.self;
});

test('menu state: decided from the contexts and always explicit, so .msg -> other -> .msg shows it again', () => {
  const ctx = (atts) => ({ contexts: ['message_attachments'], menuIds: [], attachments: atts });
  const msg = [{ name: 'a.msg', contentType: 'application/vnd.ms-outlook' }];
  const pdf = [{ name: 'a.pdf', contentType: 'application/pdf' }];
  assert.deepEqual(menuStateFor(ctx(msg)), { visible: true, title: 'Open as message' });
  assert.deepEqual(menuStateFor(ctx(pdf)), { visible: false, title: 'Open as message' });
  // Thunderbird omits a hidden item from menuIds; the state must not depend on it.
  assert.deepEqual(menuStateFor(ctx(msg)), { visible: true, title: 'Open as message' });
  assert.equal(menuStateFor({ contexts: ['all_message_attachments'], attachments: [...msg, ...msg] }).title, 'Open 2 .msg attachments as messages');
  assert.equal(menuStateFor({ contexts: ['message_list'], attachments: msg }), null);
  assert.equal(menuStateFor({}), null);
});

test('a converted message gets a stable Message-ID from the file content only when it has none', async () => {
  const noId = fx('warnings.msg');
  const a = await ensureMessageId(convertMsgBytes(core, noId, 'w.msg'), noId);
  const b = await ensureMessageId(convertMsgBytes(core, noId, 'w.msg'), noId);
  const id = /^Message-ID: (<[0-9a-f]{32}@msg-opener\.invalid>)\r\n/.exec(Buffer.from(a.eml).toString('latin1'));
  assert.ok(id);
  assert.deepEqual(Buffer.from(a.eml), Buffer.from(b.eml), 'same file, same id');
  assert.ok(hasMessageId(a.eml));
  assert.equal(a.addedMessageId, true);
  assert.deepEqual(a.warnings, convertMsgBytes(core, noId, 'w.msg').warnings, 'no warning line added');
  const withId = fx('simple.msg');
  const c = await ensureMessageId(convertMsgBytes(core, withId, 's.msg'), withId);
  assert.match(Buffer.from(c.eml).toString('latin1'), /^Message-ID: <simple\.fixture@example\.com>$/m);
  assert.ok(!/msg-opener\.invalid/.test(Buffer.from(c.eml).toString('latin1')));
  assert.equal(c.warnings.length, 0);
  const other = await ensureMessageId(convertMsgBytes(core, fx('hostile-css.msg'), 'h.msg'), fx('hostile-css.msg'));
  assert.notEqual(/Message-ID: (\S+)/.exec(Buffer.from(other.eml).toString('latin1'))[1], id[1]);
});

test('an error in the add-on itself says where to report it', async () => {
  const api = fakeApi({ attachments: { '1.2': new File([fx('simple.msg')], 'simple.msg') } });
  api.messageDisplay.open = async () => { throw new Error('boom'); };
  const notice = noticeRecorder();
  await openMsgAttachments(api, convert, { id: 3 }, [{ name: 'simple.msg', partName: '1.2' }], { showNotice: notice });
  assert.equal(notice.notices[0].lines[0], '"simple.msg" could not be opened because of an error in the add-on (boom). Please report it at github.com/acalebratliff/msg-for-thunderbird/issues.');
  const n2 = noticeRecorder();
  await openMsgAttachments(fakeApi({ displayed: [] }), convert, { id: 3 }, [{ name: 'a.msg', partName: '1' }], { showNotice: n2 });
  assert.match(n2.notices[0].lines[0], /^Thunderbird could not tell which message the attachment belongs to \(no message is displayed\)\. Open that message on its own, then try again\.$/);
});
