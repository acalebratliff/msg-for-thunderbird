// The add-on's glue: the conversion boundary (convertMsgBytes / convertMsg,
// which another add-on such as LookOut could take together with the core) and
// the flows around it. Nothing here touches globals except File: the core (or
// a converter function) and the messenger API are passed in, so the same code
// runs in Thunderbird and under node:test with fakes.

export const EML_TYPE = 'message/rfc822';
const MSG_TYPES = new Set(['application/vnd.ms-outlook', 'application/x-msg', 'application/msoutlook']);

/** True for an attachment this add-on can open (an Outlook .msg file). */
export function isMsgAttachment(att) {
  if (!att) return false;
  const type = String(att.contentType || '').toLowerCase().split(';')[0].trim();
  // An embedded message/rfc822 part is opened by Thunderbird itself.
  if (type === EML_TYPE || type === 'text/x-moz-deleted') return false;
  const name = String(att.name || '').trim().toLowerCase();
  return name.endsWith('.msg') || MSG_TYPES.has(type);
}

export const ATTACHMENT_CONTEXTS = ['message_attachments', 'all_message_attachments'];

/**
 * The menu entry's state for a menus.onShown info, or null when the menu is
 * not an attachment menu. Always returns visible true or false explicitly.
 */
export function menuStateFor(info) {
  const contexts = (info && info.contexts) || [];
  if (!contexts.some((c) => ATTACHMENT_CONTEXTS.includes(c))) return null;
  const n = ((info && info.attachments) || []).filter(isMsgAttachment).length;
  return { visible: n > 0, title: n > 1 ? `Open ${n} .msg attachments as messages` : 'Open as message' };
}

/** File name for the converted message: "Report.msg" -> "Report.eml". */
export function emlName(msgName) {
  const base = String(msgName || '').trim().replace(/\.msg$/i, '').replace(/[\\/]/g, '_');
  return `${base || 'message'}.eml`;
}

/** A file that could not be converted. `message` is a sentence fit to show the user. */
export class ConversionError extends Error {
  constructor(fileName, code, message, cause) {
    super(message);
    this.name = 'ConversionError';
    this.fileName = fileName;
    this.code = code;
    if (cause !== undefined) this.cause = cause;
  }
}

const NOT_MSG_HINT = 'Only Outlook .msg files can be opened this way.';

/** Largest .msg this add-on converts. Conversion needs several times the file size in memory. */
export const MAX_MSG_BYTES = 25 * 1024 * 1024;
/** Attachments at least this big get a "Converting…" notice. */
export const PROGRESS_MIN_BYTES = 1024 * 1024;
const mb = (n) => `${(n / (1024 * 1024)).toFixed(1)} MB`;

/** Throw a ConversionError if a file of `size` bytes is over the cap. */
export function checkSize(fileName, size) {
  if (typeof size === 'number' && size > MAX_MSG_BYTES) {
    throw new ConversionError(fileName, 'TOO_LARGE',
      `"${fileName}" is ${mb(size)}, larger than the ${MAX_MSG_BYTES / (1024 * 1024)} MB this add-on opens; it was not opened.`);
  }
}

function userMessage(fileName, e) {
  const name = fileName ? `"${fileName}"` : 'The file';
  const detail = e && typeof e.message === 'string' && e.message ? e.message : String(e);
  if (e && e.code === 'NOT_MSG') return `${name} is not an Outlook message (.msg) file. ${NOT_MSG_HINT}`;
  if (e && e.code === 'BAD_INPUT') return `${name} is empty or could not be read.`;
  if (e && e.code) return `${name} could not be converted: ${detail}`;
  return `${name} could not be converted because of an unexpected error: ${detail}`;
}

/**
 * Every warning in a core report, including those of embedded messages,
 * which the core keeps in report.attachments[].embedded.
 */
export function collectWarnings(report, prefix = '') {
  const out = [];
  if (!report) return out;
  for (const w of report.warnings || []) out.push(prefix + w);
  for (const att of report.attachments || []) {
    if (att && att.embedded) out.push(...collectWarnings(att.embedded, `${prefix}In the attached message "${att.name}": `));
  }
  return out;
}

/**
 * The conversion boundary. bytes: Uint8Array or ArrayBuffer of a .msg file.
 * Returns the .eml bytes and file name plus the warnings to show; throws
 * ConversionError. Synchronous: in Thunderbird it runs in a Worker
 * (lib/convert-worker.js); a LookOut module can call it the same way.
 */
