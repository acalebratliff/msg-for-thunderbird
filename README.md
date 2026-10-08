# MSG Opener for Thunderbird

A Thunderbird add-on that opens Outlook `.msg` files. Each file is converted to a
standard `.eml` message on your computer by
[msg-eml-core](core/VENDOR.json) and shown in Thunderbird's own message viewer.
The add-on has no network permission and sends nothing anywhere.

- **From an attachment:** right-click a `.msg` attachment, choose **Open as message**.
- **From disk:** click the **Open .msg** toolbar button, then pick or drop files.
  Each file opens in a message tab, or is imported into a folder you choose.
- **Messages inside messages:** embedded Outlook messages become attached
  messages that Thunderbird opens itself; a `.msg` file attached inside a
  converted message opens with the same right-click entry.
- **What did not convert exactly** (for example a sender with no email address
  in the file, or a missing date) is listed once in a bar at the top of the
  opened message, or next to the file on the add-on page.

Requires Thunderbird 140 or later (Manifest V3).

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

Build environment used for the published XPI: Debian 13, Node.js 24.21.0, npm 11.19.0.

    npm ci
    npm run build      # dist/msg-opener-for-thunderbird-<version>.xpi and .sha256
    npm run lint       # build, then web-ext lint on the staged files
    npm test           # unit tests (node:test)

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

All conversion goes through one function, `convertMsg(core, bytes, fileName)`
in `extension/lib/glue.js`, so another add-on can reuse the same core and glue.

## Tests

- `npm test`: the glue (attachment read, convert, open, import, warnings,
  errors) against the vendored core and the synthetic fixtures in
  `test/fixtures` (regenerate with `node scripts/make-fixtures.mjs`, which uses
  the core's test helper; no real mail).
- `SMOKE_DIR=/a/work/folder npm run smoke`: loads the built XPI into the
  locally installed Thunderbird, headless, with a fresh profile, and runs the
  disk, attachment, nested and import paths. Needs Python 3.

## Licence

Apache-2.0. See LICENSE and NOTICE.
