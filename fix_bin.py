import glob

html_files = glob.glob('*.html')
for filepath in html_files:
    with open(filepath, 'rb') as f:
        content = f.read()
    
    modified = False
    
    replacements = [
        (b'\xc3\xa2\xe2\x82\xac\xe2\x80\x94', b'-'),
        (b'\xc3\xa2\xe2\x82\xac\xe2\x80\x9c', b'-'),
        (b'\xc3\xa2\xcb\x9c\xe2\x80\xa6', b'\xe2\x98\x85'),
        (b'\xc3\xa2\xe2\x80\x9d', b'-'),
    ]
    
    for bad, good in replacements:
        if bad in content:
            content = content.replace(bad, good)
            modified = True
            
    if modified:
        with open(filepath, 'wb') as f:
            f.write(content)
        print('Fixed ' + filepath)
