// Unit tests for the glue (attachment read -> convert -> open / import),
// run against the vendored core bundle that ships in the XPI and the
// synthetic fixtures in test/fixtures (scripts/make-fixtures.mjs).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as core from '../core/msg-eml-core.js';
import {
  isMsgAttachment, emlName, convertMsg, convertFile, collectWarnings, ConversionError,
  openMsgFile, importMsgFile, openMsgAttachments, showWarnings, messagesOf,
} from '../extension/lib/glue.js';

const fx = (n) => new Uint8Array(readFileSync(new URL(`./fixtures/${n}`, import.meta.url)));
const fxFile = (n, name = n) => new File([fx(n)], name, { type: 'application/vnd.ms-outlook' });
const text = async (file) => Buffer.from(await file.arrayBuffer()).toString('latin1');

/** A fake messenger API that records what the glue asks of Thunderbird. */
function fakeApi({ attachments = {}, displayed = [{ id: 7 }], inject = 'shown', importError = null, listed = null, tabDisplayed = null } = {}) {
  const calls = { open: [], inject: [], import: [], getAttachmentFile: [] };
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
        return listed || Object.entries(attachments).map(([partName, f]) => ({ partName, name: f.name }));
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
  assert.ok(r.warnings.some((w) => /sender has no SMTP address/.test(w)), r.warnings.join('\n'));
  assert.ok(r.warnings.some((w) => /no date/.test(w)));
});

test('warnings of embedded messages are collected with their message named', async () => {
  const r = convertMsg(core, fx('nested.msg'), 'nested.msg');
  assert.ok(r.warnings.some((w) => /^In the attached message ".*": the file has no date/.test(w)), r.warnings.join('\n'));
  const eml = await text(r.file);
  assert.match(eml, /Content-Type: message\/rfc822/);
  assert.match(eml, /attached copy\.msg/);
  assert.deepEqual(collectWarnings({ warnings: ['a'], attachments: [{ name: 'x.eml', embedded: { warnings: ['b'], attachments: [] } }] }),
    ['a', 'In the attached message "x.eml": b']);
});

