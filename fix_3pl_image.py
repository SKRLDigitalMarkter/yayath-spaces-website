with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

old_html = """      <section style="padding:80px 0;background:#f8fafc;">
          <div class="section-inner" style="display:flex;flex-wrap:wrap;gap:50px;align-items:flex-start;">
              <div style="flex:1;min-width:300px;">
                  <h2 style="font-size:2.2rem;color:#262161;font-weight:800;margin-bottom:20px;">What is 3PL?</h2>
                  <p style="color:#64748b;font-size:1.1rem;line-height:1.7;margin-bottom:20px;">Third-party logistics (3PL) allows businesses to outsource their warehousing and logistics operations to an external specialist. While you own the inventory and focus on selling the product, we manage the physical supply-chain activities.</p>
                  <p style="color:#64748b;font-size:1.1rem;line-height:1.7;">From receiving goods and quality checks to order processing, picking, packing, and returns?"we handle it all efficiently.</p>
                    <img src="assets/images/spaces/warehouse_3pl.jpg" alt="3PL Warehousing" style="width:100%; border-radius:16px; margin-top:30px; box-shadow:0 10px 30px rgba(0,0,0,0.1);">
              </div>
              <div style="flex:1;min-width:300px;background:#fff;padding:40px;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.05);">
                  <h3 style="font-size:1.5rem;color:#262161;font-weight:700;margin-bottom:20px;">Industries We Serve</h3>"""

new_html = """      <section style="padding:80px 0;background:#f8fafc;">
          <div class="section-inner">
              <div style="display:flex;flex-wrap:wrap;gap:50px;align-items:flex-start;">
                  <div style="flex:1;min-width:300px;">
                      <h2 style="font-size:2.2rem;color:#262161;font-weight:800;margin-bottom:20px;">What is 3PL?</h2>
                      <p style="color:#64748b;font-size:1.1rem;line-height:1.7;margin-bottom:20px;">Third-party logistics (3PL) allows businesses to outsource their warehousing and logistics operations to an external specialist. While you own the inventory and focus on selling the product, we manage the physical supply-chain activities.</p>
                      <p style="color:#64748b;font-size:1.1rem;line-height:1.7;">From receiving goods and quality checks to order processing, picking, packing, and returns—we handle it all efficiently.</p>
                  </div>
                  <div style="flex:1;min-width:300px;background:#fff;padding:40px;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.05);">
                      <h3 style="font-size:1.5rem;color:#262161;font-weight:700;margin-bottom:20px;">Industries We Serve</h3>"""

# Note the em-dash replacement in old_html to ensure exact match, but let's just use regex to be safe.
import re

# Since there might be encoding issues with the em-dash, I'll use regex.
pattern = re.compile(r'<section style="padding:80px 0;background:#f8fafc;">\s*<div class="section-inner" style="display:flex;flex-wrap:wrap;gap:50px;align-items:flex-start;">\s*<div style="flex:1;min-width:300px;">\s*<h2 style="font-size:2\.2rem;color:#262161;font-weight:800;margin-bottom:20px;">What is 3PL\?</h2>(.*?)(<img src="assets/images/spaces/warehouse_3pl\.jpg" alt="3PL Warehousing".*?>)\s*</div>\s*<div style="flex:1;min-width:300px;background:#fff;padding:40px;border-radius:16px;box-shadow:0 10px 30px rgba\(0,0,0,0\.05\);">\s*<h3 style="font-size:1\.5rem;color:#262161;font-weight:700;margin-bottom:20px;">Industries We Serve</h3>', re.DOTALL)

def repl(match):
    text_between = match.group(1)
    img_tag = match.group(2)
    return f'''<section style="padding:80px 0;background:#f8fafc;">
          <div class="section-inner">
              <div style="display:flex;flex-wrap:wrap;gap:50px;align-items:flex-start;">
                  <div style="flex:1;min-width:300px;">
                      <h2 style="font-size:2.2rem;color:#262161;font-weight:800;margin-bottom:20px;">What is 3PL?</h2>{text_between}                  </div>
                  <div style="flex:1;min-width:300px;background:#fff;padding:40px;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.05);">
                      <h3 style="font-size:1.5rem;color:#262161;font-weight:700;margin-bottom:20px;">Industries We Serve</h3>'''

content = pattern.sub(repl, content)

# Now I need to close the extra div and add the image after the Industries We Serve div.
# But wait, the Industries We Serve div contains a grid, then closes.
# Then the flex container closes.
# Then the section-inner closes.
# Let's find the end of that section.
# I can just search for the end of the flex container.

# Actually, doing it step by step is safer.

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated first part.")
