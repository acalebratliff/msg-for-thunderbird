// Shows the title and lines passed in the URL fragment. textContent only.
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
document.getElementById('close').addEventListener('click', () => window.close());
