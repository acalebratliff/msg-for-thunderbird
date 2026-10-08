# Headless Thunderbird smoke driver (raw Marionette protocol, chrome context).
# usage: python3 -I driver.py <profile-dir> <script.js> <json-args> <out.json>
import socket, json, subprocess, time, sys, os
prof, script, args, outp = sys.argv[1], sys.argv[2], json.loads(sys.argv[3]), sys.argv[4]
os.makedirs(prof, exist_ok=True)
with open(os.path.join(prof, 'user.js'), 'w') as f:
    for k, v in {
        'marionette.port': 2829, 'xpinstall.signatures.required': False, 'extensions.webextensions.remote': False,
        'mail.provider.suppress_dialog_on_startup': True, 'mailnews.start_page.enabled': False,
        'mail.shell.checkDefaultClient': False, 'mail.spotlight.firstRunDone': True,
        'datareporting.policy.dataSubmissionEnabled': False, 'app.update.auto': False, 'app.update.enabled': False,
        'mail.openMessageBehavior': 2, 'mail.rights.version': 1, 'toolkit.telemetry.enabled': False,
        'extensions.update.enabled': False, 'mailnews.auto_config_url': '', 'network.dns.disableIPv6': True,
    }.items():
        f.write(f'user_pref("{k}", {json.dumps(v)});\n')
log = open(os.path.join(prof, 'tb.log'), 'w')
p = subprocess.Popen(['thunderbird', '--headless', '--marionette', '-remote-allow-system-access', '--no-remote', '--profile', prof], stdout=log, stderr=log)
print('PID', p.pid, flush=True)
s = None
try:
    for _ in range(60):
        try:
            s = socket.create_connection(('127.0.0.1', 2829)); break
        except OSError:
            time.sleep(1)
    def rd():
        n = b''
        while not n.endswith(b':'): n += s.recv(1)
        L = int(n[:-1]); d = b''
        while len(d) < L: d += s.recv(L - len(d))
        return json.loads(d)
    i = 0
    def send(cmd, params):
        global i; i += 1
        m = json.dumps([0, i, cmd, params]).encode(); s.sendall(str(len(m)).encode() + b':' + m)
        return rd()
    rd(); send('WebDriver:NewSession', {})
    send('Marionette:SetContext', {'value': 'chrome'}); send('WebDriver:SetTimeouts', {'script': 180000})
    time.sleep(3)
    r = send('WebDriver:ExecuteAsyncScript', {'script': open(script).read(), 'args': args})
    if r[2] is None or r[3] is None:
        r2 = send('WebDriver:ExecuteScript', {'script': "return Services.wm.getMostRecentWindow('mail:3pane').__smokeLog || null;", 'args': []})
        r = [r, r2]
    json.dump(r, open(outp, 'w'), indent=1)
    print(json.dumps(r)[:3000])
finally:
    p.terminate()
    try: p.wait(20)
    except Exception: p.kill(); p.wait()
    print('exit', p.returncode)
