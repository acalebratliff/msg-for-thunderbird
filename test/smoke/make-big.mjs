// Write the large smoke-test files: big-20mb.msg (a synthetic message with a
// 20 MB attachment, built with the core's test helper) and huge-26mb.msg
// (26 MB, over the add-on's 25 MB cap; its content does not matter).
// usage: node make-big.mjs <out-dir>   (core checkout: ../msg-eml-core or $MSG_EML_CORE)
import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../..', import.meta.url));
const coreDir = resolve(process.env.MSG_EML_CORE || join(root, '..', 'msg-eml-core'));
const { buildMsg, T } = await import(pathToFileURL(join(coreDir, 'test', 'helpers', 'build-msg.js')).href);
const out = process.argv[2];
const data = new Uint8Array(20 * 1024 * 1024);
for (let i = 0; i < data.length; i++) data[i] = (i * 2654435761) >>> 24;
writeFileSync(join(out, 'big-20mb.msg'), buildMsg({
  props: [[T.MESSAGE_CLASS, 'IPM.Note'], [T.SUBJECT, 'Synthetic 20 MB message'], [T.BODY, 'Large attachment.'],
    [T.SUBMIT_TIME, new Date('2024-05-06T07:08:09Z')], [T.SENDER_NAME, 'Alice Example'], [T.SENDER_EMAIL, 'alice@example.com'], [T.SENDER_ADDRTYPE, 'SMTP']],
  attachments: [{ props: [[T.ATTACH_METHOD, 1], [T.ATTACH_LONG_FILENAME, 'big.bin'], [T.ATTACH_DATA, data]] }],
}));
writeFileSync(join(out, 'huge-26mb.msg'), new Uint8Array(26 * 1024 * 1024));
