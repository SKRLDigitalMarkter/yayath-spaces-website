import sys

with open("index.html", "r", encoding="utf-8", errors="ignore") as f:
    text = f.read()

replacements = {
    "â€“": "–", # en-dash
    "â€”": "—", # em-dash
    "â€™": "’", # right single quote
    "â€œ": "“", # left double quote
    "â€": "”",  # right double quote (usually)
    "â€¢": "•", # bullet
    "â,¹": "?", # rupee if it somehow appears like this
    ",1499A,?o799": "<del>?1499</del> ?799",
    ",1799A,?o1,199": "<del>?1799</del> ?1,199",
}

for bad, good in replacements.items():
    text = text.replace(bad, good)

# Also fix the specific strings I saw in the grep output:
text = text.replace(",1499A,?o799", "<del>?1499</del> ?799")
text = text.replace(",1799A,?o1,199", "<del>?1799</del> ?1,199")
text = text.replace("A,??", "—")
text = text.replace("A,A", "—")
text = text.replace("A,", "—")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(text)