test('bad input gives an honest ConversionError, never an empty message', async () => {
  const cases = [
    ['not-a-msg.msg', fx('not-a-msg.msg'), 'NOT_MSG', /is not an Outlook message \(\.msg\) file/],
    ['truncated.msg', fx('truncated.msg'), 'CORRUPT_CFB', /could not be converted: .*damaged/],
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
  const r = await openMsgFile(api, core, fxFile('simple.msg'));
  assert.equal(api.calls.open.length, 1);
  assert.equal(api.calls.open[0].file.name, 'simple.eml');
  assert.equal(api.calls.open[0].active, true);
  assert.equal(r.shown, 'none');
  assert.equal(api.calls.inject.length, 0);
});

test('warnings are shown once as a bar in the opened tab', async () => {
  const api = fakeApi();
  const notice = noticeRecorder();
  const r = await openMsgFile(api, core, fxFile('warnings.msg'), { showNotice: notice });
  assert.equal(r.shown, 'bar');
  assert.equal(api.calls.inject.length, 1);
  const inj = api.calls.inject[0];
  assert.equal(inj.target.tabId, 100);
  assert.equal(typeof inj.func, 'function');
  assert.match(inj.args[0], /^Converted from "warnings.msg"\. 2 things could not be carried over exactly:$/);
  assert.deepEqual(inj.args[1], r.warnings);
  assert.equal(notice.notices.length, 0);
});

test('if the bar cannot be placed, the warnings go to a notice instead of being dropped', async () => {
  for (const mode of ['throw', 'nothing']) {
    const api = fakeApi({ inject: mode });
    const notice = noticeRecorder();
    const r = await openMsgFile(api, core, fxFile('warnings.msg'), { showNotice: notice });
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
  const res = await openMsgAttachments(api, core, { id: 3 }, [
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
  const res = await openMsgAttachments(api, core, { id: 3 }, [
    { name: 'bad.msg', partName: '1.2', contentType: 'application/octet-stream' },
    { name: 'good.msg', partName: '1.3', contentType: 'application/vnd.ms-outlook' },
  ], { showNotice: notice });
  assert.equal(api.calls.open.length, 1);
  assert.equal(api.calls.open[0].file.name, 'good.eml');
  assert.equal(notice.notices.length, 1);
  assert.match(notice.notices[0].lines[0], /"bad.msg" is not an Outlook message/);
  assert.ok(res[0].error && !res[1].error);
});

test('attachment path: no .msg selected, or no single displayed message, gives a notice', async () => {
  const notice = noticeRecorder();
  await openMsgAttachments(fakeApi(), core, { id: 3 }, [{ name: 'a.pdf', partName: '1', contentType: 'application/pdf' }], { showNotice: notice });
  assert.match(notice.notices[0].lines[0], /None of the selected attachments/);
  const n2 = noticeRecorder();
  await openMsgAttachments(fakeApi({ displayed: [{ id: 1 }, { id: 2 }], listed: [] }), core, { id: 3 }, [{ name: 'a.msg', partName: '1' }], { showNotice: n2 });
  assert.match(n2.notices[0].lines[0], /more than one message/);
  const n3 = noticeRecorder();
  await openMsgAttachments(fakeApi({ displayed: [] }), core, { id: 3 }, [{ name: 'a.msg', partName: '1' }], { showNotice: n3 });
  assert.match(n3.notices[0].lines[0], /no message is displayed/);
});

test('attachment path: a tab id Thunderbird does not know falls back to the active tab, checked by attachment', async () => {
  const api = fakeApi({
    attachments: { '1.3': new File([fx('simple.msg')], 'simple.msg') },
    tabDisplayed: () => { throw new Error('Invalid tab ID: 5'); },
  });
  const notice = noticeRecorder();
  await openMsgAttachments(api, core, { id: 5 }, [{ name: 'simple.msg', partName: '1.3', contentType: 'application/vnd.ms-outlook' }], { showNotice: notice });
  assert.equal(notice.notices.length, 0);
  assert.deepEqual(api.calls.getAttachmentFile, [[7, '1.3']]);
  // The active message lacks the clicked attachment: refuse rather than guess.
  const wrong = fakeApi({ attachments: { '1.3': new File([fx('simple.msg')], 'simple.msg') }, listed: [{ partName: '1.3', name: 'other.msg' }] });
  const n2 = noticeRecorder();
  await openMsgAttachments(wrong, core, { id: 5 }, [{ name: 'simple.msg', partName: '1.3' }], { showNotice: n2 });
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
  await openMsgAttachments(api, core, { id: 9 }, [{ name: 'attached copy.msg', partName: '1.3', contentType: 'application/vnd.ms-outlook' }]);
  assert.equal(api.calls.open[0].file.name, 'attached copy.eml');
  assert.match(await text(api.calls.open[0].file), /^Subject: Synthetic plain message$/m);
});

test('import path: messages.import gets the .eml and the folder', async () => {
  const api = fakeApi();
  const r = await importMsgFile(api, core, fxFile('warnings.msg'), 'folder-1');
  assert.equal(api.calls.import[0][0].name, 'warnings.eml');
  assert.equal(api.calls.import[0][1], 'folder-1');
  assert.equal(r.header.id, 55);
  assert.ok(r.warnings.length >= 2);
});

test('import path: a duplicate Message-ID and other failures are worded plainly', async () => {
  const dup = fakeApi({ importError: 'Destination folder already contains a message with id <simple.fixture@example.com>' });
  await assert.rejects(importMsgFile(dup, core, fxFile('simple.msg'), 'f'), (e) => e.code === 'DUPLICATE' && /same Message-ID/.test(e.message));
  const other = fakeApi({ importError: 'Folder is read-only' });
  await assert.rejects(importMsgFile(other, core, fxFile('simple.msg'), 'f'), (e) => e.code === 'IMPORT_FAILED' && /converted but could not be imported: Folder is read-only/.test(e.message));
  await assert.rejects(importMsgFile(fakeApi(), core, fxFile('truncated.msg'), 'f'), ConversionError);
});

test('messagesOf accepts a MessageList or an array', () => {
  assert.deepEqual(messagesOf({ messages: [1] }), [1]);
  assert.deepEqual(messagesOf([2]), [2]);
  assert.deepEqual(messagesOf(null), []);
});
