with open("js/main.js", "r", encoding="utf-8") as f:
    content = f.read()

bad_text = """        nested: [
          { label: 'Meeting Rooms', link: '#meeting-rooms', page: 'meeting-rooms', icon: 'ti-users' },
          { label: 'Daypass', link: '#daypass', page: 'daypass', icon: 'ti-ticket' },
          { label: 'Virtual Office', link: '#virtual-office', page: 'virtual-office', icon: 'ti-briefcase' }
        ]
        label: 'Warehouse',"""

good_text = """        nested: [
          { label: 'Meeting Rooms', link: '#meeting-rooms', page: 'meeting-rooms', icon: 'ti-users' },
          { label: 'Daypass', link: '#daypass', page: 'daypass', icon: 'ti-ticket' },
          { label: 'Virtual Office', link: '#virtual-office', page: 'virtual-office', icon: 'ti-briefcase' }
        ]
      },
      {
        label: 'Warehouse',"""

content = content.replace(bad_text, good_text)

with open("js/main.js", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed syntax error")
