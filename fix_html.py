with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# I need to fix the broken sections. They look like:
# <section       <section style="padding:60px 0;background:#fff;">
# ... gallery ...
# </section>
# id="3pl-form"

# Wait, let's just do a regex replace to clean it up.
import re

# The broken part is `<section ` followed by whitespace/newlines and then the gallery section.
# Actually, the original was `<section id="3pl-form"`
# I inserted gallery_html at the index of `id="3pl-form"`.
# So it became `<section ` + gallery_html + `id="3pl-form"`

content = content.replace("<section       <section style=\"padding:60px 0;background:#fff;\">", "<section style=\"padding:60px 0;background:#fff;\">")
# Let's write a smarter replace.
content = re.sub(r'<section\s*(<section style="padding:60px 0;background:#fff;">)', r'\1', content)
# And add `<section ` back before the id="...-form"
content = content.replace('\nid="3pl-form"', '\n<section id="3pl-form"')
content = content.replace('\nid="dark-store-form"', '\n<section id="dark-store-form"')
content = content.replace('\nid="cold-storage-form"', '\n<section id="cold-storage-form"')

# Wait, the gallery html started with `\n      <section style...`
# Let's just fix it by finding the exact string.

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed!")