export function convertMsgBytes(core, bytes, fileName, options = {}) {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes || 0);
  if (u8.length === 0) throw new ConversionError(fileName, 'BAD_INPUT', userMessage(fileName, { code: 'BAD_INPUT' }));
  checkSize(fileName, u8.length);
  let out;
  try {
    out = core.convertMsgToEml(u8, options);
  } catch (e) {
    throw new ConversionError(fileName, (e && e.code) || 'UNEXPECTED', userMessage(fileName, e), e);
  }
  return { eml: out.eml, name: emlName(fileName), warnings: collectWarnings(out.report), report: out.report };
}

/** convertMsgBytes, with the .eml wrapped in a File ready for messageDisplay.open / messages.import. */
export function convertMsg(core, bytes, fileName, options = {}) {
  const r = convertMsgBytes(core, bytes, fileName, options);
  return { file: new File([r.eml], r.name, { type: EML_TYPE }), warnings: r.warnings, report: r.report };
}

/** True if the .eml's header block has a Message-ID. */
export function hasMessageId(eml) {
  const head = new TextDecoder('latin1').decode(eml.subarray(0, Math.min(eml.length, 65536)));
  const end = head.indexOf('\r\n\r\n');
  return /(^|\r\n)Message-ID:/i.test(end >= 0 ? head.slice(0, end) : head);
}

/** Shown on import when ensureMessageId added an id (not on open: there it changes nothing visible). */
export const ADDED_ID_NOTE = 'The file had no message ID, so one was added. Importing it twice into a folder will be refused.';

/**
 * Give a converted message with no Message-ID a stable one made from the
 * SHA-256 of the .msg file, so importing the same file twice is detected.
 * r: the result of convertMsgBytes; msgBytes: the .msg file. Async (WebCrypto).
 * Sets addedMessageId: true when it added one.
 */
export async function ensureMessageId(r, msgBytes) {
  if (hasMessageId(r.eml)) return r;
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', msgBytes));
  const hex = [...digest.slice(0, 16)].map((b) => b.toString(16).padStart(2, '0')).join('');
  const id = `<${hex}@msg-opener.invalid>`;
  const line = new TextEncoder().encode(`Message-ID: ${id}\r\n`);
  const eml = new Uint8Array(line.length + r.eml.length);
  eml.set(line, 0);
  eml.set(r.eml, line.length);
  return { ...r, eml, addedMessageId: true };
}

/**
 * A converter is an async function (ArrayBuffer, fileName, options) ->
 * {file, warnings}. This one runs in the calling thread (tests, fallback).
 */
export function inThreadConverter(core) {
  return async (buf, fileName, options) => {
    const bytes = new Uint8Array(buf);
    const r = await ensureMessageId(convertMsgBytes(core, bytes, fileName, options), bytes);
    return { file: new File([r.eml], r.name, { type: EML_TYPE }), warnings: r.warnings, report: r.report, addedMessageId: !!r.addedMessageId };
  };
}

/** Read a File / Blob (from a picker, a drop or getAttachmentFile) and convert it. */
export async function convertFile(convert, file, options) {
  const name = file && file.name;
  checkSize(name, file && file.size);
  let buf;
  try {
    buf = await file.arrayBuffer();
  } catch (e) {
    throw new ConversionError(name, 'BAD_INPUT', `"${name}" could not be read.`, e);
  }
  return convert(buf, name, options);
}

