const done = arguments[arguments.length - 1];
const [xpiPath, fixDir, carrierPath] = arguments;
(async () => {
  const log = [];
  const L = (k, v) => { log.push({ [k]: v }); try { Services.wm.getMostRecentWindow('mail:3pane').__smokeLog = JSON.stringify(log); } catch (e) {} };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const nsFile = (p) => { const f = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile); f.initWithPath(p); return f; };
  const waitFor = async (fn, ms = 10000) => { const end = Date.now() + ms; for (;;) { try { const v = await fn(); if (v) return v; } catch (e) {} if (Date.now() > end) return null; await sleep(100); } };
  try {
    const { AddonManager } = ChromeUtils.importESModule('resource://gre/modules/AddonManager.sys.mjs');
    const { ExtensionParent } = ChromeUtils.importESModule('resource://gre/modules/ExtensionParent.sys.mjs');
    const { MailServices } = ChromeUtils.importESModule('resource:///modules/MailServices.sys.mjs');
    L('appVersion', Services.appinfo.version);
    L('step', 'installing');
    const addon = await AddonManager.installTemporaryAddon(nsFile(xpiPath));
    L('installed', { id: addon.id, version: addon.version, active: addon.isActive, name: addon.name });
    const ext = await waitFor(() => ExtensionParent.GlobalManager.getExtension(addon.id));
    await sleep(1500);
    L('extension', { perms: [...ext.permissions].sort(), warnings: ext.warnings, errors: ext.errors, manifestVersion: ext.manifestVersion });
    const win = Services.wm.getMostRecentWindow('mail:3pane');
    const tabmail = win.document.getElementById('tabmail');
    const msgTabs = () => tabmail.tabInfo.filter((t) => t.mode.name === 'mailMessageTab');
    const tabDoc = (t) => t.chromeBrowser.contentWindow.getMessagePaneBrowser().contentDocument;
    const tabState = (t) => {
      const aboutMsg = t.chromeBrowser.contentWindow;
      const d = tabDoc(t);
      const bar = d.getElementById('msg-for-thunderbird-warnings');
      return {
        title: t.title,
        subject: aboutMsg.gMessage ? aboutMsg.gMessage.mime2DecodedSubject : null,
        body: d.body ? d.body.textContent.replace(/\s+/g, ' ').trim().slice(0, 160) : null,
        bar: bar ? bar.textContent.replace(/\s+/g, ' ').slice(0, 400) : null,
        attachments: [...aboutMsg.document.querySelectorAll('#attachmentList richlistitem')].map((i) => i.getAttribute('name') || i.attachment?.name),
      };
    };

    // ---- disk path: the add-on page with a file picked ----
    const before = msgTabs().length;
    const pageTab = tabmail.openTab('contentTab', { url: ext.baseURI.resolve('page/open.html') });
    const page = await waitFor(() => { const d = pageTab.browser.contentDocument; return d && d.getElementById('picker') && d.readyState === 'complete' ? d : null; });
    L('pageLoaded', { remote: pageTab.browser.isRemoteBrowser, title: page && page.title });
    if (page) {
      await sleep(500);
      const input = page.getElementById('picker');
      const files = [];
      for (const n of ['warnings.msg', 'nested.msg', 'not-a-msg.msg']) files.push(await File.createFromNsIFile(nsFile(fixDir + '/' + n)));
      input.mozSetFileArray(files);
      input.dispatchEvent(new pageTab.browser.contentWindow.Event('change', { bubbles: true }));
      await waitFor(() => page.querySelectorAll('#results > li').length >= 3, 20000);
      await sleep(2500);
      L('pageResults', [...page.querySelectorAll('#results > li')].map((li) => li.textContent.replace(/\s+/g, ' ').slice(0, 300)));
      L('openedTabs', msgTabs().slice(before).map(tabState));
    }

    // ---- attachment path: a stored message carrying .msg attachments ----
    try { MailServices.accounts.localFoldersServer; } catch (e) { MailServices.accounts.createLocalMailAccount(); }
    const root = MailServices.accounts.localFoldersServer.rootMsgFolder;
    let folder; try { folder = root.getChildNamed('Smoke'); } catch (e) { folder = null; }
    if (!folder) { root.createSubfolder('Smoke', null); folder = await waitFor(() => { try { return root.getChildNamed('Smoke'); } catch (e) { return null; } }); }
    await Promise.race([sleep(10000), new Promise((res) => MailServices.copy.copyFileMessage(nsFile(carrierPath), folder, null, false, 0, '', { OnStartCopy() {}, OnProgress() {}, SetMessageKey() {}, GetMessageId() {}, OnStopCopy(st) { res(st); } }, null))]);
    const hdr = await waitFor(() => [...folder.messages][0]);
    L('carrier', hdr && hdr.mime2DecodedSubject);

    async function clickMenuOn(tab, attName) {
      const aboutMsg = tab.chromeBrowser.contentWindow;
      const doc = aboutMsg.document;
      try { aboutMsg.toggleAttachmentList(true); } catch (e) {}
      const item = await waitFor(() => [...doc.querySelectorAll('#attachmentList richlistitem')].find((i) => (i.attachment && i.attachment.name) === attName));
      if (!item) return { error: `attachment ${attName} not listed` };
      doc.getElementById('attachmentList').selectItem(item);
      const popup = doc.getElementById('attachmentItemContext');
      const tries = [];
      const shownP = () => new Promise((r) => { popup.addEventListener('popupshown', () => r(true), { once: true }); setTimeout(() => r(false), 3000); });
      let p = shownP();
      const rect = item.getBoundingClientRect();
      tries.push({ rect: [rect.left, rect.top, rect.width, rect.height] });
      aboutMsg.windowUtils.sendMouseEvent('contextmenu', rect.left + 5, rect.top + 5, 2, 1, 0);
      tries.push({ sendMouseEvent: await p, state: popup.state });
      if (popup.state !== 'open') {
        p = shownP();
        const ev = new aboutMsg.MouseEvent('contextmenu', { bubbles: true, cancelable: true, button: 2, clientX: rect.left + 5, clientY: rect.top + 5 });
        popup.openPopupAtScreen(item.screenX + 5, item.screenY + 5, true, ev);
        tries.push({ openPopupAtScreen: await p, state: popup.state });
      }
      await sleep(800);
      const items = [...popup.querySelectorAll('menuitem')].filter((m) => /open-msg/.test(m.id));
      const info = items.map((m) => ({ id: m.id, label: m.label, hidden: m.hidden }));
      const target = items.find((m) => !m.hidden);
      if (!target) { try { popup.hidePopup(); } catch (e) {} return { error: 'menu item not visible', info, tries }; }
      popup.activateItem(target);
      return { clicked: target.label, info, tries };
    }
    // API-level check through the add-on page's own messenger object
    async function apiCheck(tab, label) {
      const m = pageTab.browser.contentWindow.wrappedJSObject.messenger;
      const tabId = ext.tabManager.getWrapper(tab).id;
      const out = { tabId };
      try {
        const list = await m.messageDisplay.getDisplayedMessages(tabId);
        const msgs = list.messages || list;
        out.displayed = [...msgs].map((x) => ({ id: x.id, subject: x.subject, external: x.external }));
        const atts = await m.messages.listAttachments(msgs[0].id);
        out.attachments = [...atts].map((a) => ({ name: a.name, partName: a.partName, contentType: a.contentType, size: a.size }));
        out.files = [];
        for (const a of atts) {
          const f = await m.messages.getAttachmentFile(msgs[0].id, a.partName);
          out.files.push({ name: f.name, size: f.size, type: f.type });
        }
      } catch (e) { out.error = String(e); }
      L('api:' + label, out);
    }
    const carrierTab = tabmail.openTab('mailMessageTab', { messageURI: folder.getUriForMsg(hdr), background: false });
    await waitFor(() => carrierTab.chromeBrowser.contentWindow.gMessage, 10000);
    await sleep(2000);
    L('carrierTab', tabState(carrierTab));
    await apiCheck(carrierTab, 'carrier');
    const pm = pageTab.browser.contentWindow.wrappedJSObject.messenger;
    const seen = [];
    win.__seen = seen;
    pm.menus.onClicked.addListener(Cu.exportFunction((info, tab) => { seen.push(JSON.stringify({ info, tab })); }, pageTab.browser.contentWindow));
    for (const name of ['warnings.msg', 'nested.msg', 'not-a-msg.msg']) {
      const n0 = msgTabs().length;
      const wins0 = [...Services.wm.getEnumerator(null)].length;
      tabmail.switchToTab(carrierTab);
      await sleep(1500);
      const r = await clickMenuOn(carrierTab, name);
      await sleep(4000);
      const newTabs = msgTabs().slice(n0).map(tabState);
      const notices = [...Services.wm.getEnumerator(null)].filter((w) => /notice\/notice\.html/.test(w.document.documentURI) || [...(w.document.querySelectorAll ? w.document.querySelectorAll('browser') : [])].some((b) => /notice\/notice\.html/.test(b.currentURI && b.currentURI.spec)));
      const noticeText = notices.map((w) => { const b = [...w.document.querySelectorAll('browser')].find((x) => /notice/.test(x.currentURI.spec)); return b && b.contentDocument ? b.contentDocument.body.textContent.replace(/\s+/g, ' ').trim() : '(no doc)'; });
      L(`attachment:${name}`, { seen: seen.splice(0), menu: r, newTabs, windowsBefore: wins0, notices: noticeText });
      for (const w of notices) w.close();
    }

    // ---- nested: .msg attached inside the converted (external) message ----
    const nestedTab = msgTabs().find((t) => { try { return /Synthetic outer message/.test(t.chromeBrowser.contentWindow.gMessage.mime2DecodedSubject); } catch (e) { return false; } });
    if (nestedTab) {
      tabmail.switchToTab(nestedTab);
      await sleep(1000);
      await apiCheck(nestedTab, 'external-nested');
      const n0 = msgTabs().length;
      const r = await clickMenuOn(nestedTab, 'attached copy.msg');
      await sleep(4000);
      L('nested:attached copy.msg', { menu: r, newTabs: msgTabs().slice(n0).map(tabState) });
      tabmail.switchToTab(nestedTab);
      await sleep(1500);
      L('menu-on-eml-attachment', await clickMenuOn(nestedTab, 'Inner embedded.eml'));
    } else L('nested', 'no converted outer message tab found');

    // ---- import path through the add-on page ----
    tabmail.switchToTab(pageTab);
    await sleep(1000);
    const imp = page.querySelector('input[name="mode"][value="import"]');
    imp.checked = true;
    imp.dispatchEvent(new pageTab.browser.contentWindow.Event('change', { bubbles: true }));
    const sel = page.getElementById('folder');
    await waitFor(() => sel.options.length > 0, 8000);
    const opts = [...sel.options].map((o) => o.textContent);
    const smokeOpt = [...sel.options].find((o) => /Smoke/.test(o.textContent));
    if (smokeOpt) sel.value = smokeOpt.value;
    const n0 = folder.getTotalMessages(false);
    const r0 = page.querySelectorAll('#results > li').length;
    const files = [];
    for (const n of ['simple.msg', 'simple.msg', 'truncated.msg']) files.push(await File.createFromNsIFile(nsFile(fixDir + '/' + n)));
    page.getElementById('picker').mozSetFileArray(files);
    page.getElementById('picker').dispatchEvent(new pageTab.browser.contentWindow.Event('change', { bubbles: true }));
    await waitFor(() => page.querySelectorAll('#results > li').length >= r0 + 3, 20000);
    await sleep(1500);
    L('import', { folderOptions: opts, chosen: smokeOpt && smokeOpt.textContent, before: n0, after: folder.getTotalMessages(false),
      results: [...page.querySelectorAll('#results > li')].slice(r0).map((li) => li.textContent.replace(/\s+/g, ' ')),
      subjects: [...folder.messages].map((h) => h.mime2DecodedSubject) });
  } catch (e) {
    L('fatal', String(e) + '\n' + (e.stack || ''));
  }
  L('end', true);
  done(log);
})();
