# Write carrier.eml: a message with three .msg attachments from test/fixtures,
# used by the smoke test for the attachment path.
# usage: python3 -I make-carrier.py <fixtures-dir> <out.eml>
import base64, sys
fx, out = sys.argv[1], sys.argv[2]
def part(name):
    b = base64.encodebytes(open(f'{fx}/{name}', 'rb').read()).decode().replace('\n', '\r\n')
    return (f'--BOUND\r\nContent-Type: application/vnd.ms-outlook; name="{name}"\r\n'
            f'Content-Disposition: attachment; filename="{name}"\r\nContent-Transfer-Encoding: base64\r\n\r\n{b}')
eml = ('From: Sender <sender@example.com>\r\nTo: Rcpt <rcpt@example.org>\r\nSubject: Carrier with msg attachments\r\n'
       'Date: Mon, 06 May 2024 07:08:09 +0000\r\nMessage-ID: <carrier@example.com>\r\nMIME-Version: 1.0\r\n'
       'Content-Type: multipart/mixed; boundary="BOUND"\r\n\r\n'
       '--BOUND\r\nContent-Type: text/plain; charset=utf-8\r\n\r\nThree attachments.\r\n'
       + part('nested.msg') + part('warnings.msg') + part('not-a-msg.msg') + '--BOUND--\r\n')
open(out, 'w', newline='').write(eml)
