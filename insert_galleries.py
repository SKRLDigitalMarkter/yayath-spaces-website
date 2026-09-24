import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

def insert_gallery(page_id, form_id, image1, image2):
    gallery_html = f"""
      <section style="padding:60px 0;background:#fff;">
          <div class="section-inner" style="max-width:1200px;margin:0 auto;text-align:center;">
              <h2 style="font-size:2.5rem;color:#262161;font-weight:800;margin-bottom:40px;">Our Facility Gallery</h2>
              <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:30px;">
                  <img src="assets/images/spaces/{image1}" style="width:100%;border-radius:12px;box-shadow:0 10px 20px rgba(0,0,0,0.1);" alt="Warehouse Gallery Image 1">
                  <img src="assets/images/spaces/{image2}" style="width:100%;border-radius:12px;box-shadow:0 10px 20px rgba(0,0,0,0.1);" alt="Warehouse Gallery Image 2">
              </div>
          </div>
      </section>
"""
    # Find the page section
    page_start = content.find(f'id="{page_id}"')
    if page_start == -1:
        print(f"Page {page_id} not found")
        return content
    
    # Find the form section within this page
    form_start = content.find(f'id="{form_id}"', page_start)
    if form_start == -1:
        print(f"Form {form_id} not found in {page_id}")
        return content
    
    # Insert just before the form section (find the <section that contains it)
    section_tag = content.rfind("<section", page_start, form_start)
    if section_tag == -1:
        section_tag = form_start - 10  # fallback
    
    return content[:form_start] + gallery_html + content[form_start:]

content = insert_gallery("page-3pl-services", "3pl-form", "warehouse_3pl_1.jpg", "warehouse_3pl_2.jpg")
content = insert_gallery("page-dark-storage", "dark-store-form", "warehouse_dark_1.jpg", "warehouse_dark_2.jpg")
content = insert_gallery("page-cold-storage", "cold-storage-form", "warehouse_cold_1.jpg", "warehouse_cold_2.jpg")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated index.html")
