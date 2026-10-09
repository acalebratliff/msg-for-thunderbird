// Background (event page). Registers the attachment menu and the toolbar
// button, and runs the attachment flow. No network access is used anywhere.
import * as core from './core/msg-eml-core.js';
import { openMsgAttachments, menuStateFor, NOTICE_TITLE } from './lib/glue.js';
import { makeShowNotice, makeProgress } from './lib/notice.js';
import { workerConverter } from './lib/worker-converter.js';

const api = globalThis.messenger;
const showNotice = makeShowNotice(api);
const progress = makeProgress(api);
const convert = workerConverter(core);
const MENU_ID = 'open-msg';

async function createMenus() {
  await api.menus.removeAll();
  api.menus.create({
    id: MENU_ID,
    title: 'Open as message',
    contexts: ['message_attachments', 'all_message_attachments'],
  });
}

api.runtime.onInstalled.addListener(createMenus);
api.runtime.onStartup.addListener(createMenus);

// Show the entry only when a .msg attachment is under the pointer. Decide
// from the menu's contexts, not info.menuIds: Thunderbird leaves a hidden item
// out of menuIds, so a guard on it would never show the item again. Set the
// visibility explicitly on every attachment menu.
api.menus.onShown.addListener(async (info) => {
  const state = menuStateFor(info);
  if (!state) return;
  await api.menus.update(MENU_ID, state);
  await api.menus.refresh();
});

api.menus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== MENU_ID) return;
  openMsgAttachments(api, convert, tab, info.attachments, { showNotice, progress }).catch((e) =>
    showNotice({ title: NOTICE_TITLE, lines: [String(e && e.message ? e.message : e)] }));
});

// A "Converting…" window that opened after its conversion finished asks here.
api.runtime.onMessage.addListener((msg) => {
  if (msg && msg.type === 'notice-active') return Promise.resolve(progress.isActive(msg.token));
  return undefined;
});

api.action.onClicked.addListener(() => {
  api.tabs.create({ url: '/page/open.html' });
});
