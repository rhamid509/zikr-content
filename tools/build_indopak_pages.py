"""
Build a single JSON file of all 610 Indopak-15-lines mushaf pages
(Qudratullah layout, QUL word-by-word Indopak Nastaleeq script) for
shipping via zikr-content and rendering in the Zikr app.

Usage: python build_indopak_pages.py <layout.db> <words.db> <output.json>
"""
import sqlite3
import json
import sys

def main():
    layout_path, words_path, out_path = sys.argv[1], sys.argv[2], sys.argv[3]

    layout_conn = sqlite3.connect(layout_path)
    words_conn = sqlite3.connect(words_path)

    word_text = {}
    for wid, text in words_conn.execute("SELECT id, text FROM words"):
        word_text[wid] = text

    rows = layout_conn.execute(
        "SELECT page_number, line_number, line_type, is_centered, "
        "first_word_id, last_word_id, surah_number FROM pages "
        "ORDER BY page_number, line_number"
    ).fetchall()

    pages = {}
    for page_number, line_number, line_type, is_centered, first_id, last_id, surah_number in rows:
        page = pages.setdefault(page_number, [])
        text = ""
        if line_type == "ayah" and first_id is not None and last_id is not None:
            words = [word_text.get(i, "") for i in range(first_id, last_id + 1)]
            text = " ".join(w for w in words if w)
        line = {
            "lineNumber": line_number,
            "lineType": line_type,
            "centered": bool(is_centered),
            "text": text,
        }
        if surah_number is not None:
            line["surahNumber"] = surah_number
        page.append(line)

    ordered_pages = [
        {"pageNumber": p, "lines": pages[p]}
        for p in sorted(pages.keys())
    ]

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({"pageCount": len(ordered_pages), "linesPerPage": 15, "pages": ordered_pages}, f, ensure_ascii=False)

    print(f"Wrote {len(ordered_pages)} pages to {out_path}")

if __name__ == "__main__":
    main()
