import re

with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

def restore_page(page_id, orig_file, current_form_title):
    global index_content
    with open(orig_file, 'r', encoding='utf-8') as f:
        orig = f.read()
    
    match_orig = re.search(rf'(<div class="page" id="{page_id}".*?)(?=<section id="cold-storage-form")', orig, re.DOTALL)
        
    if not match_orig:
        print(f"Could not extract original for {page_id}")
        return
    orig_content = match_orig.group(1)
    
    match_curr = re.search(rf'(<div class="page" id="{page_id}".*?)(?=<section[^>]*>[\s]*<div[^>]*>[\s]*<div[^>]*>[\s]*<h2[^>]*>{current_form_title})', index_content, re.DOTALL)
    if not match_curr:
        print(f"Could not find target in index.html for {page_id}")
        return
        
    index_content = index_content.replace(match_curr.group(1), orig_content)
    print(f"Successfully restored {page_id}")

restore_page('page-cold-storage', 'cold_original.html', 'Book Cold Storage Space')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(index_content)
