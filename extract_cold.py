import re

with open('original_index.html', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'(<div class="page" id="page-cold-storage".*?)(?=<!-- LOCATION DETAIL)', content, re.DOTALL)
if match:
    with open('cold_original.html', 'w', encoding='utf-8') as f:
        f.write(match.group(1))
    print('extracted cold storage')
else:
    print('Failed to extract cold storage')

