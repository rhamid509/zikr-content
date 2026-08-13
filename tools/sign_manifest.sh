#!/usr/bin/env bash
# Signs manifest.json with the offline private key so the app can verify it wasn't
# tampered with in transit or at rest on GitHub. Run this after every manifest.json
# edit, before committing — manifest.json.sig must always match the current manifest.json.
#
# Usage: tools/sign_manifest.sh
# Requires: signing/manifest_signing_private.pem (NEVER commit this file)

set -euo pipefail
cd "$(dirname "$0")/.."

PRIVATE_KEY="signing/manifest_signing_private.pem"
MANIFEST="manifest.json"
SIGNATURE="manifest.json.sig"

if [ ! -f "$PRIVATE_KEY" ]; then
    echo "error: $PRIVATE_KEY not found — this key is kept offline, not in the repo." >&2
    exit 1
fi

# GitHub always serves raw.githubusercontent.com content with LF line endings, but a
# Windows checkout with core.autocrlf=true rewrites the working-copy file to CRLF — signing
# that CRLF version produces a signature that can never verify against what the app fetches.
# Normalize to LF first so the bytes we sign are exactly the bytes GitHub will serve.
sed -i 's/\r$//' "$MANIFEST"

openssl dgst -sha256 -sign "$PRIVATE_KEY" "$MANIFEST" | base64 -w0 > "$SIGNATURE"
echo "signed $MANIFEST -> $SIGNATURE"

# Sanity self-check: verify what we just wrote, using the public key, before it's committed.
PUBLIC_KEY="signing/manifest_signing_public.pem"
if [ -f "$PUBLIC_KEY" ]; then
    base64 -d "$SIGNATURE" > /tmp/manifest_sig_check.der
    if openssl dgst -sha256 -verify "$PUBLIC_KEY" -signature /tmp/manifest_sig_check.der "$MANIFEST" > /dev/null 2>&1; then
        echo "verify OK"
    else
        echo "error: self-verification failed — do not commit $SIGNATURE" >&2
        rm -f /tmp/manifest_sig_check.der
        exit 1
    fi
    rm -f /tmp/manifest_sig_check.der
fi
