// A converter (see glue.js) that runs each conversion in its own module
// Worker (lib/convert-worker.js). If a Worker cannot be started, it converts
// in the calling thread instead, so the add-on still works.
import { ConversionError, EML_TYPE, inThreadConverter } from './glue.js';

export function workerConverter(core, workerUrl = new URL('./convert-worker.js', import.meta.url)) {
  const fallback = inThreadConverter(core);
  return async (buf, fileName, options) => {
    let worker;
    try {
      worker = new Worker(workerUrl, { type: 'module' });
    } catch (e) {
      return fallback(buf, fileName, options);
    }
    try {
      const data = await new Promise((resolve, reject) => {
        worker.onmessage = (ev) => resolve(ev.data);
        worker.onerror = (ev) => reject(new Error(ev.message || 'the converter stopped'));
        worker.onmessageerror = () => reject(new Error('the converter sent an unreadable reply'));
        worker.postMessage({ buf, fileName, options: options || {} }, [buf]);
      });
      if (!data.ok) throw new ConversionError(data.error.fileName, data.error.code, data.error.message);
      return { file: new File([data.eml], data.name, { type: EML_TYPE }), warnings: data.warnings, addedMessageId: !!data.addedMessageId };
    } catch (e) {
      if (e instanceof ConversionError) throw e;
      throw new ConversionError(fileName, 'UNEXPECTED', `"${fileName}" could not be converted because of an unexpected error: ${e.message || e}`, e);
    } finally {
      worker.terminate();
    }
  };
}
