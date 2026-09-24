with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('js/main.js?v=1788169868999', 'js/main.js?v=9999999999999')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated cache buster.")
