import re

with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

def restore_page(page_id, orig_file, current_form_title):
    global index_content
    with open(orig_file, 'r', encoding='utf-8') as f:
        orig = f.read()
    
    # 1. Extract from original: from <div class="page" id="{page_id}" up to the form section
    # We will look for <section id="...-form" in the original file
    match_orig = re.search(rf'(<div class="page" id="{page_id}".*?)(?=<section id="[a-zA-Z0-9\-_]+-form")', orig, re.DOTALL)
    if not match_orig:
        print(f"Could not extract original for {page_id}")
        return
    orig_content = match_orig.group(1)
    
    # 2. Extract from current index.html: from <div class="page" id="{page_id}" up to the form section
    # In index.html, we look for the section containing current_form_title
    match_curr = re.search(rf'(<div class="page" id="{page_id}".*?)(?=<section[^>]*>[\s]*<div[^>]*>[\s]*<div[^>]*>[\s]*<h2[^>]*>{current_form_title})', index_content, re.DOTALL)
    if not match_curr:
        print(f"Could not find target in index.html for {page_id}")
        return
        
    index_content = index_content.replace(match_curr.group(1), orig_content)
    
    # Let's also restore the id="...-form" into the section tag in index.html if it's missing!
    # Because otherwise the scroll links are broken.
    if page_id == 'page-3pl-services':
        index_content = index_content.replace('<section style="padding:90px 0;background:#262161;color:#fff;">\n        <div class="section-inner" style="max-width:850px;margin:0 auto;">\n          <div style="text-align:center;margin-bottom:50px;">\n            <h2 style="font-size:2.8rem;font-weight:800;margin-bottom:15px;">Request a 3PL Quote</h2>',
                                              '<section id="3pl-form" style="padding:90px 0;background:#262161;color:#fff;">\n        <div class="section-inner" style="max-width:850px;margin:0 auto;">\n          <div style="text-align:center;margin-bottom:50px;">\n            <h2 style="font-size:2.8rem;font-weight:800;margin-bottom:15px;">Request a 3PL Quote</h2>')
        
    print(f"Successfully restored {page_id}")

restore_page('page-3pl-services', '3pl_original.html', 'Request a 3PL Quote')
# For dark and cold, they already had ids correctly because my previous script matched them (or maybe I should just use the same logic).
# But wait, my previous script ALREADY modified dark and cold!
# Let me re-read index.html to avoid double-replacing or corrupting if I already replaced dark-storage!
