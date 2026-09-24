import re

with open('original_index.html', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'id="page-warehouse".*?(<div class="page")', content, re.DOTALL)
if match:
    with open('warehouse_original.html', 'w', encoding='utf-8') as out:
        out.write(match.group(0))
