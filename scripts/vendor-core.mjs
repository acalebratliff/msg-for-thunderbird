// Vendor the msg-eml-core browser bundle into core/.
//
//   npm run vendor            (core checkout at ../msg-eml-core)
//   MSG_EML_CORE=/path npm run vendor
//
// Copies dist/msg-eml-core.js (the unminified bundle, so the XPI stays
// reviewable) and the core's LICENSE, NOTICE and THIRD_PARTY_LICENSES, and
// records the core commit and SHA-256 in core/VENDOR.json. It refuses a core
// checkout with uncommitted changes. Build the core first (npm run build in
// the core repo). core/ is committed, so `npm run build` here needs nothing
// outside this repo; scripts/build.mjs checks the hash in VENDOR.json.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const coreDir = resolve(process.env.MSG_EML_CORE || join(root, '..', 'msg-eml-core'));
const git = (...a) => execFileSync('git', ['-C', coreDir, ...a], { encoding: 'utf8' }).trim();

const bundle = join(coreDir, 'dist', 'msg-eml-core.js');
if (!existsSync(bundle)) {
  console.error(`No bundle at ${bundle}. Run "npm run build" in the core repo first.`);
  process.exit(1);
}
const dirty = git('status', '--porcelain', '--untracked-files=no');
if (dirty) {
  console.error(`The core checkout has uncommitted changes; commit or stash them first:\n${dirty}`);
  process.exit(1);
}
const commit = git('rev-parse', 'HEAD');
let repository = null;
try {
  const url = git('remote', 'get-url', 'origin');
  const m = /github\.com[:/]([^/]+\/[^/.]+?)(?:\.git)?$/.exec(url);
  if (m) repository = `https://github.com/${m[1]}`;
} catch (e) {
  // no remote: the record has no repository link
}
const pkg = JSON.parse(readFileSync(join(coreDir, 'package.json'), 'utf8'));
const sha256 = (p) => createHash('sha256').update(readFileSync(p)).digest('hex');

const files = {};
for (const [from, to] of [
  [bundle, 'msg-eml-core.js'],
  [join(coreDir, 'LICENSE'), 'LICENSE'],
  [join(coreDir, 'NOTICE'), 'NOTICE'],
  [join(coreDir, 'THIRD_PARTY_LICENSES'), 'THIRD_PARTY_LICENSES'],
]) {
  copyFileSync(from, join(root, 'core', to));
  files[to] = sha256(join(root, 'core', to));
}
const record = {
  name: pkg.name,
  version: pkg.version,
  commit,
  repository,
  source: 'dist/msg-eml-core.js, built by "npm run build" (scripts/build.js) in the core repo',
  dependencies: pkg.dependencies,
  sha256: files,
};
writeFileSync(join(root, 'core', 'VENDOR.json'), JSON.stringify(record, null, 2) + '\n');
console.log(`Vendored ${pkg.name} ${pkg.version} at ${commit.slice(0, 7)}; msg-eml-core.js sha256 ${files['msg-eml-core.js']}`);
