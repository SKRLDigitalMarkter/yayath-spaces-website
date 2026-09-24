const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Update lead modal options to include Warehouse Services, Cold Storage, Dark Storage
html = html.replace(
  '<option value="Day Pass">Day Pass</option>\n            </select>\n          </div>\n          <div class="form-group-modal">\n            <label>Preferred Center</label>\n            <select id="modalLocationSelect">',
  '<option value="Day Pass">Day Pass</option>\n              <option value="Warehouse Services">Warehouse Services</option>\n              <option value="Cold Storage">Cold Storage</option>\n              <option value="Dark Storage">Dark Storage</option>\n            </select>\n          </div>\n          <div class="form-group-modal">\n            <label>Preferred Center</label>\n            <select id="modalLocationSelect">'
);

html = html.replace(
  '<option value="Day Pass">Day Pass</option>\n                    <option value="Meeting Room">Meeting Room</option>\n                  </select>\n                </div>\n                <div class="form-group">\n                  <label>Preferred Location</label>',
  '<option value="Day Pass">Day Pass</option>\n                    <option value="Meeting Room">Meeting Room</option>\n                    <option value="Warehouse Services">Warehouse Services</option>\n                    <option value="Cold Storage">Cold Storage</option>\n                    <option value="Dark Storage">Dark Storage</option>\n                  </select>\n                </div>\n                <div class="form-group">\n                  <label>Preferred Location</label>'
);

fs.writeFileSync('index.html', html);
console.log('index.html modal options updated successfully.');