/** The list of messages shown in a tab, as an array (MV3 returns a MessageList). */
export function messagesOf(list) {
  if (!list) return [];
  if (Array.isArray(list)) return list;
  return Array.isArray(list.messages) ? list.messages : [];
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/** Wait until the tab shows a message, so an injected bar lands in its document. */
export async function waitForDisplay(api, tabId, { timeoutMs = 10000, stepMs = 100 } = {}) {
  const end = Date.now() + timeoutMs;
  for (;;) {
    try {
      if (messagesOf(await api.messageDisplay.getDisplayedMessages(tabId)).length) return true;
    } catch (e) {
      // the tab may be closed or not ready yet
    }
    if (Date.now() >= end) return false;
    await delay(stepMs);
  }
}

/**
 * Runs inside the displayed message (scripting.executeScript, func + args),
 * so it must be self-contained. The bar lives in a closed shadow root under a
 * host element with a random name, so the message's own HTML and CSS can
 * neither fake it nor style it away (the host's inline !important display
 * beats any author rule). Returns 'shown' only if the bar is actually visible.
 */
export function injectWarningBar(heading, warnings) {
  const rnd = (globalThis.crypto && crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2)).replace(/[^a-z0-9]/gi, '').toLowerCase();
  const host = document.createElement(`msg-opener-${rnd}`);
  for (const [k, v] of [['display', 'block'], ['visibility', 'visible'], ['opacity', '1'], ['position', 'static'], ['margin', '0 0 12px 0'],
    ['padding', '0'], ['border', '0'], ['height', 'auto'], ['width', 'auto'], ['max-height', 'none'], ['overflow', 'visible'],
    ['clip-path', 'none'], ['filter', 'none'], ['transform', 'none'], ['font-size', '13px'], ['line-height', '1.4']]) {
    host.style.setProperty(k, v, 'important');
  }
  const root = host.attachShadow({ mode: 'closed' });
  const bar = document.createElement('div');
  bar.setAttribute('role', 'status');
  Object.assign(bar.style, {
    all: 'initial', display: 'block', boxSizing: 'border-box', padding: '8px 12px',
    background: '#fff4ce', color: '#1f1f1f', border: '1px solid #c9a400', borderRadius: '4px',
    font: '13px/1.4 system-ui, sans-serif',
  });
  const close = document.createElement('button');
  close.type = 'button';
  close.textContent = '\u00d7';
  close.title = 'Close';
  close.setAttribute('aria-label', 'Close');
  Object.assign(close.style, { float: 'right', font: 'inherit', fontSize: '16px', lineHeight: '1', border: '0', background: 'transparent', color: 'inherit', cursor: 'pointer' });
  close.addEventListener('click', () => host.remove());
  const title = document.createElement('div');
  Object.assign(title.style, { fontWeight: '600', display: 'block' });
  title.textContent = heading;
  const list = document.createElement('ul');
  Object.assign(list.style, { margin: '4px 0 0 0', paddingLeft: '20px', display: 'block' });
  for (const w of warnings) {
    const li = document.createElement('li');
    li.style.display = 'list-item';
    li.textContent = w;
    list.append(li);
  }
  bar.append(close, title, list);
  root.append(bar);
  (document.body || document.documentElement).prepend(host);
  const r = bar.getBoundingClientRect();
  const cs = getComputedStyle(host);
  const visible = r.height > 0 && r.width > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' && Number(cs.opacity) > 0.1;
  if (!visible) {
    host.remove();
    return 'hidden';
  }
  return 'shown';
}

export function warningHeading(fileName, count) {
  return `Converted from "${fileName}". Some details differ from the original:`;
}

/**
 * Show the conversion warnings once, as a bar at the top of the opened
 * message. If the bar cannot be placed or is not visible, fall back to
 * showNotice so the warnings are never dropped. Returns 'none', 'bar' or 'notice'.
 */
export async function showWarnings(api, tab, fileName, warnings, showNotice, waitOptions) {
  if (!warnings || !warnings.length) return 'none';
  const heading = warningHeading(fileName, warnings.length);
  try {
    if (!tab || tab.id == null) throw new Error('no tab');
    if (!(await waitForDisplay(api, tab.id, waitOptions))) throw new Error('message not displayed in time');
    const res = await api.scripting.executeScript({ target: { tabId: tab.id }, func: injectWarningBar, args: [heading, warnings] });
    const r = Array.isArray(res) ? res[0] : res;
    if (r && r.error) throw r.error;
    if (!r || r.result !== 'shown') throw new Error('bar not visible');
    return 'bar';
  } catch (e) {
    await showNotice({ title: heading, lines: warnings });
    return 'notice';
  }
}

/**
 * Convert a .msg File and open it in a new message tab. location: 'tab' so
 * the "open messages in an existing window" setting cannot replace an earlier
 * message (and its bar) with this one.
 */
export async function openMsgFile(api, convert, file, { showNotice, options } = {}) {
  const { file: eml, warnings } = await convertFile(convert, file, options);
  const tab = await api.messageDisplay.open({ file: eml, location: 'tab', active: true });
  const shown = await showWarnings(api, tab, file.name, warnings, showNotice || (async () => {}));
  return { tab, warnings, shown };
}

