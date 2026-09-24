import sys
import re

with open("index.html", "r", encoding="utf-8", errors="ignore") as f:
    text = f.read()

replacements = [
    ("A,\?\?", "\u2014"),
    ("A,A", "\u2014"),
    ("AAA?sAA,A?", "\u2014"),
    ("A?sA1", "\u20b9"),
    ("A\u00ef\u00bf\u00bd,\u00ef\u00bf\u00bdA\u00ef\u00bf\u00bd", "\u2014"),
    ("A\u00ef\u00bf\u00bd,\u00ef\u00bf\u00bd\?\?", "\u2014"),
    ("\u00ef\u00bf\u00bd,1499A\u00ef\u00bf\u00bd,\u00ef\u00bf\u00bd?o799", "<del>\u20b91499</del> \u20b9799"),
    ("\u00ef\u00bf\u00bd,1799A\u00ef\u00bf\u00bd,\u00ef\u00bf\u00bd?o1,199", "<del>\u20b91799</del> \u20b91199")
]

for bad, good in replacements:
    text = text.replace(bad, good)

# Also fix the specific exact strings from earlier if they had weird characters
text = text.replace('A\xef\xbf\xbd,\xef\xbf\xbd\xef\xbf\xbd', '\u2014')
text = text.replace('\xef\xbf\xbd,1499A\xef\xbf\xbd,\xef\xbf\xbd?o799', '<del>\u20b91499</del> \u20b9799')
text = text.replace('\xef\xbf\xbd,1799A\xef\xbf\xbd,\xef\xbf\xbd?o1,199', '<del>\u20b91799</del> \u20b91199')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(text)

print("Fixed remaining mojibake strings.")
