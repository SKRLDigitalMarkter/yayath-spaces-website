import os

images = [
    'Croma_idpW4Nsf-e_0.png',
    'Flipkart_Logo_1.png',
    'Logo Alternative.png',
    'id6xCSJt11_1789641689758.png',
    'id95r1JSPJ_1789641771023.png',
    'idJdmxaLWm_1789641656388.png',
    'idMhf8Pm20_1789641533322.png',
    'idXXpID_zz_logos.jpeg',
    'idq1EoovRe_1789641748345.png',
    'idqkM7VDur_1789641511227.png',
    'idrqtYw5zm_1789641798631.png',
    'idyG5iAl6K_1789641822461.png'
]

track_inner = ''
for img in images * 2:
    src = f'assets/images/warehouse-clients/{img.replace(" ", "%20")}'
    track_inner += f'        <div class="client-chip"><img src="{src}" alt="Warehouse Client" loading="lazy" /></div>\n\n'

new_track = f'<div class="marquee-track">\n\n{track_inner}      </div>'

html_path = 'index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

real_start = html.find('<div class="marquee-track">')
if real_start != -1:
    real_end = html.find('      </div>', real_start) + len('      </div>')
    old_track = html[real_start:real_end]
    new_html = html.replace(old_track, new_track)
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(new_html)
    print('Successfully updated index.html')
else:
    print('Start marker not found.')
