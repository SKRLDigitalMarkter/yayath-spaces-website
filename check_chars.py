import sys

with open('index.html', 'rb') as f:
    html = f.read().decode('utf-8', errors='ignore')

# print a snippet around '299'
idx = html.find('299')
if idx != -1:
    print(repr(html[idx-10:idx+5]))

idx2 = html.find('12,000')
if idx2 != -1:
    print(repr(html[idx2-10:idx2+6]))
