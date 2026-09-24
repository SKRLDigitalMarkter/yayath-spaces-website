import re

# Read all content
html = open("index.html", encoding="utf-8", errors="ignore").read()
orig_html = open("original_index.html", encoding="utf-8", errors="ignore").read()

warehouse = open("warehouse_original.html", encoding="utf-8", errors="ignore").read()
cold = open("cold_original.html", encoding="utf-8", errors="ignore").read()
dark = open("dark_original.html", encoding="utf-8", errors="ignore").read()
tpl = open("3pl_original.html", encoding="utf-8", errors="ignore").read()

# Add meta charset to head
if '<meta charset="UTF-8">' not in html:
    html = html.replace('<head>', '<head>\n  <meta charset="UTF-8">')

# Restore warehouse section
html = re.sub(r'<div class="page" id="page-warehouse">.*?(?=<!--)', warehouse + '\n\n', html, flags=re.DOTALL)

# Restore cold storage section
html = re.sub(r'<div class="page" id="page-cold-storage">.*?(?=<!--)', cold + '\n\n', html, flags=re.DOTALL)

# Restore dark store section
html = re.sub(r'<div class="page" id="page-dark-store">.*?(?=<!--)', dark + '\n\n', html, flags=re.DOTALL)

# Restore 3PL section
html = re.sub(r'<div class="page" id="page-3pl">.*?(?=<!--)', tpl + '\n\n', html, flags=re.DOTALL)

# Restore footer from original_index.html
orig_footer = re.search(r'<footer.*?</footer>', orig_html, flags=re.DOTALL).group(0)
html = re.sub(r'<footer.*?</footer>', orig_footer, html, flags=re.DOTALL)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Restored content successfully.")
