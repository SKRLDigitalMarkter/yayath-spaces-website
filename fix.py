html = open("index.html", encoding="utf-8", errors="ignore").read()

import re

# Let's check how the warehouse section is in index.html right now
m = re.search(r'.{0,50}id="page-warehouse".{0,50}', html, flags=re.DOTALL)
if m:
    print(repr(m.group(0)))
else:
    print("Not found")

m = re.search(r'.{0,50}id="page-cold-storage".{0,50}', html, flags=re.DOTALL)
if m:
    print(repr(m.group(0)))
