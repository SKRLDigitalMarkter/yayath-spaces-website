import re
html = open("original_index.html", encoding="utf-8", errors="ignore").read()
for m in re.finditer(r'<div style="font-size:2rem;font-weight:800;color:.*?;margin-bottom:4px;">(.*?)</div>', html):
    print(m.group(1).encode("ascii", errors="backslashreplace"))
