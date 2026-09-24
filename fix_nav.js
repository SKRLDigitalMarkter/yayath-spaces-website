const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix the dropdown location in Desktop Nav
html = html.replace(
  '<a href="#warehouse" onclick="showPage(\'warehouse\')"><i class="ti ti-package"></i> Warehouse Showcase</a>\n              </div>',
  '</div>'
);
html = html.replace(
  '</div>\n            </div>\n          </div>\n        </li>\n        <li><a class="nav-link" data-page="locations"',
  '</div>\n            </div>\n            <a href="#warehouse" onclick="showPage(\'warehouse\')"><i class="ti ti-package"></i> Warehouse Showcase</a>\n          </div>\n        </li>\n        <li><a class="nav-link" data-page="locations"'
);

// 2. Fix the dropdown location in Mobile Nav
html = html.replace(
  '<a href="#warehouse" onclick="showPage(\'warehouse\');closeMobile();" style="padding-left:28px;"><i class="ti ti-package"></i> Warehouse Showcase</a>\n          </div>',
  '</div>'
);
html = html.replace(
  '</div>\n      </div>\n      <ul class="mob-nav-list" style="margin-top:20px;">',
  '</div>\n        <a href="#warehouse" onclick="showPage(\'warehouse\');closeMobile();" style="padding: 10px 14px;"><i class="ti ti-package"></i> Warehouse Showcase</a>\n      </div>\n      <ul class="mob-nav-list" style="margin-top:20px;">'
);

// 3. Fix the H2 heading in Commercial Spaces
html = html.replace(
  '<h2 style="font-size:2.5rem;font-weight:800;color:#0f172a;">Commercial <span class="gold-text">Spaces</span></h2>\n        </div>',
  '<h2 style="font-size:2.5rem;font-weight:800;color:#0f172a;">Explore Our <span class="gold-text">Commercial Spaces</span></h2>\n          <p style="color:#64748b;font-size:1.1rem;max-width:700px;margin:20px auto 0;">Discover premium enterprise and managed offices across Gurugram\'s most sought-after business locations.</p>\n        </div>'
);

fs.writeFileSync('index.html', html);
console.log('Fixed dropdowns and h2');
