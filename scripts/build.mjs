// npm run build        -> dist/msg-opener-for-thunderbird-<version>.xpi (+ .sha256)
// npm run lint         -> the same, then `web-ext lint` on the staged files
//
// Stages extension/ plus the vendored core (core/msg-eml-core.js and its
// licence files) and the repo LICENSE and NOTICE into build/stage, checks the
// core against core/VENDOR.json, and zips it deterministically.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeZip } from './zip.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const wantNode = readFileSync(join(root, '.nvmrc'), 'utf8').trim();
if (process.versions.node !== wantNode) {
  console.warn(`warning: Node ${process.versions.node}; the recorded XPI hash was made with Node ${wantNode} (.nvmrc). Another version's zlib can give different bytes.`);
}
const stage = join(root, 'build', 'stage');
const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');

const manifest = JSON.parse(readFileSync(join(root, 'extension', 'manifest.json'), 'utf8'));
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
if (manifest.version !== pkg.version) {
  console.error(`manifest.json version ${manifest.version} differs from package.json ${pkg.version}`);
  process.exit(1);
}
if ([...(manifest.permissions || []), ...(manifest.optional_permissions || [])].some((p) => /^(<all_urls>|\*:|https?:|sensitiveDataUpload)/.test(p)) || manifest.host_permissions) {
  console.error('manifest asks for network or host access; this add-on must not');
  process.exit(1);
}

const vendor = JSON.parse(readFileSync(join(root, 'core', 'VENDOR.json'), 'utf8'));
for (const [f, want] of Object.entries(vendor.sha256)) {
  const got = sha256(readFileSync(join(root, 'core', f)));
  if (got !== want) {
    console.error(`core/${f} does not match core/VENDOR.json (${got} != ${want}); run npm run vendor`);
    process.exit(1);
  }
}

// build/stage is overwritten, never deleted; a file left over from an older
// build (one no longer in extension/) stops the build instead.
mkdirSync(join(stage, 'core'), { recursive: true });
cpSync(join(root, 'extension'), stage, { recursive: true });
for (const f of ['msg-eml-core.js', 'LICENSE', 'NOTICE', 'THIRD_PARTY_LICENSES']) cpSync(join(root, 'core', f), join(stage, 'core', f));
cpSync(join(root, 'LICENSE'), join(stage, 'LICENSE'));
cpSync(join(root, 'NOTICE'), join(stage, 'NOTICE'));

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
const expected = new Set([
  ...walk(join(root, 'extension')).map((p) => relative(join(root, 'extension'), p).split(sep).join('/')),
  'core/msg-eml-core.js', 'core/LICENSE', 'core/NOTICE', 'core/THIRD_PARTY_LICENSES', 'LICENSE', 'NOTICE',
]);
const stale = walk(stage).map((p) => relative(stage, p).split(sep).join('/')).filter((n) => !expected.has(n));
if (stale.length) {
  console.error(`build/stage has files that are no longer part of the add-on: ${stale.join(', ')}. Clear build/stage and rebuild.`);
  process.exit(1);
}
const entries = walk(stage).map((p) => ({ name: relative(stage, p).split(sep).join('/'), data: readFileSync(p) }));
const zip = makeZip(entries);
const outDir = join(root, 'dist');
mkdirSync(outDir, { recursive: true });
const name = `${pkg.name}-${pkg.version}.xpi`;
writeFileSync(join(outDir, name), zip);
const hash = sha256(zip);
writeFileSync(join(outDir, `${name}.sha256`), `${hash}  ${name}\n`);
console.log(`${relative(root, join(outDir, name))}: ${zip.length} bytes, ${entries.length} files`);
console.log(`sha256 ${hash} (Node ${process.versions.node})`);

if (process.argv.includes('--lint')) {
  const bin = join(root, 'node_modules', '.bin', 'web-ext');
  execFileSync(bin, ['lint', '--source-dir', stage, '--no-config-discovery'], { stdio: 'inherit' });
}
