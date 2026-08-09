# Content sources and licenses

## v2 — Quran, Hadith, Dua/Adhkar (Bangla)

**Quran — Bengali translation (Muhiuddin Khan)**
Source: [fawazahmed0/quran-api](https://github.com/fawazahmed0/quran-api) (`editions/ben-muhiuddinkhan.json`)
License: [The Unlicense](https://github.com/fawazahmed0/quran-api/blob/1/LICENSE) — public domain, free to copy/modify/publish/sell/distribute.

**Hadith — Bengali (Sunan Abu Dawud)**
Source: [fawazahmed0/hadith-api](https://github.com/fawazahmed0/hadith-api) (`editions/ben-abudawud.min.json`)
License: [The Unlicense](https://github.com/fawazahmed0/hadith-api/blob/1/LICENSE) — public domain, same terms as above.

**Dua/Adhkar — Hisnul Muslim (Bangla)**
Source: [archive.org/details/HisnulMuslimBangla](https://archive.org/details/HisnulMuslimBangla)
License: front-matter notice on the underlying work (confirmed on the English edition, same publisher/work as the Bangla edition): *"No Copyright. There is no copyright, provided that no alteration is made, and credit is given to the Islamic Information Centre. Everyone is free to print it for sale or free distribution."*

## v3 — Quran Arabic text

**Quran — Arabic (Uthmani script, Hafs recitation)**
Source: [fawazahmed0/quran-api](https://github.com/fawazahmed0/quran-api) (`editions/ara-quranuthmanihaf.json`)
License: [The Unlicense](https://github.com/fawazahmed0/quran-api/blob/1/LICENSE) — same repo and license as the Bangla translation.

## v4 — Sihah Sittah (all 6 major hadith books, Arabic + Bangla)

**Hadith — Sahih al-Bukhari, Sahih Muslim, Sunan Abu Dawud, Jami at-Tirmidhi, Sunan an-Nasai, Sunan Ibn Majah — Arabic and Bangla**
Source: [fawazahmed0/hadith-api](https://github.com/fawazahmed0/hadith-api) (`editions/ara-<book>.min.json` and `editions/ben-<book>.min.json`)
License: [The Unlicense](https://github.com/fawazahmed0/hadith-api/blob/1/LICENSE) — same repo and license already used for the v2 Abu Dawud content; v4 supersedes that single-book file with the full six-book set.

## v5 — Quran Tafsir, Bangla (full Quran)

**Tafsir — Bangla (Dr. Abu Bakr Muhammad Zakaria)**
Source: [QuranEnc.com](https://quranenc.com) (`downloads/sqlite/bengali_zakaria.sqlite`) — SQLite database, schema `translations(id, sura, aya, translation, footnotes)`. Covers the full Quran (6236 ayahs, 114 surahs); 3608 ayahs (58%) have substantive tafsir footnotes, the remainder have translation only (normal for a tafsir — not every ayah needs explanatory commentary).
License: QuranEnc.com's stated terms ([quranenc.com/en/home/api/](https://quranenc.com/en/home/api/)) explicitly state: *"Contents of the translations can be downloaded and re-published, with the following terms and conditions: No modification, addition, or deletion of the content. Clearly referring to the publisher and source (QuranEnc.com). Mentioning the version number when re-publishing."* QuranEnc.com is run by the Rowwad Translation Center in cooperation with the Rabwah Dawah Association and IslamHouse.com — a distinct entity from Quran.com/Quran Foundation (whose separate, restrictive ToS was checked and correctly remains a rejected source).

**Attribution requirement**: per the license terms above, the app must credit "QuranEnc.com" wherever this tafsir is shown, and must not modify the footnote/translation text.

## Rejected Tafsir sources (researched across 8 separate passes before v5 was found)

- House of Islam API: Tafsir is paywalled (premium tier), not free.
- spa5k/tafsir_api (GitHub): MIT license covers only the code; the actual tafsir text traces back to Quran Foundation's Developer ToS, which explicitly forbids redistribution beyond their live API and caching beyond 1 week.
- archive.org Tafsir Ibn Kathir Bangla (Islamic Foundation Bangladesh edition and others): no copyright statement of any kind — cannot be presumed public domain.
- Maarifatul Quran (both the Mufti Muhammad Shafi/Mohiuddin Khan/IFB lineage, and the Idris Kandhalvi/Ossiur Rahman lineage): original Urdu publisher Darul Ishaat explicitly states "All Rights Reserved"; IFB asks readers to buy the original; no digital edition exists for the other lineage at all.
- Tafsir Ahsanul Bayan (islamhouse.com PDF): uses an undocumented legacy Bangla font ("HQPB1-4") with no ToUnicode mapping — `pdftotext` produces garbage, not real Bangla, and no converter tool exists for this font anywhere. Also: no explicit waqf/copyright statement found anywhere in the book's front or back matter. archive.org copies of this same title are OCR'd scans, not real text.
- Tanzil.net: hosts only Quran translations in Bangla (Zohurul Hoque, Muhiuddin Khan), no tafsir.
- icsbook.info (Bangladesh Islami Chhatra Shibir's book portal): explicitly rejected — mirrors copyrighted commercial translations (e.g. Tafhimul Quran, published by Adhunik Prokashani Academy) without stated permission, plus carries political-organization baggage unrelated to copyright. Rejected twice, including once after a direct user request to add it anyway — the legal exposure from shipping unlicensed copyrighted content lands on the app, not a reversible decision, so this was held as a firm boundary rather than a preference.
- "আল-কুরআনের সংক্ষিপ্ত তাফসীর" (Tafsir al-Mawjaz, islamhouse.com): genuinely good license + real Unicode DOCX/HTML text, but only 3 parts ever existed (covering just Al-Fatiha + Al-Baqarah verses 1-141) — superseded by v5's complete coverage, not used.
- Bangla PDF from a King Salman/King Fahd waqf notice (`bn_Quran_Bengal.pdf`, 2974 pages, 644MB): confirmed genuine, ironclad waqf license ("বিনামূল্যে বিতরণের জন্য... বিক্রয় নিষিদ্ধ") but the PDF is entirely scanned page images with zero extractable text. Tesseract OCR was tested (installed on the dev machine at this point, plus Bengali/Arabic tessdata) — even at 600dpi it garbled important Islamic terminology (e.g. "শাব্দিক"→"শান্দিক") and was judged too unreliable for religious content at 2974-page scale without infeasible page-by-page human review.

Do not add Bangla Tafsir from any "no license stated" source — silence on licensing defaults to full copyright under law, it is not a grant.

**Seerah and Aqeedah** content in Bangla: researched but no source found with a clear, verifiable redistribution license. Candidates found on archive.org (e.g. `Books.on.Seerah.Bangla`, `AqeedahIslamiah`) have no copyright statement of any kind in their text — neither a grant nor a restriction — so they are excluded until a clearer source or explicit permission is found.

## v6 — Book catalog (fiction + Seerah)

**বিষাদ-সিন্ধু (Bishad-Sindhu) — Mir Mosharraf Hossain (d. 1911)**
Source: [archive.org/details/BishadShindhu](https://archive.org/details/BishadShindhu)
License: archive.org rights field = **Public Domain Mark 1.0** (`licenseurl: creativecommons.org/publicdomain/mark/1.0/`). Author died 1911 (115 years ago) — solidly public domain under any life+N copyright term. Cross-verified against a second independent DLI scan (`archive.org/details/in.ernet.dli.2015.356582`, rights field: "In Public Domain").

**সীরাতে ইবনে হিশাম (Sirat Ibn Hisham), 4 parts — Ibn Hisham (d. c. 833 CE)**
Source: [archive.org/details/eelm.weebly.com_20141211](https://archive.org/details/eelm.weebly.com_20141211)
License: archive.org rights field = **Public Domain Mark 1.0**. Bangla translation team: Akram Farooq et al. **Provenance caveat**: a different archive.org upload of the same underlying translation (`archive.org/details/ibnhisham`, hosted by almodina.com/Islamic Foundation Bangladesh) is tagged **CC BY-NC-ND** (non-commercial, no-derivatives) by a different uploader, and that copy is AES-encrypted (print/copy blocked) — consistent with the NC/ND terms. Neither uploader is the original publisher issuing a statement directly; this is the best available signal, not a publisher-issued waqf statement. Chose the PD-tagged, unencrypted copy over the restrictive one.

**Explicitly rejected for this catalog — do not use:**
- `shibircloud.com/pdf/sirat_ibn_hisham_v2.pdf` — PDF metadata itself states `Author: www.icsbook.info`, confirming this is icsbook.info's content (already rejected repeatedly this session for copyright/political-org reasons) regardless of which CDN serves it. Also AES-256 encrypted (print/copy/change all disabled).
- Islamic books/history/organizational-literature categories ("ইসলামিক বই", "ইতিহাস বই", "শিবির বই"): researched extensively (4+ passes per category, direct PDF front-matter checks with browser User-Agent to bypass islamhouse.com's bot-block) — **no book in any of these three categories cleared the license bar**. islamhouse.com's Bangla booklets mostly carry no per-book license statement (only a generic site-wide "© IslamHouse.com" footer) — do not assume islamhouse.com hosting implies a waqf grant; it must be verified per-title, as some titles (e.g. Hisnul Muslim, "সংক্ষিপ্ত তাফসীর") do have one and most don't. Bangladeshi orgs checked (Ahlehadeeth Andolon Bangladesh, Jamaat Online Library) use standard all-rights-reserved copyright with no reuse grant.
- Public-domain classic Bangla authors Tagore/Bankim Chandra/Sarat Chandra: legally clear (public domain) but excluded on editorial/brand-fit grounds — user decided a Muslim-audience Islamic app shouldn't feature secular/Hindu-nationalist-context authors (e.g. Anandamath) even where copyright isn't an issue. Muslim-authored public domain fiction (Mir Mosharraf Hossain, Ismail Hossain Siraji) was sourced instead.
- Naseem Hijazi Bangla translations (archive.org) — uploader mislabeled "Public Domain Mark" despite the author dying in 1996 (in copyright until ~2046-2066). Uploader self-tags are not authoritative; verify against the actual author's death date every time.
- সহজ কাসাসুল আম্বিয়া (Qasas al-Anbiya Bangla) — uploader-applied PD Mark on a modern translation (Hifzur Rahman) that Al-Kawsar Publishing House still actively sells commercially. Rejected as a likely uploader copyright violation, not a real grant.
