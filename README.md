# zikr-content

Content assets for the [Zikr app](https://github.com/rhamid509) — Quran/Hadith/Adhkar data, book PDFs, audio — delivered to the app via GitHub Releases on first launch. This repo holds only content assets, never app source code or credentials.

## How it works

1. Content files are uploaded as assets to a GitHub Release (tag `v1`, `v2`, ...).
2. `manifest.json` on the `main` branch lists every file the app needs, with its download URL, size, and SHA-256 checksum.
3. On first launch (or when the manifest version increases), the app downloads `manifest.json`, then fetches each listed file, verifies its checksum, and caches it locally.

## Publishing a content update

1. Add/replace files, then create a new Release: `gh release create vN file1 file2 ...`
2. Update `manifest.json`: bump `"version"`, set `"releaseTag"` to `vN`, and list each file's URL/size/sha256.
3. Commit and push `manifest.json` to `main`.
