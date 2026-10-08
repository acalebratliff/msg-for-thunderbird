// npm run source-archive -> dist/msg-opener-for-thunderbird-<version>-source.zip
//
// The source package for ATN review: this repo at HEAD and msg-eml-core at the
// commit recorded in core/VENDOR.json, each in its own folder, plus
// SOURCE-BUILD.txt with the build steps. Built from git objects (committed
// files only; node_modules and build output are never included).
// Core checkout: ../msg-eml-core or $MSG_EML_CORE (must contain that commit).
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeZip } from './zip.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const coreDir = resolve(process.env.MSG_EML_CORE || join(root, '..', 'msg-eml-core'));
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const vendor = JSON.parse(readFileSync(join(root, 'core', 'VENDOR.json'), 'utf8'));
const node = readFileSync(join(root, '.nvmrc'), 'utf8').trim();

function treeFiles(repo, rev, prefix) {
  const run = (args, input) => execFileSync('git', ['-C', repo, ...args], { input, maxBuffer: 1 << 30 });
  const list = run(['ls-tree', '-r', '-z', '--full-tree', rev]).toString('utf8').split('\0').filter(Boolean);
  const out = [];
  for (const line of list) {
    const [meta, path] = line.split('\t');
    const [, type, sha] = meta.split(' ');
    if (type !== 'blob') throw new Error(`${repo}: ${path} is a ${type}; only plain files are supported`);
    out.push({ name: `${prefix}/${path}`, data: run(['cat-file', 'blob', sha]) });
  }
  return out;
}

const dirty = execFileSync('git', ['-C', root, 'status', '--porcelain', '--untracked-files=no'], { encoding: 'utf8' }).trim();
if (dirty) {
  console.error(`Uncommitted changes in this repo; the archive is built from HEAD, so commit first:\n${dirty}`);
  process.exit(1);
}
const head = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const appDir = pkg.name;
const xpi = `${pkg.name}-${pkg.version}.xpi`;
const guide = `Source package for ${xpi}
${appDir}/ is the add-on at commit ${head}.
msg-eml-core/ is the conversion library at commit ${vendor.commit}
(${vendor.repository || 'msg-eml-core'}); ${appDir}/core/msg-eml-core.js is its build output.

Build environment: Node.js ${node} with its bundled npm (the XPI is zipped with
Node's own zlib, so another Node version can give different bytes). Any OS.

1. Build the library and check it matches the copy in the add-on:
     cd msg-eml-core
     npm ci
     npm run build
     cmp dist/msg-eml-core.js ../${appDir}/core/msg-eml-core.js
   (no output from cmp = identical)

2. Build the add-on:
     cd ../${appDir}
     npm ci
     npm run build
   This writes dist/${xpi} and prints its SHA-256, which must equal the
   submitted XPI's.

Notes
- core/VENDOR.json records the library commit and the SHA-256 of every vendored
  file; npm run build refuses a file that does not match.
- web-ext (devDependency) is used only by "npm run lint". npm audit reports
  advisories in its own dependencies; it is not used by the build and nothing
  from it is in the XPI.
- The XPI contains no minified code: msg-eml-core.js is an unminified esbuild
  bundle of msg-eml-core/src plus @kenjiuno/msgreader 1.28.0 and
  @kenjiuno/decompressrtf 0.1.4 from npm (pinned in msg-eml-core/package-lock.json).
`;
const entries = [
  ...treeFiles(root, head, appDir),
  ...treeFiles(coreDir, vendor.commit, 'msg-eml-core'),
  { name: 'SOURCE-BUILD.txt', data: Buffer.from(guide) },
];
const zip = makeZip(entries);
mkdirSync(join(root, 'dist'), { recursive: true });
const out = join(root, 'dist', `${pkg.name}-${pkg.version}-source.zip`);
writeFileSync(out, zip);
console.log(`dist/${pkg.name}-${pkg.version}-source.zip: ${zip.length} bytes, ${entries.length} files, sha256 ${createHash('sha256').update(zip).digest('hex')}`);
