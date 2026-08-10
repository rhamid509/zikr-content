// Build a single JSON file of all 610 Indopak-15-lines mushaf pages
// (Qudratullah layout, QUL word-by-word Indopak Nastaleeq script) for
// shipping via zikr-content and rendering in the Zikr app.
//
// Usage: node build_indopak_pages.js <layout.db> <words.db> <surahs.json> <output.json>
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
  const [, , layoutPath, wordsPath, surahsPath, outPath] = process.argv;

  const surahs = JSON.parse(fs.readFileSync(surahsPath, "utf-8"));
  const surahNameBn = new Map(surahs.map((s) => [s.number, s.nameBn]));

  const wordRows = query(wordsPath, "SELECT id, text FROM words");
  const wordText = new Map();
  for (const [id, text] of wordRows) wordText.set(Number(id), text.replace(/[\r\n]/g, "").trim());

  const pageRows = query(
    layoutPath,
    "SELECT page_number, line_number, line_type, is_centered, first_word_id, last_word_id, surah_number FROM pages ORDER BY page_number, line_number"
  );

  const pages = new Map();
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

  const orderedPages = Array.from(pages.keys())
    .sort((a, b) => a - b)
    .map((p) => ({ pageNumber: p, lines: pages.get(p) }));

  const result = { pageCount: orderedPages.length, linesPerPage: 15, pages: orderedPages };
  fs.writeFileSync(outPath, JSON.stringify(result), "utf-8");
  console.log(`Wrote ${orderedPages.length} pages to ${outPath}`);
}

main();
