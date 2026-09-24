import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('<section style="padding:90px 0;background:#262161;color:#fff;">\n        <div class="section-inner" style="max-width:850px;margin:0 auto;">\n          <div style="text-align:center;margin-bottom:50px;">\n            <h2 style="font-size:2.8rem;font-weight:800;margin-bottom:15px;">Request a 3PL Quote</h2>',
                          '<section id="3pl-form" style="padding:90px 0;background:#262161;color:#fff;">\n        <div class="section-inner" style="max-width:850px;margin:0 auto;">\n          <div style="text-align:center;margin-bottom:50px;">\n            <h2 style="font-size:2.8rem;font-weight:800;margin-bottom:15px;">Request a 3PL Quote</h2>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
