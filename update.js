const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Change Commercial Spaces headline
html = html.replace(
  '<h1 style="color:#fff;font-size:clamp(2.5rem,5vw,4rem);font-weight:900;margin-bottom:20px;">Our <span class="gold-text">Commercial Space</span></h1>',
  '<h1 style="color:#fff;font-size:clamp(2.5rem,5vw,4rem);font-weight:900;margin-bottom:20px;">Explore Our <span class="gold-text">Commercial Spaces</span></h1>'
);
html = html.replace(
  '<p style="color:#f1f5f9;font-size:1.2rem;max-width:700px;margin:0 auto 30px;">Explore our portfolio of premium enterprise and managed offices located in Delhi NCR\'s most sought-after locations.</p>',
  '<p style="color:#f1f5f9;font-size:1.2rem;max-width:700px;margin:0 auto 30px;">Discover premium enterprise and managed offices across Gurugram\'s most sought-after business locations.</p>'
);

// 2. Add Warehouse link to Desktop Nav (Under Mobility)
html = html.replace(
  '<a href="#virtual-office" onclick="showPage(\'virtual-office\')"><i class="ti ti-briefcase"></i> Virtual Office</a>\n            </div>',
  '<a href="#virtual-office" onclick="showPage(\'virtual-office\')"><i class="ti ti-briefcase"></i> Virtual Office</a>\n              <a href="#warehouse" onclick="showPage(\'warehouse\')"><i class="ti ti-package"></i> Warehouse Showcase</a>\n            </div>'
);

// Add Warehouse link to Mobile Nav (Under Mobility)
html = html.replace(
  '<a href="#virtual-office" onclick="showPage(\'virtual-office\');closeMobile();" style="padding-left:28px;"><i class="ti ti-briefcase"></i> Virtual Office</a>\n        </div>',
  '<a href="#virtual-office" onclick="showPage(\'virtual-office\');closeMobile();" style="padding-left:28px;"><i class="ti ti-briefcase"></i> Virtual Office</a>\n          <a href="#warehouse" onclick="showPage(\'warehouse\');closeMobile();" style="padding-left:28px;"><i class="ti ti-package"></i> Warehouse Showcase</a>\n        </div>'
);

// Add Warehouse to Footer Links
html = html.replace(
  '<li><a href="#virtual-office" onclick="showPage(\'virtual-office\')">Virtual Office</a></li>',
  '<li><a href="#virtual-office" onclick="showPage(\'virtual-office\')">Virtual Office</a></li>\n              <li><a href="#warehouse" onclick="showPage(\'warehouse\')">Warehouse Showcase</a></li>'
);

