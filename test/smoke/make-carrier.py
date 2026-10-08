# Write a carrier .eml: one message with the given .msg files and a notes.txt attached.
# usage: python3 -I make-carrier.py <out.eml> <file.msg>...
import base64, os, sys
out, files = sys.argv[1], sys.argv[2:]
def part(path):
    name = os.path.basename(path)
    b = base64.encodebytes(open(path, 'rb').read()).decode().replace('\n', '\r\n')
    return (f'--BOUND\r\nContent-Type: application/vnd.ms-outlook; name="{name}"\r\n'
            f'Content-Disposition: attachment; filename="{name}"\r\nContent-Transfer-Encoding: base64\r\n\r\n{b}')
eml = ('From: Sender <sender@example.com>\r\nTo: Rcpt <rcpt@example.org>\r\nSubject: Carrier with msg attachments\r\n'
       'Date: Mon, 06 May 2024 07:08:09 +0000\r\nMessage-ID: <carrier@example.com>\r\nMIME-Version: 1.0\r\n'
       'Content-Type: multipart/mixed; boundary="BOUND"\r\n\r\n'
       '--BOUND\r\nContent-Type: text/plain; charset=utf-8\r\n\r\nAttachments for the smoke test.\r\n'
       + ''.join(part(f) for f in files)
       + '--BOUND\r\nContent-Type: text/plain; name="notes.txt"\r\nContent-Disposition: attachment; filename="notes.txt"\r\n\r\nA text attachment.\r\n'
       + '--BOUND--\r\n')
open(out, 'w', newline='').write(eml)