/** Convert a .msg File and import it into a mail folder. */
export async function importMsgFile(api, convert, file, folderId, { options } = {}) {
  const { file: eml, warnings: converted, addedMessageId } = await convertFile(convert, file, options);
  const warnings = addedMessageId ? [...converted, ADDED_ID_NOTE] : converted;
  let header;
  try {
    header = await api.messages.import(eml, folderId);
  } catch (e) {
    const detail = e && e.message ? e.message : String(e);
    const dup = /message-id|already/i.test(detail);
    throw new ConversionError(file.name, dup ? 'DUPLICATE' : 'IMPORT_FAILED', dup
      ? `"${file.name}" was not imported: the folder already has a message with the same Message-ID.`
      : `"${file.name}" was converted but could not be imported: ${detail}`, e);
  }
  return { header, warnings };
}

/**
 * The message whose attachment was context-clicked. menus.onClicked passes a
 * tab, but in Thunderbird 140 a message opened in its own tab is reported
 * with a tab id that getDisplayedMessages() does not know (seen in the
 * headless smoke test). So: try that tab, then the active tab, and accept a
 * message only if it has every clicked attachment (same part name, file name,
 * size and content type) and is the only candidate that does. Two displayed
 * messages carrying the same attachment could still be confused; the result
 * is then a same-named, same-size file from the user's own other message.
 */
export async function findClickedMessage(api, tab, attachments) {
  const candidates = [];
  const tryList = async (fn) => {
    try {
      for (const m of messagesOf(await fn())) if (!candidates.some((c) => c.id === m.id)) candidates.push(m);
    } catch (e) {
      // unknown tab id, or nothing displayed
    }
  };
  if (tab && tab.id != null) await tryList(() => api.messageDisplay.getDisplayedMessages(tab.id));
  if (!candidates.length) await tryList(() => api.messageDisplay.getDisplayedMessages());
  if (!candidates.length) throw new Error('no message is displayed');
  const same = (l, a) => l.partName === a.partName && l.name === a.name
    && (a.size == null || l.size == null || l.size === a.size)
    && (!a.contentType || !l.contentType || l.contentType === a.contentType);
  const matches = [];
  for (const m of candidates) {
    let listed;
    try {
      listed = await api.messages.listAttachments(m.id);
    } catch (e) {
      continue;
    }
    if (attachments.every((a) => listed.some((l) => same(l, a)))) matches.push(m.id);
  }
  if (matches.length === 1) return matches[0];
  throw new Error(matches.length > 1 ? 'more than one displayed message has that attachment'
    : candidates.length > 1 ? 'more than one message is displayed' : 'the displayed message does not have that attachment');
}

/**
 * Menu flow: open each .msg attachment of the displayed message. Errors and
 * conversion problems go to showNotice; one bad attachment does not stop the
 * rest. progress(name) may return {done()}: a "Converting…" notice that the
 * flow closes when the file is open.
 */
export async function openMsgAttachments(api, convert, tab, attachments, { showNotice, progress, options } = {}) {
  const notice = showNotice || (async () => {});
  const atts = (attachments || []).filter(isMsgAttachment);
  const results = [];
  if (!atts.length) {
    await notice({ title: 'Nothing to open', lines: ['None of the selected attachments is an Outlook .msg file.'] });
    return results;
  }
  let messageId;
  try {
    messageId = await findClickedMessage(api, tab, atts);
  } catch (e) {
    await notice({ title: 'The attachment could not be opened', lines: [`Thunderbird did not say which message the attachment belongs to (${e.message}).`] });
    return results;
  }
  for (const att of atts) {
    let busy = null;
    try {
      checkSize(att.name, att.size);
      busy = progress && !(att.size < PROGRESS_MIN_BYTES) ? await progress(att.name) : null;
      const raw = await api.messages.getAttachmentFile(messageId, att.partName);
      const file = raw.name ? raw : new File([raw], att.name || 'attachment.msg');
      const named = file.name === att.name || !att.name ? file : new File([file], att.name, { type: file.type });
      const { file: eml, warnings } = await convertFile(convert, named, options);
      const tabOpened = await api.messageDisplay.open({ file: eml, location: 'tab', active: true });
      if (busy) await busy.done();
      busy = null;
      const shown = await showWarnings(api, tabOpened, named.name, warnings, notice);
      results.push({ name: att.name, tab: tabOpened, warnings, shown });
    } catch (e) {
      if (busy) await busy.done();
      const msg = e instanceof ConversionError ? e.message : `"${att.name}" could not be opened: ${e && e.message ? e.message : e}`;
      await notice({ title: 'The attachment could not be opened', lines: [msg] });
      results.push({ name: att.name, error: msg });
    }
  }
  return results;
}
