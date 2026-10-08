#!/bin/sh
# Headless smoke test of the built XPI in the locally installed Thunderbird.
#   SMOKE_DIR=/some/empty/dir sh test/smoke/run.sh
# Uses a fresh profile under $SMOKE_DIR (a new numbered one each run),
# Marionette on port 2829, and stops Thunderbird at the end.
set -eu
here=$(cd "$(dirname "$0")" && pwd)
repo=$(cd "$here/../.." && pwd)
: "${SMOKE_DIR:?set SMOKE_DIR to a work folder outside the repo}"
mkdir -p "$SMOKE_DIR"
n=1; while [ -e "$SMOKE_DIR/profile-$n" ]; do n=$((n+1)); done
xpi=$(ls "$repo"/dist/*.xpi | head -1)
python3 -I "$here/make-carrier.py" "$repo/test/fixtures" "$SMOKE_DIR/carrier.eml"
python3 -I "$here/driver.py" "$SMOKE_DIR/profile-$n" "$here/smoke.js" \
  "[\"$xpi\", \"$repo/test/fixtures\", \"$SMOKE_DIR/carrier.eml\"]" "$SMOKE_DIR/out-$n.json" || true
python3 -I "$here/report.py" "$SMOKE_DIR/out-$n.json"
