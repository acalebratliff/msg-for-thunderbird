// The manifest asks for the documented minimum and no network access.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const manifest = JSON.parse(readFileSync(join(root, 'extension', 'manifest.json'), 'utf8'));

test('permissions are exactly the justified set; no host or network access', () => {
  assert.deepEqual([...manifest.permissions].sort(), ['menus', 'messagesRead', 'scripting']);
  assert.deepEqual([...manifest.optional_permissions].sort(), ['accountsRead', 'messagesImport']);
  assert.equal(manifest.host_permissions, undefined);
  assert.equal(manifest.content_security_policy, undefined, 'default CSP: no remote scripts');
  assert.deepEqual(manifest.browser_specific_settings.gecko.data_collection_permissions, { required: ['none'] });
});

test('the add-on code has no network calls and no innerHTML', () => {
  const walk = (d) => readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]));
  const files = [...walk(join(root, 'extension')), join(root, 'core', 'msg-eml-core.js')].filter((f) => /\.(js|html)$/.test(f));
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    assert.ok(!/\b(fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon|importScripts)\s*\(/.test(src), `${f}: network call`);
    assert.ok(!/\binnerHTML\b|outerHTML|insertAdjacentHTML|\beval\s*\(|new Function\s*\(/.test(src), `${f}: unsafe DOM or eval`);
    assert.ok(!/https?:\/\/[^\s"')]*\.(js|css)\b/.test(src) || f.endsWith('msg-eml-core.js'), `${f}: remote script or style`);
  }
});
