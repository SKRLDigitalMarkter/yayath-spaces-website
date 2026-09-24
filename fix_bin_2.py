import glob

html_files = glob.glob('*.html')
for filepath in html_files:
    with open(filepath, 'rb') as f:
        content = f.read()
    
    modified = False
    
    replacements = [
        (b'\xc3\xa2\xe2\x82\xac\xe2\x84\xa2', b"'"), # right single quote to ascii quote
        (b'\xc3\xa2\xe2\x82\xac\xc5\x93', b'"'),    # left double quote
        (b'\xc3\xa2\xe2\x82\xac\xc2\x9d', b'"'),    # right double quote
        (b'\xc3\x83\x82\xc3\x82\xc2\xa0', b' '),    # double-encoded nbsp
    ]
    
    for bad, good in replacements:
        if bad in content:
            content = content.replace(bad, good)
            modified = True
            
    if modified:
        with open(filepath, 'wb') as f:
            f.write(content)
        print('Fixed ' + filepath)
