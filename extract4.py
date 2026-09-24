import re

with open('original_index.html', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'(<div class="page" id="page-3pl-services".*?)(?=<div class="page" id="page-dark-storage")', content, re.DOTALL)
if match:
    with open('3pl_original.html', 'w', encoding='utf-8') as out:
        out.write(match.group(1))
