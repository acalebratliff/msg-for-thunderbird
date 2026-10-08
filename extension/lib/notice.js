// Small windows with a title and lines of text: errors, warnings that could
// not be shown in a bar, and "Converting…" while a large attachment converts.
// The text travels in the URL fragment, which never leaves the add-on.
// The flows never wait for a window to open: windows.create can resolve late
// (in a headless run it did not resolve at all), and the work must go on. A
// "Converting…" window is closed by a runtime message carrying its token,
// which notice.js listens for, so closing does not need the window id either.
function openNotice(api, data) {
  const hash = encodeURIComponent(JSON.stringify(data));
  return api.windows.create({ type: 'popup', url: `/notice/notice.html#${hash}`, width: 520, height: 320, allowScriptsToClose: true });
}

export function makeShowNotice(api) {
  return async function showNotice({ title, lines }) {
    openNotice(api, { title, lines }).catch((e) => console.error('MSG Opener:', title, lines, e));
  };
}

/**
 * progress(name) for openMsgAttachments: a notice shown while converting,
 * closed when done. progress.isActive(token) answers a window that loads
 * after done() was sent, so it can close itself.
 */
export function makeProgress(api) {
  const active = new Set();
  async function progress(name) {
    const token = (globalThis.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Math.random()).slice(2);
    active.add(token);
    openNotice(api, { title: `Converting "${name}"…`, lines: ['The message opens in a new tab when it is ready.'], token }).catch(() => {});
    return {
      async done() {
        active.delete(token);
        api.runtime.sendMessage({ type: 'close-notice', token }).catch(() => {});
      },
    };
  }
  progress.isActive = (token) => active.has(token);
  return progress;
}
