// Regenerate the synthetic .msg test fixtures in test/fixtures with the
// core's own test helper (msg-eml-core/test/helpers/build-msg.js). No real
// mail is used. Core checkout: ../msg-eml-core or $MSG_EML_CORE.
//   node scripts/make-fixtures.mjs
import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const coreDir = resolve(process.env.MSG_EML_CORE || join(root, '..', 'msg-eml-core'));
const { buildMsg, T } = await import(pathToFileURL(join(coreDir, 'test', 'helpers', 'build-msg.js')).href);
const out = (name, bytes) => writeFileSync(join(root, 'test', 'fixtures', name), bytes);
const when = new Date('2024-05-06T07:08:09Z');

const alice = [[T.SENDER_NAME, 'Alice Example'], [T.SENDER_EMAIL, 'alice@example.com'], [T.SENDER_ADDRTYPE, 'SMTP']];
const bob = { props: [[T.DISPLAY_NAME, 'Bob Example'], [T.EMAIL_ADDRESS, 'bob@example.org'], [T.ADDRTYPE, 'SMTP'], [T.RECIPIENT_TYPE, 1]] };

// 1. A plain message that converts with no warnings.
const simpleSpec = {
  props: [[T.MESSAGE_CLASS, 'IPM.Note'], [T.SUBJECT, 'Synthetic plain message'], [T.BODY, 'Hello from a synthetic .msg file.'],
    [T.SUBMIT_TIME, when], [T.INTERNET_MESSAGE_ID, '<simple.fixture@example.com>'], ...alice],
  recipients: [bob],
};
const simple = buildMsg(simpleSpec);
out('simple.msg', simple);

// 2. Sender with only an Exchange (X.500) address and no date: warnings.
out('warnings.msg', buildMsg({
  props: [[T.MESSAGE_CLASS, 'IPM.Note'], [T.SUBJECT, 'Synthetic message with warnings'], [T.BODY, 'Sender has no SMTP address.'],
    [T.SENDER_NAME, 'Exchange Person'], [T.SENDER_EMAIL, '/O=EXAMPLE/OU=FIRST/CN=RECIPIENTS/CN=PERSON'], [T.SENDER_ADDRTYPE, 'EX']],
  recipients: [bob],
}));

// 3. Nesting: an embedded message (with its own warning) and a .msg file attachment.
out('nested.msg', buildMsg({
  props: [[T.MESSAGE_CLASS, 'IPM.Note'], [T.SUBJECT, 'Synthetic outer message'], [T.BODY, 'See the attached messages.'],
    [T.SUBMIT_TIME, when], [T.INTERNET_MESSAGE_ID, '<nested.fixture@example.com>'], ...alice],
  recipients: [bob],
  attachments: [
    { props: [[T.ATTACH_METHOD, 5], [T.ATTACH_DISPLAY_NAME, 'Inner embedded']],
      embedded: { props: [[T.MESSAGE_CLASS, 'IPM.Note'], [T.SUBJECT, 'Synthetic embedded message'], [T.BODY, 'Embedded body, no date.'], ...alice] } },
    { props: [[T.ATTACH_METHOD, 1], [T.ATTACH_LONG_FILENAME, 'attached copy.msg'], [T.ATTACH_FILENAME, 'ATTACH~1.MSG'],
      [T.ATTACH_MIME, 'application/vnd.ms-outlook'], [T.ATTACH_DATA, simple]] },
  ],
}));

// 4. Not an Outlook file at all.
out('not-a-msg.msg', new TextEncoder().encode('This is a plain text file with a .msg name.\n'));

// 5. A real .msg cut short.
out('truncated.msg', simple.slice(0, 1536));
console.log('fixtures written');
