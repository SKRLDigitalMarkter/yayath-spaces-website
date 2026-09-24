import re

with open('original_index.html', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'(<div class="page" id="page-dark-storage".*?)(?=<div class="page" id="page-cold-storage")', content, re.DOTALL)
if match:
    with open('dark_original.html', 'w', encoding='utf-8') as out:
        out.write(match.group(1))

match2 = re.search(r'(<div class="page" id="page-cold-storage".*?)(?=<!-- LOCATION DETAIL PAGE \(DYNAMIC\) -->|</main>)', content, re.DOTALL)
if match2:
    with open('cold_original.html', 'w', encoding='utf-8') as out:
        out.write(match2.group(1))

