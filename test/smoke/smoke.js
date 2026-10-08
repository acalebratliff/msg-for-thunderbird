// Runs in Thunderbird's chrome context via Marionette (see driver.py).
// Logs observations; report.py turns them into pass/fail checks.
const done = arguments[arguments.length - 1];
const [xpiPath, fixDir, carrierPath, workDir] = arguments;
(async () => {
  const log = [];
  const L = (k, v) => { log.push({ [k]: v }); try { Services.wm.getMostRecentWindow('mail:3pane').__smokeLog = JSON.stringify(log); } catch (e) {} };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const nsFile = (p) => { const f = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile); f.initWithPath(p); return f; };
  const waitFor = async (fn, ms = 10000) => { const end = Date.now() + ms; for (;;) { try { const v = await fn(); if (v) return v; } catch (e) {} if (Date.now() > end) return null; await sleep(100); } };
  const text = (s) => String(s || '').replace(/\s+/g, ' ').trim();
  try {
    const { AddonManager } = ChromeUtils.importESModule('resource://gre/modules/AddonManager.sys.mjs');
    const { ExtensionParent } = ChromeUtils.importESModule('resource://gre/modules/ExtensionParent.sys.mjs');
    const { MailServices } = ChromeUtils.importESModule('resource:///modules/MailServices.sys.mjs');
    L('appVersion', Services.appinfo.version);
    L('remoteExtensions', Services.prefs.getBoolPref('extensions.webextensions.remote'));
    const addon = await AddonManager.installTemporaryAddon(nsFile(xpiPath));
    const ext = await waitFor(() => ExtensionParent.GlobalManager.getExtension(addon.id));
    await sleep(1500);
    const perms = () => [...ext.permissions].filter((p) => !p.startsWith('internal:')).sort();
    L('extension', { id: addon.id, active: addon.isActive, manifestVersion: ext.manifestVersion, perms: perms(), warnings: ext.warnings, errors: ext.errors });

    const win = Services.wm.getMostRecentWindow('mail:3pane');
    const tabmail = win.document.getElementById('tabmail');
    const msgTabs = () => tabmail.tabInfo.filter((t) => t.mode.name === 'mailMessageTab');
    // Event-loop lag in the main (UI) process: the biggest gap between 50 ms ticks.
    let lastTick = Date.now(); let maxGap = 0;
    const ticker = setInterval(() => { const now = Date.now(); maxGap = Math.max(maxGap, now - lastTick); lastTick = now; }, 50);
    const resetLag = () => { lastTick = Date.now(); maxGap = 0; };

    const findBar = (doc) => {
      const host = [...doc.querySelectorAll('*')].find((e) => e.localName.startsWith('msg-opener-'));
      if (!host) return null;
      const root = host.openOrClosedShadowRoot;
      const r = host.getBoundingClientRect();
      return { text: text(root && root.textContent).slice(0, 400), visible: r.height > 0 && r.width > 0, closedShadow: !!root && !host.shadowRoot };
    };
    const tabState = (t) => {
      const aboutMsg = t.chromeBrowser.contentWindow;
      const d = aboutMsg.getMessagePaneBrowser().contentDocument;
      return {
        subject: aboutMsg.gMessage ? aboutMsg.gMessage.mime2DecodedSubject : null,
        body: d.body ? text(d.body.textContent).slice(0, 120) : null,
        bar: findBar(d),
        attachments: [...aboutMsg.document.querySelectorAll('#attachmentList richlistitem')].map((i) => i.attachment && i.attachment.name),
      };
    };
    // Notice windows (errors, warnings fallback, "Converting…"); seen titles are recorded while polling.
    const noticeWindows = () => [...Services.wm.getEnumerator(null)].map((w) => {
      const b = w.document && [...w.document.querySelectorAll('browser')].find((x) => x.currentURI && /notice\/notice\.html/.test(x.currentURI.spec));
      return b ? { w, b } : null;
    }).filter(Boolean);
    const noticeTexts = () => noticeWindows().map(({ b }) => {
      try { return text(b.contentDocument.body.textContent); } catch (e) { try { const j = JSON.parse(decodeURIComponent(b.currentURI.ref || '')); return text(`${j.title} ${(j.lines || []).join(' ')}`); } catch (e2) { return decodeURIComponent(b.currentURI.ref || ''); } }
    });
    const closeNotices = () => { for (const { w } of noticeWindows()) w.close(); };
    const seenTitles = new Set();
    const watcher = setInterval(() => { for (const t of noticeTexts()) seenTitles.add(t.slice(0, 80)); }, 100);

    // ---- disk path and import: the add-on page (needs in-process extensions to reach its DOM) ----
    const pageTab = tabmail.openTab('contentTab', { url: ext.baseURI.resolve('page/open.html') });
    await sleep(2000);
    const pageRemote = pageTab.browser.isRemoteBrowser;
    L('pageRemote', pageRemote);
    let page = null;
    if (!pageRemote) {
      page = await waitFor(() => { const d = pageTab.browser.contentDocument; return d && d.getElementById('picker') && d.readyState === 'complete' ? d : null; });
      const pwin = pageTab.browser.contentWindow;
      const pick = async (names) => {
        const r0 = page.querySelectorAll('#results > li').length;
        const files = [];
        for (const n of names) files.push(await File.createFromNsIFile(nsFile(n.startsWith('/') ? n : `${fixDir}/${n}`)));
        page.getElementById('picker').mozSetFileArray(files);
        page.getElementById('picker').dispatchEvent(new pwin.Event('change', { bubbles: true }));
        await waitFor(() => { const lis = [...page.querySelectorAll('#results > li')].slice(r0); return lis.length >= names.length && lis.every((li) => !/Converting…/.test(li.textContent)); }, 120000);
        await sleep(2500);
        return [...page.querySelectorAll('#results > li')].slice(r0).map((li) => text(li.textContent).slice(0, 300));
      };
      const before = msgTabs().length;
      closeNotices();
      const results = await pick(['warnings.msg', 'nested.msg', 'not-a-msg.msg', 'hostile-css.msg', 'hidden-body.msg', `${workDir}/huge-26mb.msg`]);
      await sleep(1500);
      L('disk', { results, tabs: msgTabs().slice(before).map(tabState), notices: noticeTexts() });
      closeNotices();
      // 20 MB: time it and watch the UI thread
      const b2 = msgTabs().length;
      resetLag();
      const t0 = Date.now();
      const bigRes = await pick([`${workDir}/big-20mb.msg`]);
      L('disk-big', { results: bigRes, ms: Date.now() - t0 - 2500, uiMaxGapMs: maxGap, tabs: msgTabs().slice(b2).map(tabState) });
    }

    // ---- attachment path: a stored message carrying .msg attachments ----
    try { MailServices.accounts.localFoldersServer; } catch (e) { MailServices.accounts.createLocalMailAccount(); }
    const root = MailServices.accounts.localFoldersServer.rootMsgFolder;
    let folder; try { folder = root.getChildNamed('Smoke'); } catch (e) { folder = null; }
    if (!folder) { root.createSubfolder('Smoke', null); folder = await waitFor(() => { try { return root.getChildNamed('Smoke'); } catch (e) { return null; } }); }
    await Promise.race([sleep(20000), new Promise((res) => MailServices.copy.copyFileMessage(nsFile(carrierPath), folder, null, false, 0, '', { OnStartCopy() {}, OnProgress() {}, SetMessageKey() {}, GetMessageId() {}, OnStopCopy(st) { res(st); } }, null))]);
    const hdr = await waitFor(() => [...folder.messages][0]);

    async function clickMenuOn(tab, attName) {
      tabmail.switchToTab(tab);
      await sleep(1500);
      const aboutMsg = tab.chromeBrowser.contentWindow;
      const doc = aboutMsg.document;
      try { aboutMsg.toggleAttachmentList(true); } catch (e) {}
      const item = await waitFor(() => [...doc.querySelectorAll('#attachmentList richlistitem')].find((i) => (i.attachment && i.attachment.name) === attName));
      if (!item) return { error: `attachment ${attName} not listed` };
      doc.getElementById('attachmentList').selectItem(item);
      const popup = doc.getElementById('attachmentItemContext');
      const shownP = () => new Promise((r) => { popup.addEventListener('popupshown', () => r(true), { once: true }); setTimeout(() => r(false), 4000); });
      const rect = item.getBoundingClientRect();
      let p = shownP();
      try { aboutMsg.windowUtils.sendMouseEvent('contextmenu', rect.left + 5, rect.top + 5, 2, 1, 0); } catch (e) { /* not in newer Gecko */ }
      await p;
      if (popup.state !== 'open') {
        // Newer Gecko has no windowUtils.sendMouseEvent: dispatch a contextmenu on the item and open the popup with it.
        p = shownP();
        const ev = new aboutMsg.MouseEvent('contextmenu', { bubbles: true, cancelable: true, button: 2, clientX: rect.left + 5, clientY: rect.top + 5 });
        item.dispatchEvent(ev);
        await sleep(300);
        if (popup.state !== 'open') popup.openPopupAtScreen(item.screenX + 5, item.screenY + 5, true, ev);
        await p;
      }
      await sleep(800);
      const target = [...popup.querySelectorAll('menuitem')].find((m) => /open-msg/.test(m.id) && !m.hidden);
      if (!target) { try { popup.hidePopup(); } catch (e) {} return { error: 'menu item not visible' }; }
      popup.activateItem(target);
      return { clicked: target.label };
    }
    const carrierTab = tabmail.openTab('mailMessageTab', { messageURI: folder.getUriForMsg(hdr), background: false });
    await waitFor(() => carrierTab.chromeBrowser.contentWindow.gMessage, 10000);
    await sleep(2000);
    // warnings.msg -> notes.txt -> warnings.msg: the entry must come back after a non-.msg attachment.
    const seq = [['warnings.msg', 'seq1'], ['notes.txt', 'seq2'], ['warnings.msg', 'seq3']];
    for (const [name, key] of seq) {
      closeNotices();
      const n0 = msgTabs().length;
      const menu = await clickMenuOn(carrierTab, name);
      if (menu.clicked) await waitFor(() => msgTabs().length > n0, 15000);
      await sleep(1500);
      L(`attachment:${key}:${name}`, { menu, newTabs: msgTabs().slice(n0).map((t) => tabState(t).subject) });
    }
    for (const name of ['warnings.msg', 'nested.msg', 'not-a-msg.msg', 'big-20mb.msg']) {
      closeNotices();
      seenTitles.clear();
      const n0 = msgTabs().length;
      resetLag();
      const t0 = Date.now();
      const menu = await clickMenuOn(carrierTab, name);
      const opened = await waitFor(() => msgTabs().length > n0 || noticeTexts().some((t) => /could not be opened/.test(t)), 60000);
      const ms = Date.now() - t0;
      await sleep(3000);
      L(`attachment:${name}`, { menu, ms, uiMaxGapMs: maxGap, opened: !!opened, newTabs: msgTabs().slice(n0).map(tabState), notices: noticeTexts(), seen: [...seenTitles] });
    }
    closeNotices();

    // ---- nested: .msg attached inside the converted (external) message; menu absent on .eml ----
    const nestedTab = msgTabs().find((t) => { try { return /Synthetic outer message/.test(t.chromeBrowser.contentWindow.gMessage.mime2DecodedSubject); } catch (e) { return false; } });
    if (nestedTab) {
      const n0 = msgTabs().length;
      const menu = await clickMenuOn(nestedTab, 'attached copy.msg');
      await waitFor(() => msgTabs().length > n0, 15000);
      await sleep(2000);
      L('nested', { menu, newTabs: msgTabs().slice(n0).map(tabState) });
      L('menu-on-eml', await clickMenuOn(nestedTab, 'Inner embedded.eml'));
    } else L('nested', { error: 'no converted outer message tab' });

    // ---- import: optional permissions requested by a real click on the radio ----
    if (page) {
      tabmail.switchToTab(pageTab);
      await sleep(1000);
      const pwin = pageTab.browser.contentWindow;
      const radio = page.querySelector('input[name="mode"][value="import"]');
      radio.click();
      const sel = page.getElementById('folder');
      await waitFor(() => sel.options.length > 0, 10000);
      const smokeOpt = [...sel.options].find((o) => /Smoke/.test(o.textContent));
      if (smokeOpt) sel.value = smokeOpt.value;
      const n0 = folder.getTotalMessages(false);
      const r0 = page.querySelectorAll('#results > li').length;
      const files = [];
      for (const n of ['simple.msg', 'simple.msg', 'truncated.msg', 'warnings.msg', 'warnings.msg']) files.push(await File.createFromNsIFile(nsFile(`${fixDir}/${n}`)));
      page.getElementById('picker').mozSetFileArray(files);
      page.getElementById('picker').dispatchEvent(new pwin.Event('change', { bubbles: true }));
      await waitFor(() => { const lis = [...page.querySelectorAll('#results > li')].slice(r0); return lis.length >= 5 && lis.every((li) => !/Converting…/.test(li.textContent)); }, 30000);
      await sleep(1500);
      L('import', { radioChecked: radio.checked, folderOptions: [...sel.options].map((o) => o.textContent),
        before: n0, after: folder.getTotalMessages(false),
        results: [...page.querySelectorAll('#results > li')].slice(r0).map((li) => text(li.textContent)),
        allRows: [...page.querySelectorAll('#results > li')].map((li) => text(li.textContent).slice(0, 160)) });
    }
    clearInterval(ticker);
    clearInterval(watcher);
  } catch (e) {
    L('fatal', String(e) + '\n' + (e.stack || ''));
  }
  L('end', true);
  done(log);
})();
