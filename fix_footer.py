import re

with open('original_index.html', 'r', encoding='utf-8') as f:
    orig = f.read()

with open('index.html', 'r', encoding='utf-8') as f:
    curr = f.read()

match_orig = re.search(r'(<footer class="footer">.*?</footer>)', orig, re.DOTALL)
if match_orig:
    orig_footer = match_orig.group(1)
    
    # In curr, find the broken footer. It starts at <footer class="footer"> and probably goes until <!-- Lead Generation Modal --> but let's be careful.
    # Let's find <footer class="footer"> up to <!-- Lead Generation Modal -->
    match_curr = re.search(r'(<footer class="footer">.*?)(?=<!-- Lead Generation Modal -->)', curr, re.DOTALL)
    
    if match_curr:
        curr = curr.replace(match_curr.group(1), orig_footer + '\n  ')
        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(curr)
        print("Restored footer successfully.")
    else:
        print("Could not find current footer bounds.")
else:
    print("Could not find original footer.")

