import sys

with open("index.html", "r", encoding="utf-8") as f:
    text = f.read()

replacements = {
    "â‚¹": "?",
    "â€”": "—",
    "â€™": "’",
    "â€œ": "“",
    "â€": "”", # Be careful, this might match prefixes of other things, but usually it's alone
    "â€¢": "•",
    "AAA?sAA,A?": "—",
    "A?sA1": "?",
    "A,A": "—",
    "A,??": "—",
    "26A?sA142": "26, 142",
    ",1": "?"
}

for bad, good in replacements.items():
    if bad in text:
        print(f"Found {bad}, replacing with {good}")
        text = text.replace(bad, good)

# Also fix the weird RGBA corruption I saw earlier: "rgba(61,26A?sA142,0.2)"
text = text.replace("61,26?42,0.2", "61,26,142,0.2")
text = text.replace("61,26, 142,0.2", "61,26,142,0.2")
text = text.replace("â€\x9d", "”") # Just in case

with open("index.html", "w", encoding="utf-8") as f:
    f.write(text)

print("Done replacing.")