// 3. Insert the new Warehouse page before page-loc-detail
const warehouseHTML = `
<div class="page" id="page-warehouse" style="padding:0; background:#fff; display:none;">
  <div class="page-hero" style="position:relative;min-height:300px;display:flex;align-items:center;overflow:hidden;">
    <div style="position:absolute;top:0;left:0;width:100%;height:100%;background-image:url('assets/images/spaces/ai_space_1.jpg');background-size:cover;background-position:center;"></div>
    <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(135deg,rgba(38,33,97,0.88),rgba(10,10,30,0.92));"></div>
    <div class="section-inner" style="position:relative;z-index:2;padding:60px 20px;">
      <div style="display:inline-block;background:rgba(245,166,35,0.2);border:1px solid rgba(245,166,35,0.5);color:#f5a623;padding:6px 16px;border-radius:20px;font-size:0.85rem;font-weight:600;letter-spacing:1px;margin-bottom:16px;">WAREHOUSE SERVICES</div>
      <h1 style="color:#fff;font-size:clamp(2rem,5vw,3.2rem);font-weight:800;margin-bottom:10px;">Warehouse <span style="color:#f5a623;">Showcase</span></h1>
      <p style="color:rgba(255,255,255,0.8);font-size:1.1rem;">Scalable storage and 3PL operations across India.</p>
      <div style="margin-top:16px;color:rgba(255,255,255,0.6);font-size:0.9rem;">Home &gt; Our Spaces &gt; <span style="color:#f5a623;">Warehouse Showcase</span></div>
    </div>
  </div>

  <section style="background:#f8fafc;padding:70px 0;">
    <div class="section-inner">
      <div style="text-align:center;max-width:680px;margin:0 auto 50px;">
        <h2 style="font-size:clamp(1.6rem,4vw,2.4rem);color:#262161;font-weight:800;margin-bottom:12px;">Warehouse <span style="color:#f5a623;">Services</span></h2>
        <p style="color:#64748b;">Comprehensive warehousing solutions tailored to your business needs.</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px;margin-bottom:50px;">
        
        <div class="reveal" style="background:#fff;border-radius:20px;padding:30px;box-shadow:0 4px 20px rgba(0,0,0,0.07);border:1.5px solid #e2e8f0;text-align:center;">
          <div style="width:56px;height:56px;border-radius:50%;background:rgba(38,33,97,0.08);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;"><i class="ti ti-package" style="font-size:1.6rem;color:#262161;"></i></div>
          <h3 style="color:#262161;font-size:1.2rem;margin-bottom:6px;">Warehouse Services</h3>
          <p style="color:#64748b;font-size:0.88rem;line-height:1.6;margin-bottom:16px;">Premium warehouse services across India tailored to corporate and nascent needs.</p>
          <button onclick="openLeadModal('Warehouse Services')" style="width:100%;padding:12px;border-radius:10px;border:2px solid #262161;background:transparent;color:#262161;font-weight:700;cursor:pointer;">Inquire Now</button>
        </div>
        
        <div class="reveal" style="background:#262161;border-radius:20px;padding:30px;box-shadow:0 8px 30px rgba(38,33,97,0.3);border:1.5px solid #262161;text-align:center;">
          <div style="width:56px;height:56px;border-radius:50%;background:rgba(245,166,35,0.2);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;"><i class="ti ti-snowflake" style="font-size:1.6rem;color:#f5a623;"></i></div>
          <h3 style="color:#fff;font-size:1.2rem;margin-bottom:6px;">Cold Storage</h3>
          <p style="color:rgba(255,255,255,0.75);font-size:0.88rem;line-height:1.6;margin-bottom:16px;">Temperature-controlled warehousing for perishables, pharma, and sensitive goods.</p>
          <button onclick="openLeadModal('Cold Storage')" style="width:100%;padding:12px;border-radius:10px;border:none;background:#f5a623;color:#262161;font-weight:700;cursor:pointer;">Inquire Now</button>
        </div>
        
        <div class="reveal" style="background:#fff;border-radius:20px;padding:30px;box-shadow:0 4px 20px rgba(0,0,0,0.07);border:1.5px solid #e2e8f0;text-align:center;">
          <div style="width:56px;height:56px;border-radius:50%;background:rgba(38,33,97,0.08);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;"><i class="ti ti-box" style="font-size:1.6rem;color:#262161;"></i></div>
          <h3 style="color:#262161;font-size:1.2rem;margin-bottom:6px;">Dark Storage</h3>
          <p style="color:#64748b;font-size:0.88rem;line-height:1.6;margin-bottom:16px;">Cost-effective bulk storage spaces for inventory with specialized handling needs.</p>
          <button onclick="openLeadModal('Dark Storage')" style="width:100%;padding:12px;border-radius:10px;border:2px solid #262161;background:transparent;color:#262161;font-weight:700;cursor:pointer;">Inquire Now</button>
        </div>
      </div>
    </div>
  </section>

  <!-- Warehouse Enquiry Form -->
  <section id="warehouse-form" style="padding:100px 0; background:#fff;">
    <div class="section-inner">
        <div style="max-width:800px;margin:0 auto;background:#f8fafc;border-radius:24px;padding:60px;box-shadow:0 20px 50px rgba(0,0,0,0.05);border:1px solid #e2e8f0;">
            <div style="text-align:center;margin-bottom:40px;">
                <h2 style="font-size:2.5rem;color:#262161;font-weight:800;margin-bottom:15px;">Secure Your Warehouse Space</h2>
                <p style="color:#64748b;font-size:1.1rem;">Provide your details below and our logistics experts will reach out to curate the perfect storage solution.</p>
            </div>
            <form class="contact-form" onsubmit="submitWarehouseForm(event)">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:25px;margin-bottom:25px;">
                    <div>
                        <label style="display:block;margin-bottom:10px;font-weight:600;color:#1e293b;">Full Name *</label>
                        <input type="text" id="warehouse-name" placeholder="Your Name" required style="width:100%;padding:16px 20px;border:1px solid #cbd5e1;border-radius:12px;font-size:1rem;background:#fff;outline:none;transition:border-color 0.3s;">
                    </div>
                    <div>
                        <label style="display:block;margin-bottom:10px;font-weight:600;color:#1e293b;">Phone Number *</label>
                        <input type="tel" id="warehouse-phone" placeholder="+91 XXXXXXXXXX" required style="width:100%;padding:16px 20px;border:1px solid #cbd5e1;border-radius:12px;font-size:1rem;background:#fff;outline:none;transition:border-color 0.3s;">
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:25px;margin-bottom:25px;">
                    <div>
                        <label style="display:block;margin-bottom:10px;font-weight:600;color:#1e293b;">Email Address *</label>
                        <input type="email" id="warehouse-email" placeholder="email@company.com" required style="width:100%;padding:16px 20px;border:1px solid #cbd5e1;border-radius:12px;font-size:1rem;background:#fff;outline:none;transition:border-color 0.3s;">
                    </div>
                    <div>
                        <label style="display:block;margin-bottom:10px;font-weight:600;color:#1e293b;">Brand / Company Name *</label>
                        <input type="text" id="warehouse-company" placeholder="Your Brand" required style="width:100%;padding:16px 20px;border:1px solid #cbd5e1;border-radius:12px;font-size:1rem;background:#fff;outline:none;transition:border-color 0.3s;">
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:25px;margin-bottom:25px;">
                    <div>
                        <label style="display:block;margin-bottom:10px;font-weight:600;color:#1e293b;">Location *</label>
                        <input type="text" id="warehouse-location" placeholder="e.g. Gurugram, Delhi" required style="width:100%;padding:16px 20px;border:1px solid #cbd5e1;border-radius:12px;font-size:1rem;background:#fff;outline:none;transition:border-color 0.3s;">
                    </div>
                    <div>
                        <label style="display:block;margin-bottom:10px;font-weight:600;color:#1e293b;">Budget</label>
                        <input type="text" id="warehouse-budget" placeholder="e.g. 50,000 / month" style="width:100%;padding:16px 20px;border:1px solid #cbd5e1;border-radius:12px;font-size:1rem;background:#fff;outline:none;transition:border-color 0.3s;">
                    </div>
                </div>
                <div style="margin-bottom:25px;">
                    <label style="display:block;margin-bottom:10px;font-weight:600;color:#1e293b;">Preferred Space Format</label>
                    <select id="warehouse-type" style="width:100%;padding:16px 20px;border:1px solid #cbd5e1;border-radius:12px;font-size:1rem;background:#fff;outline:none;cursor:pointer;">
                        <option value="Warehouse Services">Warehouse Services</option>
                        <option value="Cold Storage">Cold Storage</option>
                        <option value="Dark Storage">Dark Storage</option>
                        <option value="3PL Services">3PL Warehousing</option>
                    </select>
                </div>
                <div style="margin-bottom:35px;">
                    <label style="display:block;margin-bottom:10px;font-weight:600;color:#1e293b;">Message</label>
                    <textarea id="warehouse-notes" rows="4" placeholder="Tell us about your specific requirements, preferred micro-locations..." style="width:100%;padding:16px 20px;border:1px solid #cbd5e1;border-radius:12px;font-size:1rem;background:#fff;outline:none;resize:vertical;"></textarea>
                </div>
                <button type="submit" style="width:100%;padding:18px;background:linear-gradient(135deg, #262161, #3a328f);color:#fff;border:none;border-radius:12px;font-size:1.15rem;font-weight:700;cursor:pointer;transition:transform 0.2s, box-shadow 0.2s;box-shadow:0 10px 20px rgba(38,33,97,0.2);">Request Warehouse Proposal</button>
            </form>
        </div>
    </div>
  </section>

</div>
`;

html = html.replace('<div class="page" id="page-loc-detail"', warehouseHTML + '\n<div class="page" id="page-loc-detail"');

fs.writeFileSync('index.html', html);
console.log('index.html updated successfully.');
