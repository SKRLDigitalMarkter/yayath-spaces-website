# -*- coding: utf-8 -*-
import os
import glob

replacements = {
    'â€� ': '-',
    'â€“': '-',
    'â˜…': '?',
    '—': '-',
    '–': '-',
    '★': '?'
}

html_files = glob.glob('*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    modified = False
    for bad, good in replacements.items():
        if bad in html:
            html = html.replace(bad, good)
            modified = True
            
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'Fixed mojibake in {filepath}')
