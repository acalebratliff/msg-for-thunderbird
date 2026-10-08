#!/bin/sh
# Headless smoke test of the built XPI in the locally installed Thunderbird.
#   SMOKE_DIR=/some/work/dir sh test/smoke/run.sh            (extensions in-process, all checks)
#   TB_BIN=/path/to/thunderbird SMOKE_DIR=... sh test/smoke/run.sh   (another Thunderbird build)
#   SMOKE_REMOTE=1 SMOKE_DIR=... sh test/smoke/run.sh        (Thunderbird's default out-of-process
#                                                              extensions; page checks are skipped)
# A fresh numbered profile under $SMOKE_DIR each run, Marionette on port 2829,
# Thunderbird stopped at the end. Exits non-zero if any check fails.
set -eu
here=$(cd "$(dirname "$0")" && pwd)
repo=$(cd "$here/../.." && pwd)
: "${SMOKE_DIR:?set SMOKE_DIR to a work folder outside the repo}"
mkdir -p "$SMOKE_DIR"
n=1; while [ -e "$SMOKE_DIR/profile-$n" ]; do n=$((n+1)); done
name=$(node -p "require('$repo/package.json').name")
version=$(node -p "require('$repo/package.json').version")
xpi="$repo/dist/$name-$version.xpi"
[ -f "$xpi" ] || { echo "no $xpi; run npm run build" >&2; exit 1; }
[ -f "$SMOKE_DIR/big-20mb.msg" ] || node "$here/make-big.mjs" "$SMOKE_DIR"
fx="$repo/test/fixtures"
python3 -I "$here/make-carrier.py" "$SMOKE_DIR/carrier.eml" "$fx/nested.msg" "$fx/warnings.msg" "$fx/not-a-msg.msg" "$SMOKE_DIR/big-20mb.msg"
python3 -I "$here/driver.py" "$SMOKE_DIR/profile-$n" "$here/smoke.js" \
  "[\"$xpi\", \"$fx\", \"$SMOKE_DIR/carrier.eml\", \"$SMOKE_DIR\"]" "$SMOKE_DIR/out-$n.json" "${SMOKE_REMOTE:-0}"
python3 -I "$here/report.py" "$SMOKE_DIR/out-$n.json"
