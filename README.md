# MSG Opener for Thunderbird

A Thunderbird add-on that opens Outlook `.msg` files. Each file is converted to a
standard `.eml` message on your computer by
[msg-eml-core](https://github.com/acalebratliff/msg-eml-core/tree/9e900a272521fc06570f764e208597098b88152c)
and shown in Thunderbird's own message viewer. The add-on has no network
permission and sends nothing anywhere.

Written and tested with AI assistance (Claude). The author reviews and publishes.

- **From an attachment:** right-click a `.msg` attachment, choose **Open as message**.
- **From disk:** click the **Open .msg** toolbar button, then pick or drop files.
  Each file opens in a new message tab, or is imported into a folder you choose.
- **Size limit:** files over 25 MB are not opened (the conversion needs several
  times the file size in memory). Conversion runs in a background worker.
- **Messages inside messages:** embedded Outlook messages become attached
  messages that Thunderbird opens itself; a `.msg` file attached inside a
  converted message opens with the same right-click entry.
- **What did not convert exactly** (for example a sender with no email address
  in the file, or a missing date) is listed once in a bar at the top of the
  opened message, or next to the file on the add-on page.

Requires Thunderbird 140 or later (Manifest V3). Tested on Thunderbird
140.17.0esr and 157.0.1, on Linux.

## Limitations

- Thunderbird 128 and older are not supported. Windows and macOS have not been tested.
- If the file has no email address for the sender (common for mail from inside
  an Exchange organisation), From shows the name with a made-up address ending
  in `@unresolved.invalid`. Replying to it goes nowhere. The warning bar says so.
- A file with no date gets no Date header. Where a file has no sent time, the
  date shown is when it was delivered or created.
- A body that is true RTF is shown as plain text; the original formatting is
  kept as an attached `body.rtf`.
- Calendar items, contacts, tasks and notes open as ordinary messages (contacts
  also carry a `.vcf`). They are not added to the calendar or address book.
- Damaged files are refused with a message; nothing is recovered from them.
- A file with no Message-ID gets one made from the file's content, so importing
  the same file twice into a folder is refused. The warning bar says so, and
  about half of the files in our test set had no Message-ID, so the bar is common.
- Files over 25 MB are not opened. A 20 MB file takes two to three seconds from disk, seven to nine
  seconds as an attachment, and briefly
  uses about 400 MB more memory.
- An opened message is a view of the file. To keep it in a folder, use
  **Import into folder**.
- Only Outlook `.msg` files: not `.oft` templates, `.pst` files or `winmail.dat`.
  Encrypted (S/MIME) `.msg` files have not been tested.

## Permissions

| Permission | Why |
|---|---|
| `messagesRead` | Read the clicked `.msg` attachment (`messages.getAttachmentFile`) and open the converted message (`messageDisplay.open`). |
| `menus` | The **Open as message** entry on attachments. |
| `scripting` | Place the bar listing conversion warnings at the top of the opened message (`scripting.executeScript`). |
| `accountsRead` | List folders for **Import into folder** (`folders.query`); also required by `messages.import`. |
| `messagesImport` | **Import into folder** (`messages.import`). |

No host permissions, no `tabs`, no network access.

## Build

Build environment: Node.js 24.21.0 (pinned in `.nvmrc` and `engines`) with its
bundled npm 11.19.0; the recorded XPI hash was made on Debian 13 with that
version. The XPI is deflated with Node's bundled zlib, so another Node version
can give different bytes.

    npm ci
    npm run build      # dist/msg-opener-for-thunderbird-<version>.xpi and .sha256
    npm run lint       # build, then web-ext lint on the staged files
    npm test           # unit tests (node:test)
    npm run source-archive   # the ATN source package (see below)

The XPI is zipped deterministically (sorted entries, fixed timestamps), so the
same sources and Node.js version give the same SHA-256.

`web-ext lint` reports warnings for `messagesRead`, `accountsRead` and
`messagesImport` (the linter does not know Thunderbird's permissions) and for
Firefox for Android (not a target).

## The core

`core/msg-eml-core.js` is the unminified browser bundle of msg-eml-core, built in
that repository by `npm run build` (esbuild). It is copied here by
`npm run vendor` (scripts/vendor-core.mjs) from a clean checkout, which records
the core commit and file hashes in `core/VENDOR.json`; `npm run build` refuses
a core file that does not match. The bundle includes @kenjiuno/msgreader
1.28.0 (Apache-2.0) and @kenjiuno/decompressrtf 0.1.4 (BSD-2-Clause); see
NOTICE and core/THIRD_PARTY_LICENSES.

`npm run source-archive` writes `dist/<name>-<version>-source.zip`: this repo at
HEAD, msg-eml-core at the VENDOR.json commit, and `SOURCE-BUILD.txt` with the
steps a reviewer follows (build the core, `cmp` it with `core/msg-eml-core.js`,
build the add-on, compare the XPI hash). It needs a core checkout containing
that commit (`../msg-eml-core` or `$MSG_EML_CORE`).

`web-ext` is a devDependency for `npm run lint` only; `npm audit` reports
advisories in its dependencies. It is not used by the build and nothing from
it is in the XPI.

All conversion goes through one function, `convertMsgBytes(core, bytes, fileName)`
in `extension/lib/glue.js` (run in a Worker by `lib/convert-worker.js`), so
another add-on can reuse the same core and glue.

## Tests

- `npm test`: the glue (attachment read, convert, open, import, warnings,
  errors) against the vendored core and the synthetic fixtures in
  `test/fixtures` (regenerate with `node scripts/make-fixtures.mjs`, which uses
  the core's test helper; no real mail).
- `SMOKE_DIR=/a/work/folder npm run smoke`: loads the built XPI into the
  locally installed Thunderbird, headless, with a fresh profile, and checks the
  disk, attachment, nested, size-limit, warnings-bar and import paths; it exits
  non-zero if a check fails. `SMOKE_REMOTE=1` runs it with Thunderbird's default
  out-of-process extensions (the page checks are then skipped). Needs Python 3.

## Licence

Apache-2.0. See LICENSE and NOTICE.
