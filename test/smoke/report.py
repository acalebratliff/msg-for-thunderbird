# Turn the smoke log into pass/fail checks. Exits 1 if any check fails.
import json, sys
r = json.load(open(sys.argv[1]))
log = json.loads(r[1][3]['value'] or '[]') if isinstance(r[0], list) else r[3]['value']
d = {}
for x in log: d.update(x)
if '-v' in sys.argv: print(json.dumps(log, indent=1))
remote = d.get('pageRemote')
results = []
def check(name, fn, needs_page=False):
    if needs_page and remote:
        print('SKIP ' + name + ' (extension pages out of process)'); return
    try: ok = bool(fn())
    except Exception as e: ok = False; name += f' [{type(e).__name__}: {e}]'
    results.append(ok); print(('PASS ' if ok else 'FAIL ') + name)
ext = lambda: d['extension']
tabs_by = lambda key: {t['subject']: t for t in d[key]['tabs']}
def bar_ok(t): return t['bar'] and t['bar']['visible'] and t['bar']['closedShadow'] and 'Some details differ from the original' in t['bar']['text']
check('no fatal error in the harness', lambda: 'fatal' not in d and d.get('end'))
check('installs: MV3, active, no errors or warnings', lambda: ext()['manifestVersion'] == 3 and ext()['active'] and not ext()['errors'] and not ext()['warnings'])
check('install grants exactly the 5 declared permissions', lambda: ext()['perms'] == ['accountsRead', 'menus', 'messagesImport', 'messagesRead', 'scripting'])
check('disk: warnings.msg, nested.msg, hostile-css.msg open with a visible bar in a closed shadow root',
      lambda: all(bar_ok(tabs_by('disk')[s]) for s in ['Synthetic message with warnings', 'Synthetic outer message', 'Synthetic message hiding elements']), True)
check('disk: hidden body -> warnings go to a notice window instead',
      lambda: tabs_by('disk')['Synthetic message with a hidden body']['bar'] is None and any('hidden-body.msg' in n and 'Some details differ from the original' in n for n in d['disk']['notices']), True)
check('disk: not-a-msg.msg gets an honest error', lambda: any('"not-a-msg.msg" was not opened. It is not an Outlook .msg file.' in x for x in d['disk']['results']), True)
check('disk: 26 MB file refused by the size cap', lambda: any('was not opened. It is 26.0 MB, and this add-on opens files up to 25 MB.' in x for x in d['disk']['results']), True)
check('disk: 20 MB file opens', lambda: any('Opened' in x for x in d['disk-big']['results']) and d['disk-big']['tabs'], True)
check('attachment: warnings.msg opens with a visible bar', lambda: bar_ok(d['attachment:warnings.msg']['newTabs'][0]))
check('attachment: nested.msg opens', lambda: d['attachment:nested.msg']['newTabs'][0]['subject'] == 'Synthetic outer message')
check('attachment: not-a-msg.msg gives an error notice and opens nothing',
      lambda: not d['attachment:not-a-msg.msg']['newTabs'] and any('It is not an Outlook .msg file.' in n for n in d['attachment:not-a-msg.msg']['notices']))
check('attachment: 20 MB opens, "Converting" notice shown then closed',
      lambda: d['attachment:big-20mb.msg']['newTabs'] and any('Converting "big-20mb.msg"' in t for t in d['attachment:big-20mb.msg']['seen'])
      and not any('Converting' in n for n in d['attachment:big-20mb.msg']['notices']))
check('nested: .msg inside a converted (external) message opens', lambda: d['nested']['newTabs'][0]['subject'] == 'Synthetic plain message')
check('import folder list leaves out Trash', lambda: d['import']['folderOptions'] and not any('Trash' in o for o in d['import']['folderOptions']), True)
check('menu entry hidden on a non-.msg attachment (.eml)', lambda: d['menu-on-eml'].get('error') == 'menu item not visible')
check('menu: .msg -> .txt -> .msg: opens, hidden, then present and opens again',
      lambda: d['attachment:seq1:warnings.msg']['newTabs'] and d['attachment:seq2:notes.txt']['menu'].get('error') == 'menu item not visible'
      and d['attachment:seq3:warnings.msg']['menu'].get('clicked') and d['attachment:seq3:warnings.msg']['newTabs'])
check('import: with/without Message-ID each imported once, duplicates refused, damaged file reported',
      lambda: d['import']['radioChecked'] and d['import']['after'] == d['import']['before'] + 2
      and 'Imported into Local Folders › Smoke' in d['import']['results'][0] and 'That folder already has this message.' in d['import']['results'][1]
      and 'The file is damaged. Ask the sender for a new copy.' in d['import']['results'][2] and 'Details' in d['import']['results'][2]
      and 'Imported into Local Folders › Smoke' in d['import']['results'][3] and 'Note:The file had no message ID, so one was added.' in d['import']['results'][3].replace('Note: ', 'Note:') and 'Some details differ' not in d['import']['results'][3].split('Note:')[1] and 'That folder already has this message.' in d['import']['results'][4], True)
for k in ['disk-big', 'attachment:big-20mb.msg']:
    if k in d: print(f'info {k}: {d[k].get("ms")} ms, biggest UI-thread gap {d[k].get("uiMaxGapMs")} ms')
print(f'Thunderbird {d.get("appVersion")}, extensions remote: {d.get("remoteExtensions")}')
print(f'{sum(results)}/{len(results)} checks passed')
sys.exit(0 if all(results) else 1)
