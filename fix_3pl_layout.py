with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# We need to find the specific flex container in the What is 3PL section.
import re
# The section has <h2 style="font-size:2.2rem;color:#262161;font-weight:800;margin-bottom:20px;">What is 3PL?</h2>
# Find that H2, then look backward for the flex container.

idx = content.find("What is 3PL?</h2>")
if idx != -1:
    before = content[:idx]
    # Find the last <div style="display:flex;flex-wrap:wrap;gap:40px;align-items:stretch;">
    flex_idx = before.rfind('<div style="display:flex;flex-wrap:wrap;gap:40px;align-items:stretch;">')
    if flex_idx != -1:
        new_flex = '<div style="display:flex;flex-wrap:wrap;gap:40px;align-items:flex-start;">'
        content = content[:flex_idx] + new_flex + content[flex_idx+len(new_flex):]
        with open("index.html", "w", encoding="utf-8") as f:
            f.write(content)
        print("Updated flex layout for 3PL section.")
    else:
        print("Flex container not found.")
else:
    print("What is 3PL not found.")
