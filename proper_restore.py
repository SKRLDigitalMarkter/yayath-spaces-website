import re

orig = open("original_index.html", encoding="utf-8", errors="ignore").read()
html = open("index.html", encoding="utf-8", errors="ignore").read()

def extract(text, tag_id):
    pattern = r'<div class="page" id="' + tag_id + r'".*?(?=<!-- [A-Z0-9 ]+ PAGE)'
    m = re.search(pattern, text, flags=re.DOTALL)
    if not m:
        pattern = r'<div class="page" id="' + tag_id + r'".*?(?=<!--)'
        m = re.search(pattern, text, flags=re.DOTALL)
    return m.group(0) if m else None

warehouse = extract(orig, "page-warehouse")
cold = extract(orig, "page-cold-storage")
dark = extract(orig, "page-dark-store")
tpl = extract(orig, "page-3pl")

if warehouse:
    html = re.sub(r'<div class="page" id="page-warehouse".*?(?=<!-- [A-Z0-9 ]+ PAGE)', warehouse, html, flags=re.DOTALL)
if cold:
    html = re.sub(r'<div class="page" id="page-cold-storage".*?(?=<!-- [A-Z0-9 ]+ PAGE)', cold, html, flags=re.DOTALL)
if dark:
    html = re.sub(r'<div class="page" id="page-dark-store".*?(?=<!-- [A-Z0-9 ]+ PAGE)', dark, html, flags=re.DOTALL)
if tpl:
    html = re.sub(r'<div class="page" id="page-3pl".*?(?=<!-- [A-Z0-9 ]+ PAGE)', tpl, html, flags=re.DOTALL)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("done")
