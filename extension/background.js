// Background (event page). Registers the attachment menu and the toolbar
// button, and runs the attachment flow. No network access is used anywhere.
import * as core from './core/msg-eml-core.js';
import { isMsgAttachment, openMsgAttachments } from './lib/glue.js';
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

// Show the entry only when a .msg attachment is under the pointer.
api.menus.onShown.addListener(async (info) => {
  if (!info.menuIds || !info.menuIds.includes(MENU_ID)) return;
  const n = (info.attachments || []).filter(isMsgAttachment).length;
  await api.menus.update(MENU_ID, {
    visible: n > 0,
    title: n > 1 ? `Open ${n} .msg attachments as messages` : 'Open as message',
  });
  await api.menus.refresh();
});

api.menus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== MENU_ID) return;
  openMsgAttachments(api, convert, tab, info.attachments, { showNotice, progress }).catch((e) =>
    showNotice({ title: 'The attachment could not be opened', lines: [String(e && e.message ? e.message : e)] }));
});

api.action.onClicked.addListener(() => {
  api.tabs.create({ url: '/page/open.html' });
});
