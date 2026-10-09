// Shows the title and lines passed in the URL fragment. textContent only.
// A window opened with a token closes itself when the add-on sends
// {type: 'close-notice', token} (the "Converting…" window).
let data = { title: 'MSG Opener for Thunderbird', lines: [] };
try {
  data = JSON.parse(decodeURIComponent(location.hash.slice(1)));
} catch (e) {
  data.lines = ['No details were passed to this window.'];
}
document.getElementById('title').textContent = String(data.title || '');
document.title = String(data.title || document.title);
const ul = document.getElementById('lines');
for (const line of Array.isArray(data.lines) ? data.lines : []) {
  const li = document.createElement('li');
  li.textContent = String(line);
  ul.append(li);
}
if (data.details) {
  // Technical detail for bug reports, after a blank line.
  const p = document.getElementById('details');
  p.textContent = `Details: ${String(data.details)}`;
  p.hidden = false;
}
document.getElementById('close').addEventListener('click', () => window.close());
if (data.token) {
  globalThis.messenger.runtime.onMessage.addListener((msg) => {
    if (msg && msg.type === 'close-notice' && msg.token === data.token) window.close();
  });
  // done() may have been sent before this window loaded.
  globalThis.messenger.runtime.sendMessage({ type: 'notice-active', token: data.token })
    .then((stillActive) => { if (stillActive === false) window.close(); })
    .catch(() => {});
}
