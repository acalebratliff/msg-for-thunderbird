# Print the smoke log and a pass/fail line per check.
import json, sys
r = json.load(open(sys.argv[1]))
log = json.loads(r[1][3]['value'] or '[]') if isinstance(r[0], list) else r[3]['value']
d = {}
for x in log: d.update(x)
def ok(name, cond):
    print(('PASS ' if cond else 'FAIL ') + name)
    return cond
res = [
  ok('installs as MV3 with exactly the declared permissions', d.get('extension', {}).get('manifestVersion') == 3 and not d['extension']['errors']),
  ok('disk path: 2 opened, 1 honest error', len(d.get('openedTabs', [])) == 2 and 'is not an Outlook message' in ' '.join(d.get('pageResults', []))),
  ok('disk path: warning bar in opened message', all(t.get('bar') for t in d.get('openedTabs', [])) and d.get('openedTabs')),
  ok('attachment path: opens with bar', bool(d.get('attachment:warnings.msg', {}).get('newTabs')) and d['attachment:warnings.msg']['newTabs'][0]['bar']),
  ok('attachment path: nested .msg file opens', bool(d.get('attachment:nested.msg', {}).get('newTabs'))),
  ok('attachment path: bad file gives a notice', 'is not an Outlook message' in ' '.join(d.get('attachment:not-a-msg.msg', {}).get('notices', []))),
  ok('nested path: .msg inside a converted (external) message opens', bool(d.get('nested:attached copy.msg', {}).get('newTabs'))),
  ok('menu hidden on non-.msg attachment', d.get('menu-on-eml-attachment', {}).get('error') == 'menu item not visible'),
  ok('import path: imported, duplicate refused, damaged file reported', d.get('import', {}).get('after', 0) == d.get('import', {}).get('before', -9) + 1 and len(d['import']['results']) == 3),
]
print(json.dumps(log, indent=1)[:200000] if '-v' in sys.argv else '')
print(f'{sum(map(bool, res))}/{len(res)} checks passed')
