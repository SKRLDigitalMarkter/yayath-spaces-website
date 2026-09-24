import os
import glob

# The 15 images
images = [
    'Croma_idpW4Nsf-e_0.png',
    'Flipkart_Logo_1.png',
    'Logo Alternative.png',
    'icon.jpeg',
    'id6xCSJt11_1789641689758.png',
    'idCMb-1Vvp_1790245832734.png',
    'idJdmxaLWm_1789641656388.png',
    'idMhf8Pm20_1789641533322.png',
    'idXXpID_zz_logos.jpeg',
    'idjbAcGkVm_1790245853325.png',
    'idq1EoovRe_1789641748345.png',
    'idqkM7VDur_1789641511227.png',
    'idrqtYw5zm_1789641798631.png',
    'idt1r-A1le_logos.png',
    'idyG5iAl6K_1789641822461.png'
]

# 1. Homepage marquee update (uses client-chip)
track1_inner = ''
for img in images * 2:
    src = f'assets/images/warehouse-clients/{img.replace(" ", "%20")}'
    track1_inner += f'        <div class="client-chip"><img src="{src}" alt="Warehouse Client" loading="lazy" /></div>\n\n'
new_track1 = f'<div class="marquee-track">\n\n{track1_inner}      </div>'

# 2. 3PL Page marquee update (uses client-logo-card)
track2_inner = '                      <!-- Set 1 -->\n\n'
for img in images:
    src = f'assets/images/warehouse-clients/{img.replace(" ", "%20")}'
    track2_inner += f'                      <div class="client-logo-card"><img src="{src}" alt="Client Logo" class="client-logo-img"></div>\n\n'
track2_inner += '                      <!-- Set 2 for seamless loop -->\n\n'
for img in images:
    src = f'assets/images/warehouse-clients/{img.replace(" ", "%20")}'
    track2_inner += f'                      <div class="client-logo-card"><img src="{src}" alt="Client Logo" class="client-logo-img"></div>\n\n'

html_files = glob.glob('*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    modified = False

    # Update homepage style marquee (which is under marquee-wrapper usually)
    start_wrapper = html.find('<div class="marquee-wrapper">')
    if start_wrapper != -1:
        start_track = html.find('<div class="marquee-track">', start_wrapper)
        if start_track != -1:
            end_track = html.find('      </div>', start_track) + len('      </div>')
            old_track1 = html[start_track:end_track]
            html = html.replace(old_track1, new_track1)
            modified = True

    # Update 3PL style marquee (which is under marquee-container usually)
    start_container = html.find('<div class="marquee-container">')
    while start_container != -1:
        start_track2 = html.find('<div class="marquee-track">', start_container)
        if start_track2 != -1 and start_track2 < start_container + 500:
            end_track2 = html.find('                  </div>', start_track2)
            if end_track2 != -1:
                end_track2 += len('                  </div>')
                old_track2 = html[start_track2:end_track2]
                new_track2 = f'<div class="marquee-track">\n\n{track2_inner}                  </div>'
                html = html.replace(old_track2, new_track2)
                modified = True
        start_container = html.find('<div class="marquee-container">', start_container + 1)
        
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'Successfully updated {filepath}')

