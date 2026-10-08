// The add-on's glue: the one conversion function (the boundary another
// add-on, such as LookOut, could take together with the core) and the flows
// around it. Nothing here touches globals: the core module and the messenger
// API are passed in, so the same code runs in Thunderbird and under node:test
// with fakes.

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
 * Returns the .eml as a File plus the warnings to show; throws ConversionError.
 */
export function convertMsg(core, bytes, fileName, options = {}) {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes || 0);
  if (u8.length === 0) throw new ConversionError(fileName, 'BAD_INPUT', userMessage(fileName, { code: 'BAD_INPUT' }));
  let out;
  try {
    out = core.convertMsgToEml(u8, options);
  } catch (e) {
    throw new ConversionError(fileName, (e && e.code) || 'UNEXPECTED', userMessage(fileName, e), e);
  }
  const file = new File([out.eml], emlName(fileName), { type: EML_TYPE });
  return { file, warnings: collectWarnings(out.report), report: out.report };
}

/** Read a File / Blob (from a picker, a drop or getAttachmentFile) and convert it. */
export async function convertFile(core, file, options) {
  let buf;
  try {
    buf = await file.arrayBuffer();
  } catch (e) {
    throw new ConversionError(file && file.name, 'BAD_INPUT', `"${file && file.name}" could not be read.`, e);
  }
  return convertMsg(core, buf, file && file.name, options);
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
 * so it must be self-contained. Builds the bar with DOM calls only.
 */
export function injectWarningBar(heading, warnings) {
  const ID = 'msg-for-thunderbird-warnings';
  if (document.getElementById(ID)) return 'present';
  const bar = document.createElement('div');
  bar.id = ID;
  bar.setAttribute('role', 'status');
  Object.assign(bar.style, {
    all: 'initial', display: 'block', boxSizing: 'border-box', margin: '0 0 12px 0', padding: '8px 12px',
    background: '#fff4ce', color: '#1f1f1f', border: '1px solid #c9a400', borderRadius: '4px',
    font: '13px/1.4 system-ui, sans-serif',
  });
  const close = document.createElement('button');
  close.type = 'button';
  close.textContent = '×';
  close.title = 'Close';
  close.setAttribute('aria-label', 'Close');
  Object.assign(close.style, { float: 'right', font: 'inherit', fontSize: '16px', lineHeight: '1', border: '0', background: 'transparent', color: 'inherit', cursor: 'pointer' });
  close.addEventListener('click', () => bar.remove());
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
  const host = document.body || document.documentElement;
  host.prepend(bar);
  return 'shown';
}

export function warningHeading(fileName, count) {
  return `Converted from "${fileName}". ${count === 1 ? 'One thing' : `${count} things`} could not be carried over exactly:`;
}

/**
 * Show the conversion warnings once, as a bar at the top of the opened
 * message. If the bar cannot be placed, fall back to showNotice so the
 * warnings are never dropped. Returns 'none', 'bar' or 'notice'.
 */
export async function showWarnings(api, tab, fileName, warnings, showNotice) {
  if (!warnings || !warnings.length) return 'none';
  const heading = warningHeading(fileName, warnings.length);
  try {
    if (!tab || tab.id == null) throw new Error('no tab');
    if (!(await waitForDisplay(api, tab.id))) throw new Error('message not displayed in time');
    const res = await api.scripting.executeScript({ target: { tabId: tab.id }, func: injectWarningBar, args: [heading, warnings] });
    const r = Array.isArray(res) ? res[0] : res;
    if (r && r.error) throw r.error;
    if (!r || (r.result !== 'shown' && r.result !== 'present')) throw new Error('bar not placed');
    return 'bar';
  } catch (e) {
    await showNotice({ title: heading, lines: warnings });
    return 'notice';
  }
}

/** Convert a .msg File and open it in Thunderbird's message viewer. */
export async function openMsgFile(api, core, file, { showNotice, options } = {}) {
  const { file: eml, warnings } = await convertFile(core, file, options);
  const tab = await api.messageDisplay.open({ file: eml, active: true });
  const shown = await showWarnings(api, tab, file.name, warnings, showNotice || (async () => {}));
  return { tab, warnings, shown };
}

/** Convert a .msg File and import it into a mail folder. */
export async function importMsgFile(api, core, file, folderId, { options } = {}) {
  const { file: eml, warnings } = await convertFile(core, file, options);
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

/** The single message shown in a tab (the one whose attachment was clicked). */
export async function displayedMessageId(api, tabId) {
  const msgs = messagesOf(await api.messageDisplay.getDisplayedMessages(tabId));
  if (msgs.length !== 1) throw new Error(msgs.length ? 'more than one message is displayed' : 'no message is displayed');
  return msgs[0].id;
}

/**
 * Menu flow: open each .msg attachment of the displayed message. Errors and
 * conversion problems go to showNotice; one bad attachment does not stop the rest.
 */
export async function openMsgAttachments(api, core, tab, attachments, { showNotice, options } = {}) {
  const notice = showNotice || (async () => {});
  const atts = (attachments || []).filter(isMsgAttachment);
  const results = [];
  if (!atts.length) {
    await notice({ title: 'Nothing to open', lines: ['None of the selected attachments is an Outlook .msg file.'] });
    return results;
  }
  let messageId;
  try {
    messageId = await displayedMessageId(api, tab && tab.id);
  } catch (e) {
    await notice({ title: 'The attachment could not be opened', lines: [`Thunderbird did not say which message the attachment belongs to (${e.message}).`] });
    return results;
  }
  for (const att of atts) {
    try {
      const raw = await api.messages.getAttachmentFile(messageId, att.partName);
      const file = raw.name ? raw : new File([raw], att.name || 'attachment.msg');
      const named = file.name === att.name || !att.name ? file : new File([file], att.name, { type: file.type });
      results.push({ name: att.name, ...(await openMsgFile(api, core, named, { showNotice: notice, options })) });
    } catch (e) {
      const msg = e instanceof ConversionError ? e.message : `"${att.name}" could not be opened: ${e && e.message ? e.message : e}`;
      await notice({ title: 'The attachment could not be opened', lines: [msg] });
      results.push({ name: att.name, error: msg });
    }
  }
  return results;
}
