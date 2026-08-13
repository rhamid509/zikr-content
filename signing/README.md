# Manifest signing key

`manifest_signing_private.pem` signs `manifest.json` so the app can verify it hasn't
been tampered with in transit or at rest on GitHub. **Never commit the private key** —
it's gitignored; keep your own backup of it somewhere safe (password manager, offline
drive). If it's lost, a new keypair must be generated and the public half in
`ContentDownloader.kt` (`MANIFEST_PUBLIC_KEY_B64`) updated in the app — old app
versions in the field would then fail manifest verification until they update.

`manifest_signing_public.pem` / `.der` are safe to keep in the repo — they're not
secret, only used as a reference for what's embedded in the app.

## After every manifest.json edit

```
tools/sign_manifest.sh
```

This regenerates `manifest.json.sig` from the current `manifest.json` and
self-verifies before writing it. Commit `manifest.json` and `manifest.json.sig`
together — the app rejects the manifest if the signature doesn't match.
