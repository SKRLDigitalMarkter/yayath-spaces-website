const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The exact string to remove (with potential \r)
let linkToRemoveDesktop = '                <a href="#warehouse" onclick="showPage(\'warehouse\')"><i class="ti ti-package"></i> Warehouse Showcase</a>\n';
let linkToRemoveDesktopWin = '                <a href="#warehouse" onclick="showPage(\'warehouse\')"><i class="ti ti-package"></i> Warehouse Showcase</a>\r\n';

html = html.replace(linkToRemoveDesktop, '').replace(linkToRemoveDesktopWin, '');

let linkToRemoveMobile = '            <a href="#warehouse" onclick="showPage(\'warehouse\');closeMobile();" style="padding-left:28px;"><i class="ti ti-package"></i> Warehouse Showcase</a>\n';
let linkToRemoveMobileWin = '            <a href="#warehouse" onclick="showPage(\'warehouse\');closeMobile();" style="padding-left:28px;"><i class="ti ti-package"></i> Warehouse Showcase</a>\r\n';

html = html.replace(linkToRemoveMobile, '').replace(linkToRemoveMobileWin, '');

// Add it AFTER the Mobility nested dropdown (Desktop)
const targetDesktop = '</div>\n            </div>\n          </div>\n        </li>';
const replacementDesktop = '</div>\n            </div>\n            <a href="#warehouse" onclick="showPage(\'warehouse\')"><i class="ti ti-package"></i> Warehouse Showcase</a>\n          </div>\n        </li>';
// For Windows line endings
const targetDesktopWin = '</div>\r\n            </div>\r\n          </div>\r\n        </li>';
const replacementDesktopWin = '</div>\r\n            </div>\r\n            <a href="#warehouse" onclick="showPage(\'warehouse\')"><i class="ti ti-package"></i> Warehouse Showcase</a>\r\n          </div>\r\n        </li>';

html = html.replace(targetDesktop, replacementDesktop).replace(targetDesktopWin, replacementDesktopWin);

// Add it AFTER the Mobility nested dropdown (Mobile)
const targetMobile = '</div>\n      </div>\n      <ul class="mob-nav-list" style="margin-top:20px;">';
const replacementMobile = '</div>\n        <a href="#warehouse" onclick="showPage(\'warehouse\');closeMobile();" style="padding: 14px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 10px; color: #1e293b; font-weight: 600;"><i class="ti ti-package"></i> Warehouse Showcase</a>\n      </div>\n      <ul class="mob-nav-list" style="margin-top:20px;">';

const targetMobileWin = '</div>\r\n      </div>\r\n      <ul class="mob-nav-list" style="margin-top:20px;">';
const replacementMobileWin = '</div>\r\n        <a href="#warehouse" onclick="showPage(\'warehouse\');closeMobile();" style="padding: 14px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 10px; color: #1e293b; font-weight: 600;"><i class="ti ti-package"></i> Warehouse Showcase</a>\r\n      </div>\r\n      <ul class="mob-nav-list" style="margin-top:20px;">';

html = html.replace(targetMobile, replacementMobile).replace(targetMobileWin, replacementMobileWin);

fs.writeFileSync('index.html', html);
console.log('Update successful');
