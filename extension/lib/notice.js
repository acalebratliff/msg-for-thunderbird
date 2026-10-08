// Open a small window with a title and lines of text (errors, or warnings
// that could not be shown in a bar). The text travels in the URL fragment,
// which never leaves the add-on.
export function makeShowNotice(api) {
  return async function showNotice({ title, lines }) {
    const data = encodeURIComponent(JSON.stringify({ title, lines }));
    try {
      await api.windows.create({ type: 'popup', url: `/notice/notice.html#${data}`, width: 520, height: 320, allowScriptsToClose: true });
    } catch (e) {
      console.error('MSG Opener:', title, lines, e);
    }
  };
}
