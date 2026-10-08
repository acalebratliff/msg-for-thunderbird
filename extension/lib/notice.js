// Small windows with a title and lines of text: errors, warnings that could
// not be shown in a bar, and "Converting…" while a large attachment converts.
// The text travels in the URL fragment, which never leaves the add-on.
async function openNotice(api, title, lines) {
  const data = encodeURIComponent(JSON.stringify({ title, lines }));
  return api.windows.create({ type: 'popup', url: `/notice/notice.html#${data}`, width: 520, height: 320, allowScriptsToClose: true });
}

export function makeShowNotice(api) {
  return async function showNotice({ title, lines }) {
    try {
      await openNotice(api, title, lines);
    } catch (e) {
      console.error('MSG Opener:', title, lines, e);
    }
  };
}

/** progress(name) for openMsgAttachments: a notice shown while converting, closed when done. */
export function makeProgress(api) {
  return async function progress(name) {
    let win = null;
    try {
      win = await openNotice(api, `Converting "${name}"…`, ['The message opens in a new tab when it is ready.']);
    } catch (e) {
      // no window: the conversion still runs
    }
    return {
      async done() {
        if (!win) return;
        try {
          await api.windows.remove(win.id);
        } catch (e) {
          // already closed by the user
        }
        win = null;
      },
    };
  };
}
