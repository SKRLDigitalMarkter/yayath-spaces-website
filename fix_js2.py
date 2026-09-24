with open("js/main.js", "r", encoding="utf-8") as f:
    content = f.read()

# Just fix the specific messed up part from the tool replacement.
import re

# Remove the incorrectly placed Warehouse object.
bad_text = """      {
        label: 'Warehouse',
        icon: 'ti-package',
        isNested: true,
        nested: [
          { label: '3PL Services', link: '#3pl-services', page: '3pl-services', icon: 'ti-truck-delivery' },
          { label: 'Dark Store', link: '#dark-storage', page: 'dark-storage', icon: 'ti-box' },
          { label: 'Cold Storage', link: '#cold-storage', page: 'cold-storage', icon: 'ti-snowflake' }
        ]
      },
"""
if bad_text in content:
    content = content.replace(bad_text, "")

old_broken = """        nested: [
          { label: 'Cold Storage', link: '#cold-storage', page: 'cold-storage', icon: 'ti-snowflake' },
          { label: '3PL Services', link: '#3pl-services', page: '3pl-services', icon: 'ti-truck' },
          { label: 'Dark Storage', link: '#dark-storage', page: 'dark-storage', icon: 'ti-box' }
        ]"""
new_fixed = """        label: 'Warehouse',
        icon: 'ti-package',
        isNested: true,
        nested: [
          { label: '3PL Services', link: '#3pl-services', page: '3pl-services', icon: 'ti-truck-delivery' },
          { label: 'Dark Store', link: '#dark-storage', page: 'dark-storage', icon: 'ti-box' },
          { label: 'Cold Storage', link: '#cold-storage', page: 'cold-storage', icon: 'ti-snowflake' }
        ]"""

content = content.replace(old_broken, new_fixed)

with open("js/main.js", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed js/main.js")
