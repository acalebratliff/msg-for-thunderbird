// Module Worker: runs the conversion off the page / background thread, so a
// large file does not freeze Thunderbird's window. One worker per file; the
// caller terminates it afterwards, which also frees the memory.
import * as core from '../core/msg-eml-core.js';
import { convertMsgBytes, ensureMessageId } from './glue.js';

self.onmessage = async (ev) => {
  const { buf, fileName, options } = ev.data;
  try {
    const bytes = new Uint8Array(buf);
    const r = await ensureMessageId(convertMsgBytes(core, bytes, fileName, options), bytes);
    const eml = r.eml.buffer.byteLength === r.eml.byteLength ? r.eml.buffer : r.eml.slice().buffer;
    self.postMessage({ ok: true, eml, name: r.name, warnings: r.warnings, addedMessageId: !!r.addedMessageId }, [eml]);
  } catch (e) {
    self.postMessage({ ok: false, error: { code: e.code || 'UNEXPECTED', message: e.message || String(e), fileName: e.fileName || fileName, details: e.details } });
  }
};
