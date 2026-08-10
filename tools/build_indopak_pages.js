// Build a single JSON file of all 610 Indopak-15-lines mushaf pages
// (Qudratullah layout, QUL word-by-word Indopak Nastaleeq script) for
// shipping via zikr-content and rendering in the Zikr app.
//
// Usage: node build_indopak_pages.js <layout.db> <words.db> <surahs.json> <juzs.json> <output.json>
//
// Requires the sqlite3 CLI to be on PATH (used via child_process, since
// no sqlite3 npm driver is installed in this repo).

const { execFileSync } = require("child_process");
const fs = require("fs");

function query(dbPath, sql) {
  const out = execFileSync("sqlite3", ["-separator", "\x1f", dbPath, sql], {
    maxBuffer: 1024 * 1024 * 200,
    encoding: "utf-8",
  });
  return out.split("\n").filter((l) => l.length > 0).map((l) => l.split("\x1f"));
}

function main() {
  const [, , layoutPath, wordsPath, surahsPath, juzsPath, outPath] = process.argv;

  const surahs = JSON.parse(fs.readFileSync(surahsPath, "utf-8"));
  const surahNameBn = new Map(surahs.map((s) => [s.number, s.nameBn]));
  const juzs = JSON.parse(fs.readFileSync(juzsPath, "utf-8"));

  const wordRows = query(wordsPath, "SELECT id, location, surah, ayah, text FROM words");
  const wordText = new Map();
  // location is "surah:ayah:word" — first_word_id of each (surah,ayah) pair, for juz-boundary lookup.
  const firstWordIdOfAyah = new Map();
  for (const [id, location, surah, ayah, text] of wordRows) {
    wordText.set(Number(id), text.replace(/[\r\n]/g, "").trim());
    const wordIndex = Number(location.split(":")[2]);
    if (wordIndex === 1) firstWordIdOfAyah.set(`${surah}:${ayah}`, Number(id));
  }

  const pageRows = query(
    layoutPath,
    "SELECT page_number, line_number, line_type, is_centered, first_word_id, last_word_id, surah_number FROM pages ORDER BY page_number, line_number"
  );

  const pages = new Map();
  // first_word_id -> page_number, to resolve a juz's starting ayah to its page.
  const pageForWordId = [];
  for (const [pageNumber, lineNumber, lineType, isCentered, firstId, lastId, surahNumber] of pageRows) {
    const pn = Number(pageNumber);
    if (!pages.has(pn)) pages.set(pn, []);
    let text = "";
    if (lineType === "ayah" && firstId !== "" && lastId !== "") {
      const words = [];
      for (let i = Number(firstId); i <= Number(lastId); i++) {
        const w = wordText.get(i);
        if (w) words.push(w);
      }
      text = words.join(" ");
      pageForWordId.push({ firstId: Number(firstId), lastId: Number(lastId), page: pn });
    }
    const line = {
      lineNumber: Number(lineNumber),
      lineType,
      centered: isCentered === "1",
      text,
    };
    if (surahNumber !== "") {
      const sn = Number(surahNumber);
      line.surahNumber = sn;
      if (lineType === "surah_name" && surahNameBn.has(sn)) line.surahNameBn = surahNameBn.get(sn);
    }
    pages.get(pn).push(line);
  }

  function pageForWord(wordId) {
    for (const range of pageForWordId) {
      if (wordId >= range.firstId && wordId <= range.lastId) return range.page;
    }
    return null;
  }

  const orderedPages = Array.from(pages.keys())
    .sort((a, b) => a - b)
    .map((p) => ({ pageNumber: p, lines: pages.get(p) }));

  // Surah index: first page each surah's heading appears on (from the layout's own surah_name lines).
  const surahIndex = [];
  for (const p of orderedPages) {
    for (const line of p.lines) {
      if (line.lineType === "surah_name") {
        surahIndex.push({ surahNumber: line.surahNumber, nameBn: line.surahNameBn || "", startPage: p.pageNumber });
      }
    }
  }

  // Juz index: resolve each juz's starting (surah, ayah) to a page via its first word id.
  const juzIndex = juzs.map((j) => {
    const wordId = firstWordIdOfAyah.get(`${j.surah}:${j.ayah}`);
    const startPage = wordId != null ? pageForWord(wordId) : null;
    return { juz: j.juz, startPage };
  });

  const result = {
    pageCount: orderedPages.length,
    linesPerPage: 15,
    pages: orderedPages,
    surahIndex,
    juzIndex,
  };
  fs.writeFileSync(outPath, JSON.stringify(result), "utf-8");
  console.log(`Wrote ${orderedPages.length} pages, ${surahIndex.length} surahs, ${juzIndex.length} juzs to ${outPath}`);
}

main();
