import re

with open('original_index.html', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'id="page-warehouse".*?(<div class="page")', content, re.DOTALL)
if match:
    print('Found page-warehouse length:', len(match.group(0)))
    
    if 'What is 3PL' in match.group(0):
        print('YES! What is 3PL is in it.')
    if 'Dark Stores' in match.group(0):
        print('YES! Dark Stores is in it.')
    if 'Cold Storage' in match.group(0):
        print('YES! Cold Storage is in it.')
