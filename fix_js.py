with open("js/main.js", "r", encoding="utf-8") as f:
    content = f.read()

import re

old_nested = """          nested: [
            { label: 'Cold Storage', link: '#cold-storage', page: 'cold-storage', icon: 'ti-snowflake' },
            { label: '3PL Services', link: '#3pl-services', page: '3pl-services', icon: 'ti-truck' },
            { label: 'Dark Storage', link: '#dark-storage', page: 'dark-storage', icon: 'ti-box' }
          ]"""

new_nested = """          nested: [
            { label: '3PL Services', link: '#3pl-services', page: '3pl-services', icon: 'ti-truck-delivery' },
            { label: 'Dark Store', link: '#dark-storage', page: 'dark-storage', icon: 'ti-box' },
            { label: 'Cold Storage', link: '#cold-storage', page: 'cold-storage', icon: 'ti-snowflake' }
          ]"""

if old_nested in content:
    content = content.replace(old_nested, new_nested)
    with open("js/main.js", "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed js/main.js")
else:
    print("Could not find the exact string to replace in js/main.js")
