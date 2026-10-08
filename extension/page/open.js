// The add-on page: pick or drop .msg files, then open each one or import it
// into a folder. All DOM is built with createElement and textContent.
import * as core from '../core/msg-eml-core.js';
import { openMsgFile, importMsgFile, ConversionError, warningHeading } from '../lib/glue.js';
import { makeShowNotice } from '../lib/notice.js';

const api = globalThis.messenger;
const showNotice = makeShowNotice(api);
const $ = (id) => document.getElementById(id);
const folderSelect = $('folder');
let foldersLoaded = false;

function el(tag, text, cls) {
  const e = document.createElement(tag);
  if (text != null) e.textContent = text;
  if (cls) e.className = cls;
  return e;
}

async function loadFolders() {
  if (foldersLoaded) return;
  foldersLoaded = true;
  const accounts = await api.accounts.list(false);
  const names = new Map(accounts.map((a) => [a.id, a.name]));
  const folders = await api.folders.query({ canAddMessages: true });
  folders.sort((a, b) => (names.get(a.accountId) || '').localeCompare(names.get(b.accountId) || '') || a.path.localeCompare(b.path));
  for (const f of folders) {
    const opt = el('option', `${names.get(f.accountId) || f.accountId} › ${f.path.replace(/^\//, '')}`);
    opt.value = f.id;
    folderSelect.append(opt);
  }
  if (!folders.length) folderSelect.append(el('option', 'No folder can take messages'));
}

function mode() {
  return document.querySelector('input[name="mode"]:checked').value;
}

for (const r of document.querySelectorAll('input[name="mode"]')) {
  r.addEventListener('change', async () => {
    const imp = mode() === 'import';
    folderSelect.disabled = !imp;
    if (imp) {
      try {
        await loadFolders();
      } catch (e) {
        foldersLoaded = false;
        addResult('Folders', `The folder list could not be read: ${e.message || e}`, true);
      }
    }
  });
}

function addResult(name, status, isError, warnings) {
  const li = el('li');
  li.append(el('strong', name), document.createTextNode(' '), el('span', status, isError ? 'status-err' : 'status-ok'));
  if (warnings && warnings.length) {
    const box = el('div', null, 'warn');
    box.append(el('div', warningHeading(name, warnings.length)));
    const ul = el('ul');
    for (const w of warnings) ul.append(el('li', w));
    box.append(ul);
    li.append(box);
  }
  $('results').append(li);
}

async function handle(files) {
  const imp = mode() === 'import';
  const folderId = folderSelect.value;
  const folderLabel = folderSelect.selectedOptions[0] ? folderSelect.selectedOptions[0].textContent : '';
  if (imp && !folderId) {
    addResult('Import', 'Choose a folder first.', true);
    return;
  }
  for (const file of files) {
    try {
      if (imp) {
        const { warnings } = await importMsgFile(api, core, file, folderId);
        addResult(file.name, `Imported into ${folderLabel}.`, false, warnings);
      } else {
        const { warnings } = await openMsgFile(api, core, file, { showNotice });
        addResult(file.name, 'Opened.', false, warnings);
      }
    } catch (e) {
      const msg = e instanceof ConversionError ? e.message : `"${file.name}" could not be opened: ${e && e.message ? e.message : e}`;
      addResult(file.name, msg, true);
    }
  }
}

$('choose').addEventListener('click', () => $('picker').click());
$('picker').addEventListener('change', async (ev) => {
  const files = [...ev.target.files];
  ev.target.value = '';
  await handle(files);
});

const drop = $('drop');
drop.addEventListener('dragover', (ev) => {
  ev.preventDefault();
  ev.dataTransfer.dropEffect = 'copy';
  drop.classList.add('over');
});
drop.addEventListener('dragleave', () => drop.classList.remove('over'));
drop.addEventListener('drop', async (ev) => {
  ev.preventDefault();
  drop.classList.remove('over');
  await handle([...ev.dataTransfer.files]);
});
// A file dropped outside the zone should not replace the page.
window.addEventListener('dragover', (ev) => ev.preventDefault());
window.addEventListener('drop', (ev) => ev.preventDefault());
