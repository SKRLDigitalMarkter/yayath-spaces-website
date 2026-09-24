import re

with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

def restore_page(page_id, form_id, original_file):
    global index_content
    with open(original_file, 'r', encoding='utf-8') as f:
        orig = f.read()
    
    # Extract the original content from start to the form
    match_orig = re.search(rf'(<div class="page" id="{page_id}".*?)(?=<section id="{form_id}")', orig, re.DOTALL)
    if not match_orig:
        print(f"Could not extract original for {page_id}")
        return
    orig_content = match_orig.group(1)
    
    # Now replace the same part in index.html
    match_curr = re.search(rf'(<div class="page" id="{page_id}".*?)(?=<section id="{form_id}")', index_content, re.DOTALL)
    if not match_curr:
        print(f"Could not find target in index.html for {page_id}")
        return
        
    index_content = index_content.replace(match_curr.group(1), orig_content)
    print(f"Successfully restored {page_id}")

restore_page('page-3pl-services', '3pl-form', '3pl_original.html')
restore_page('page-dark-storage', 'dark-store-form', 'dark_original.html')
restore_page('page-cold-storage', 'cold-storage-form', 'cold_original.html')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(index_content)
