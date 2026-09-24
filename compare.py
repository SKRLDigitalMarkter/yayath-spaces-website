import re
html1 = open("index.html", encoding="utf-8", errors="ignore").read()
html2 = open("original_index.html", encoding="utf-8", errors="ignore").read()

def get_len(html, page_id):
    m = re.search(f'id="{page_id}".*?(?=<!--)', html, flags=re.DOTALL)
    return len(m.group(0)) if m else -1

print("Warehouse index:", get_len(html1, "page-warehouse"))
print("Warehouse orig:", get_len(html2, "page-warehouse"))
print("Cold Storage index:", get_len(html1, "page-cold-storage"))
print("Cold Storage orig:", get_len(html2, "page-cold-storage"))
print("Footer index:", len(re.search(r'<footer.*?</footer>', html1, flags=re.DOTALL).group(0)) if re.search(r'<footer.*?</footer>', html1, flags=re.DOTALL) else -1)
print("Footer orig:", len(re.search(r'<footer.*?</footer>', html2, flags=re.DOTALL).group(0)) if re.search(r'<footer.*?</footer>', html2, flags=re.DOTALL) else -1)
