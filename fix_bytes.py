import sys

with open('index.html', 'rb') as f:
    b = f.read()

# Rupee symbol double-encoded UTF-8 bytes:
b = b.replace(b'\xc3\xa2\xe2\x80\x9a\xc2\xb9', b'\xe2\x82\xb9')

text = b.decode('utf-8', errors='ignore')

replacements = [
    ('A?sA1', '\u20b9'),
    ('A,??', '\u2014'),
    ('AAA?sAA,A?', '\u2014'),
    ('A,A', '\u2014'),
    ('26A?sA142', '26, 142'),
    (',1299', '\u20b9299'),
    (',112,000', '\u20b912,000'),
    (',114,999', '\u20b914,999'),
    ('\xc3\xa2\xe2\x80\x9a\xc2\xb9', '\u20b9')
]

for bad, good in replacements:
    text = text.replace(bad, good)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed bytes and strings.")
