import sys

with open('index.html', 'rb') as f:
    b = f.read()

idx = b.find(b'299')
print(b[idx-10:idx+5])
