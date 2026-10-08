// The add-on page: pick or drop .msg files, then open each one or import it
// into a folder. All DOM is built with createElement and textContent.
import * as core from '../core/msg-eml-core.js';
import { openMsgFile, importMsgFile, requestImportPermissions, ConversionError, warningHeading } from '../lib/glue.js';
import { makeShowNotice } from '../lib/notice.js';
import { workerConverter } from '../lib/worker-converter.js';

const api = globalThis.messenger;
const showNotice = makeShowNotice(api);
const convert = workerConverter(core);
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
  const accounts = await api.accounts.list(false);
  const names = new Map(accounts.map((a) => [a.id, a.name]));
  const folders = await api.folders.query({ canAddMessages: true });
  folders.sort((a, b) => (names.get(a.accountId) || '').localeCompare(names.get(b.accountId) || '') || a.path.localeCompare(b.path));
  folderSelect.replaceChildren();
  for (const f of folders) {
    const opt = el('option', `${names.get(f.accountId) || f.accountId} › ${f.path.replace(/^\//, '')}`);
    opt.value = f.id;
    folderSelect.append(opt);
  }
  if (!folders.length) folderSelect.append(el('option', 'No folder can take messages'));
  foldersLoaded = true;
}

function mode() {
  return document.querySelector('input[name="mode"]:checked').value;
}

function setMode(value) {
  document.querySelector(`input[name="mode"][value="${value}"]`).checked = true;
  folderSelect.disabled = value !== 'import';
}

for (const r of document.querySelectorAll('input[name="mode"]')) {
  r.addEventListener('change', async () => {
    if (mode() !== 'import') {
      setMode('open');
      return;
    }
    // accountsRead and messagesImport are optional; ask on first use (a user action).
    let granted = false;
    try {
      granted = await requestImportPermissions(api); // first call in the handler: keeps the user action
    } catch (e) {
      granted = false;
    }
    if (!granted) {
      setMode('open');
      addResult('Import into folder', 'Not available: the permission to read folders and import messages was not given.', true);
      return;
    }
    setMode('import');
    try {
      await loadFolders();
    } catch (e) {
      addResult('Folders', `The folder list could not be read: ${e.message || e}`, true);
    }
  });
}

function addResult(name, status, isError, warnings) {
  const li = el('li');
  const statusEl = el('span', status, isError ? 'status-err' : 'status-ok');
  li.append(el('strong', name), document.createTextNode(' '), statusEl);
  $('results').append(li);
  return {
    update(text, err, warns) {
      statusEl.textContent = text;
      statusEl.className = err ? 'status-err' : 'status-ok';
      if (warns && warns.length) {
        const box = el('div', null, 'warn');
        box.append(el('div', warningHeading(name, warns.length)));
        const ul = el('ul');
        for (const w of warns) ul.append(el('li', w));
        box.append(ul);
        li.append(box);
      }
    },
  };
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
    const row = addResult(file.name, 'Converting…', false);
    row.update('Converting…', false);
    try {
      if (imp) {
        const { warnings } = await importMsgFile(api, convert, file, folderId);
        row.update(`Imported into ${folderLabel}.`, false, warnings);
      } else {
        const { warnings } = await openMsgFile(api, convert, file, { showNotice });
        row.update('Opened.', false, warnings);
      }
    } catch (e) {
      const msg = e instanceof ConversionError ? e.message : `"${file.name}" could not be opened: ${e && e.message ? e.message : e}`;
      row.update(msg, true);
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
