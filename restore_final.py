import re

with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

def restore_page(page_id, orig_file, current_form_title):
    global index_content
    with open(orig_file, 'r', encoding='utf-8') as f:
        orig = f.read()
    
    # Extract from original: from <div class="page" id="{page_id}" up to the form section
    if page_id == 'page-3pl-services':
        match_orig = re.search(rf'(<div class="page" id="{page_id}".*?)(?=<section id="3pl-form")', orig, re.DOTALL)
    elif page_id == 'page-dark-storage':
        match_orig = re.search(rf'(<div class="page" id="{page_id}".*?)(?=<section id="dark-store-form")', orig, re.DOTALL)
    else:
        match_orig = re.search(rf'(<div class="page" id="{page_id}".*?)(?=<section id="cold-storage-form")', orig, re.DOTALL)
        
    if not match_orig:
        print(f"Could not extract original for {page_id}")
        return
    orig_content = match_orig.group(1)
    
    # Extract from current index.html
    match_curr = re.search(rf'(<div class="page" id="{page_id}".*?)(?=<section[^>]*>[\s]*<div[^>]*>[\s]*<div[^>]*>[\s]*<h2[^>]*>{current_form_title})', index_content, re.DOTALL)
    if not match_curr:
        print(f"Could not find target in index.html for {page_id}")
        return
        
    index_content = index_content.replace(match_curr.group(1), orig_content)
    
    # Add back the id="...-form" for scroll targeting if missing
    if page_id == 'page-3pl-services':
        index_content = index_content.replace('<section style="padding:90px 0;background:#262161;color:#fff;">\n        <div class="section-inner" style="max-width:850px;margin:0 auto;">\n          <div style="text-align:center;margin-bottom:50px;">\n            <h2 style="font-size:2.8rem;font-weight:800;margin-bottom:15px;">Request a 3PL Quote</h2>',
                                              '<section id="3pl-form" style="padding:90px 0;background:#262161;color:#fff;">\n        <div class="section-inner" style="max-width:850px;margin:0 auto;">\n          <div style="text-align:center;margin-bottom:50px;">\n            <h2 style="font-size:2.8rem;font-weight:800;margin-bottom:15px;">Request a 3PL Quote</h2>')
    elif page_id == 'page-cold-storage':
        index_content = index_content.replace('<section style="padding:90px 0;background:#262161;color:#fff;">\n        <div class="section-inner" style="max-width:850px;margin:0 auto;">\n          <div style="text-align:center;margin-bottom:50px;">\n            <h2 style="font-size:2.8rem;font-weight:800;margin-bottom:15px;">Request a Cold Storage Quote</h2>',
                                              '<section id="cold-storage-form" style="padding:90px 0;background:#262161;color:#fff;">\n        <div class="section-inner" style="max-width:850px;margin:0 auto;">\n          <div style="text-align:center;margin-bottom:50px;">\n            <h2 style="font-size:2.8rem;font-weight:800;margin-bottom:15px;">Request a Cold Storage Quote</h2>')
                                              
    print(f"Successfully restored {page_id}")

restore_page('page-3pl-services', '3pl_original.html', 'Request a 3PL Quote')
restore_page('page-dark-storage', 'dark_original.html', 'Launch Your Dark Store')
restore_page('page-cold-storage', 'cold_original.html', 'Request a Cold Storage Quote')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(index_content)
