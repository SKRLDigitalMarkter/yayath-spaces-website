// ==========================================
// SEO META TAGS UPDATER
// ==========================================
const seoMetaData = {
  "home": { title: "Yayath Spaces | Premium Coworking & Managed Offices in Gurugram", desc: "Discover premium coworking spaces, managed offices, and private cabins in Gurugram with Yayath Spaces. Experience flexible terms, 24x7 access, and top-tier amenities. Book a tour!" },
  "about": { title: "About YAYATHSPACES | Coworking in Gurugram", desc: "YAYATHSPACES designs premium coworking & managed offices across Gurugram, built for focus, collaboration and growth. Learn our story and vision." },
  "coworking-spaces": { title: "Coworking space in Gurugram  hot desks & cabins", desc: "Flexible coworking space in Gurugram from Rs.299/day. Hot desks, dedicated desks & private cabins with high-speed WiFi and 24x7 access. YAYATHSPACES." },
  "managed": { title: "Managed office space in Gurugram | YAYATHSPACES", desc: "Grade-A managed offices in Gurugram for growing teams. Fully furnished, custom-branded suites with on-time setup & 24x7 support. Get a custom quote." },
  "meeting-rooms": { title: "Meeting room on rent in Gurugram | YAYATHSPACES", desc: "Book fully equipped meeting rooms by the hour in Gurugram  MG Road, Sector 44 & more. Ideal for interviews, client calls & team huddles." },
  "daypass": { title: "Coworking day pass Gurugram  Rs.299/day", desc: "Need a workspace for a day? Grab a coworking day pass in Gurugram for Rs.299  high-speed WiFi, comfy seating, coffee & meeting room access." },
  "virtual-office": { title: "Virtual office address in Gurugram | YAYATHSPACES", desc: "Get a prestigious business address in Gurugram for GST & company registration, with mail handling and on-demand meeting room access." },
  "locations": { title: "Coworking locations in Gurugram | YAYATHSPACES", desc: "Explore YAYATHSPACES centers across Gurugram ï¿½ MG Road, Sector 44, Golf Course Extension, Sector 32, NH-8, Udyog Vihar & Golf Course Road." },
  "amenities": { title: "Workspace amenities | YAYATHSPACES Gurugram", desc: "High-speed WiFi, meeting rooms, lounge areas, pantry & 24x7 access ï¿½ explore all amenities across YAYATHSPACES coworking centers in Gurugram." },
  "blog": { title: "Coworking & workspace insights | YAYATHSPACES blog", desc: "Tips on flexible workspaces, hybrid work, and choosing the right coworking or managed office setup in Gurugram, from the YAYATHSPACES team." },
  "contact": { title: "Contact YAYATHSPACES | Coworking in Gurugram", desc: "Get in touch with YAYATHSPACES for coworking, managed offices, day passes or virtual office plans in Gurugram. Call, WhatsApp or book a tour." },
  "commercial-spaces": { title: "Our Commercial Spaces | Yayath Spaces Gurugram", desc: "Explore Yayath Spaces premium commercial centers in Gurugram. Premium managed offices and coworking spaces at prime business locations like MGF Metropolis Mall, MG Road." },
  "retail-spaces": { title: "Retail Spaces | Yayath Spaces", desc: "Premium retail spaces, storefront management, and servicing in prime commercial locations." }
};

const locMetaData = {
  "mg-road": { title: "Coworking space on MG Road, Gurugram | YAYATHSPACES", desc: "Premium coworking & managed offices on MG Road, Gurugram, steps from the metro. Hot desks, private cabins & meeting rooms. Book a free tour." },
  "sector-44": { title: "Coworking space in Sector 44, Gurugram", desc: "YAYATHSPACES Sector 44 offers flexible coworking & managed offices with modern amenities in one of Gurugram's key business hubs. Book a tour." },
  "golf-course-ext": { title: "Coworking space, Golf Course Extension Rd", desc: "Work from YAYATHSPACES on Golf Course Extension Road ï¿½ hot desks, private cabins & meeting rooms in a premium Gurugram business corridor." },
  "sector-32": { title: "Coworking space in Sector 32, Gurugram", desc: "YAYATHSPACES Sector 32 offers dedicated desks, private cabins & meeting rooms for startups and growing teams. Schedule your free tour today." }
};

function updateMetaTags(title, desc) {
  if (title) document.title = title;
  if (desc) {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = desc;
  }
}

// ==========================================
// 1. REAL-TIME CRM DISPATCH & FORM HANDLERS
// ==========================================
const NTFY_URL = 'https://ntfy.sh/yayath_spaces_crm_leads_live_prod_2026';

function isValidPhone(phone) {
  const clean = String(phone || '').replace(/[^0-9]/g, '');
  return clean.length === 10 && /^[6-9]\d{9}$/.test(clean);
}

function isValidEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(String(email || '').trim());
}

var pushLeadToCRM = window.pushLeadToCRM = async function(data) {
  const leadId = 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
  const selectedLocation = (data.location && data.location.trim() !== '') ? data.location.trim() : 'Gurugram';
  
  const leadPayload = {
    id: leadId,
    name: data.name || 'Anonymous Client',
    phone: data.phone || '',
    email: data.email || '',
    company: data.company || 'Not Specified',
    solution: data.solution || 'General Coworking',
    location: selectedLocation,
    preferredLocation: selectedLocation,
    center: selectedLocation,
    source: data.source || 'Website Form',
    budget: data.budget || '',
    status: 'New',
    notes: data.notes || '',
    timestamp: Date.now(),
    dateStr: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  };

  console.log('Pushing lead to CRM:', leadPayload);

  // 1. Firebase RTDB
  try {
    fetch('https://yayath-crm-live-default-rtdb.asia-southeast1.firebasedatabase.app/leads/' + leadId + '.json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadPayload)
    }).catch(() => {});
  } catch(e) {}

  // 2. NTFY Stream
  try {
    fetch('https://ntfy.sh/yayath_spaces_crm_leads_live_prod_2026', {
      method: 'POST',
      headers: { 'Title': 'New Lead: ' + (data.name || 'Client') + ' (' + selectedLocation + ')', 'Tags': 'bell', 'Content-Type': 'application/json' },
      body: JSON.stringify(leadPayload),
      mode: 'cors'
    }).catch(() => {});
  } catch(e) {}

  // 3. Serverless API
  try {
    fetch('https://yayath-crm.vercel.app/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadPayload),
      mode: 'cors'
    }).catch(() => {});
  } catch(e) {}

  // 4. New CRM Dashboard
  try {
    fetch('https://yayath-spaces-crm.vercel.app/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: leadPayload.name,
        phone: leadPayload.phone,
        email: leadPayload.email,
        city: leadPayload.location,
        company: leadPayload.company,
        requirement: leadPayload.solution,
        pageSlug: leadPayload.source,
        message: leadPayload.notes,
        budget: leadPayload.budget
      }),
      mode: 'cors'
    }).catch(() => {});
  } catch(e) {}
};

// Form 1: Location Detail Page Form
window.submitLocLead = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const name = document.getElementById('ld-name')?.value?.trim();
  const phone = document.getElementById('ld-phone')?.value?.trim();
  const email = document.getElementById('ld-email')?.value?.trim();
  const locTitle = document.getElementById('locDetailTitle')?.innerText?.trim() || 'MG Road';

  if (!name || name.length < 2) { alert('Please enter your full name.'); return false; }
  if (!phone || phone.length < 10) { alert('Please enter a valid 10-digit phone number.'); return false; }
  if (!email || !email.includes('@')) { alert('Please enter a valid email address.'); return false; }

  const btn = document.getElementById('ld-submit-btn');
  const oldText = btn ? btn.innerHTML : 'Book a Tour';
  if (btn) { btn.innerHTML = '<i class="ti ti-loader animate-spin"></i> Submitting...'; btn.disabled = true; }

  pushLeadToCRM({
    name: name,
    phone: phone,
    email: email,
    solution: 'Location Tour & Day Pass',
    location: locTitle,
    source: 'Get in Touch Form',
    notes: 'Tour requested directly from ' + locTitle + ' detail page.'
  });

  setTimeout(() => {
    alert('Thank you ' + name + '! Your tour request for ' + locTitle + ' has been confirmed. Our leasing team will contact you shortly.');
    if (document.getElementById('ld-name')) document.getElementById('ld-name').value = '';
    if (document.getElementById('ld-phone')) document.getElementById('ld-phone').value = '';
    if (document.getElementById('ld-email')) document.getElementById('ld-email').value = '';
    if (btn) { btn.innerHTML = oldText; btn.disabled = false; }
  }, 500);
  return false;
};

// Form 2: Main "Book a Tour" Modal Form
window.submitLeadForm = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const form = e.target || document.getElementById('leadForm');
  const inputs = form ? form.querySelectorAll('input') : [];
  const selects = form ? form.querySelectorAll('select') : [];
  
  const name = (inputs[0]?.value || document.querySelector('#leadForm input[placeholder*="name"]')?.value || '').trim();
  const phone = (inputs[1]?.value || document.querySelector('#leadForm input[type="tel"]')?.value || '').trim();
  const email = (inputs[2]?.value || document.querySelector('#leadForm input[type="email"]')?.value || '').trim();
  const company = (inputs[3]?.value || document.querySelector('#leadForm input[placeholder*="Company"]')?.value || 'Not Specified').trim();
  
  const solutionEl = document.getElementById('modalSolutionSelect') || selects[0];
  const locationEl = document.getElementById('modalLocationSelect') || selects[1];
  
  const solution = solutionEl ? solutionEl.value : 'Private Cabin';
  const location = locationEl ? locationEl.value : 'MG Road';

  if (!name || name.length < 2) { alert('Please enter your full name.'); return false; }
  if (!phone || phone.length < 10) { alert('Please enter a valid 10-digit mobile number.'); return false; }
  if (!email || !email.includes('@')) { alert('Please enter a valid email address.'); return false; }

  const btn = form ? form.querySelector('button[type="submit"]') : null;
  const oldText = btn ? btn.innerHTML : 'Book Tour Walkthrough';
  if (btn) { btn.innerHTML = '<i class="ti ti-loader animate-spin"></i> Submitting...'; btn.disabled = true; }

  pushLeadToCRM({
    name: name,
    phone: phone,
    email: email,
    company: company,
    solution: solution,
    location: location,
    source: 'Book a Tour Modal',
    notes: 'Tour requested for ' + solution + ' at ' + location
  });

  setTimeout(() => {
    alert('Thank you ' + name + '! Your tour request for ' + location + ' has been confirmed. Our team will contact you shortly.');
    if (typeof closeLeadModal === 'function') closeLeadModal();
    if (form && form.reset) form.reset();
    if (btn) { btn.innerHTML = oldText; btn.disabled = false; }
  }, 500);
  return false;
};

// Form 3: Contact Us Page Form
var submitContact = window.submitContact = function() {
  const name = document.getElementById('cf-name')?.value?.trim();
  const email = document.getElementById('cf-email')?.value?.trim();
  const phone = document.getElementById('cf-phone')?.value?.trim();
  const company = document.getElementById('cf-company')?.value?.trim() || 'Not Specified';
  const seats = document.getElementById('cf-seats')?.value || '1-5 Seats';
  const callback = document.getElementById('cf-callback')?.value || 'Immediate';
  const solution = document.getElementById('cf-type')?.value || 'Dedicated Desks';
  const location = document.getElementById('cf-location')?.value || 'MG Road';
  const message = document.getElementById('cf-message')?.value?.trim() || '';

  if (!name || name.length < 2) { alert('Please enter your name.'); return false; }
  if (!phone || phone.length < 10) { alert('Please enter a valid phone number.'); return false; }

  const btn = document.getElementById('submit-contact-btn');
  if (btn) { btn.innerHTML = '<i class="ti ti-loader animate-spin"></i> Sending...'; btn.disabled = true; }

  pushLeadToCRM({
    name: name,
    phone: phone,
    email: email,
    company: company,
    solution: solution + ' (' + seats + ')',
    location: location,
    source: 'Contact Us Page Form',
    notes: 'Callback: ' + callback + ' | Location: ' + location + ' | ' + message
  });

  setTimeout(() => {
    const success = document.getElementById('cf-success');
    if (success) success.classList.add('show');
    if (btn) { btn.style.display = 'none'; }
  }, 500);
  return false;
};

// Form 4: Schedule a Visit Modal Form
window.submitScheduleForm = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const name = document.getElementById('sch-name')?.value?.trim() || '';
  const phone = document.getElementById('sch-phone')?.value?.trim() || '';
  const email = document.getElementById('sch-email')?.value?.trim() || '';
  const location = document.getElementById('sch-location')?.value || 'MG Road';
  const date = document.getElementById('sch-date')?.value || '';
  const time = document.getElementById('sch-time')?.value || 'Morning';

  if (!name || name.length < 2) { alert('Please enter your name.'); return false; }
  if (!phone || phone.length < 10) { alert('Please enter a valid phone number.'); return false; }

  const btn = e.target ? e.target.querySelector('button[type="submit"]') : null;
  const oldText = btn ? btn.innerHTML : 'Confirm Scheduled Visit';
  if (btn) { btn.innerHTML = '<i class="ti ti-loader animate-spin"></i> Submitting...'; btn.disabled = true; }

  pushLeadToCRM({
    name: name,
    phone: phone,
    email: email,
    solution: 'Scheduled Visit',
    location: location,
    source: 'Schedule Visit Modal',
    notes: 'Visit Date: ' + date + ' | Time Slot: ' + time + ' at ' + location
  });

  setTimeout(() => {
    alert('Thank you ' + name + '! Your visit to ' + location + ' on ' + date + ' (' + time + ') is confirmed.');
    if (typeof closeScheduleModal === 'function') closeScheduleModal();
    if (e.target && e.target.reset) e.target.reset();
    if (btn) { btn.innerHTML = oldText; btn.disabled = false; }
  }, 500);
  return false;
};

// Form 5: Enquire Modal Form
window.submitEnquireForm = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const name = document.getElementById('enq-name')?.value?.trim() || '';
  const email = document.getElementById('enq-email')?.value?.trim() || '';
  const phone = document.getElementById('enq-phone')?.value?.trim() || '';
  const company = document.getElementById('enq-company')?.value?.trim() || 'Not Specified';
  const type = document.getElementById('enq-type')?.value || 'Private Cabin';
  const seats = document.getElementById('enq-seats')?.value || '1 - 5 Seats';
  const notes = document.getElementById('enq-notes')?.value?.trim() || '';

  if (!name || name.length < 2) { alert('Please enter your name.'); return false; }
  if (!phone || phone.length < 10) { alert('Please enter a valid phone number.'); return false; }

  const btn = e.target ? e.target.querySelector('button[type="submit"]') : null;
  const oldText = btn ? btn.innerHTML : 'Request Custom Quote';
  if (btn) { btn.innerHTML = '<i class="ti ti-loader animate-spin"></i> Submitting...'; btn.disabled = true; }

  pushLeadToCRM({
    name: name,
    phone: phone,
    email: email,
    company: company,
    solution: type + ' (' + seats + ')',
    location: 'Any Gurugram Location',
    source: 'Custom Quote Modal',
    notes: 'Seats: ' + seats + ' | Requirements: ' + notes
  });

  setTimeout(() => {
    alert('Thank you ' + name + '! We have received your custom quote request.');
    if (typeof closeEnquireModal === 'function') closeEnquireModal();
    if (e.target && e.target.reset) e.target.reset();
    if (btn) { btn.innerHTML = oldText; btn.disabled = false; }
  }, 500);
  return false;
};

// Form 6: Instant Callback / Talk to Expert Form
window.submitExpertForm = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const name = document.getElementById('exp-name')?.value?.trim() || '';
  const phone = document.getElementById('exp-phone')?.value?.trim() || '';
  const type = document.getElementById('exp-type')?.value || 'Private Cabin';
  const time = document.getElementById('exp-time')?.value || 'Immediate';

  if (!name || name.length < 2) { alert('Please enter your name.'); return false; }
  if (!phone || phone.length < 10) { alert('Please enter a valid phone number.'); return false; }

  const btn = e.target ? e.target.querySelector('button[type="submit"]') : null;
  const oldText = btn ? btn.innerHTML : 'Request Instant Callback';
  if (btn) { btn.innerHTML = '<i class="ti ti-loader animate-spin"></i> Submitting...'; btn.disabled = true; }

  pushLeadToCRM({
    name: name,
    phone: phone,
    solution: type,
    location: 'Any Gurugram Location',
    source: 'Talk to Expert Modal',
    notes: 'Preferred Callback Time: ' + time
  });

  setTimeout(() => {
    alert('Thank you ' + name + '! Our expert will call you shortly.');
    if (typeof closeExpertModal === 'function') closeExpertModal();
    if (e.target && e.target.reset) e.target.reset();
    if (btn) { btn.innerHTML = oldText; btn.disabled = false; }
  }, 500);
  return false;
};

// Form 7: Homepage Inline Hero Lead Form
var submitLead = window.submitLead = function() {
  const name = document.getElementById('lf-name')?.value?.trim();
  const phone = document.getElementById('lf-phone')?.value?.trim();
  const email = document.getElementById('lf-email')?.value?.trim();
  const solution = document.getElementById('lf-type')?.value || 'Hot Desk';
  const message = document.getElementById('lf-message')?.value?.trim() || '';

  if (!name || name.length < 2) { alert('Please enter your full name.'); return false; }
  if (!phone || phone.length < 10) { alert('Please enter a valid phone number.'); return false; }

  const btn = document.getElementById('submit-lead-btn') || document.querySelector('[onclick="submitLead()"]');
  if (btn) { btn.innerHTML = '<i class="ti ti-loader animate-spin"></i> Sending...'; btn.disabled = true; }

  pushLeadToCRM({
    name: name,
    phone: phone,
    email: email,
    solution: solution,
    location: 'Any Gurugram Location',
    source: 'Consultation Form',
    notes: message
  });

  setTimeout(() => {
    const success = document.getElementById('lf-success');
    if (success) success.classList.add('show');
    if (btn) { btn.style.display = 'none'; }
  }, 500);
  return false;
};


// ==========================================
// 2. LOCATIONS DATABASE & DETAIL RENDERING
// ==========================================
const locationsDB = {
  'loc-mgf': {
    title: 'MG Road',
    tag: 'Flagship Centre',
    address: 'MG Road, Sector 28, Gurugram',
    img: 'assets/images/spaces/loc_mg_road.jpg',
    desc: 'Our flagship workspace on MG Road, positioned right next to MG Road Metro Station. Designed for high-performing teams, enterprises, and executives looking for supreme connectivity, world-class amenities, and an inspiring work environment.',
    sqft: '18,500 Sq. Ft.',
    seats: '400+ Seats',
    amenities: {
      included: [
        {icon: 'wifi', text: '1 Gbps Dedicated Fiber Internet'},
        {icon: 'coffee', text: 'Unlimited Gourmet Coffee & Tea'},
        {icon: 'device-laptop', text: 'Ergonomic Premium Workstations'},
        {icon: 'clock', text: '24/7 Biometric Access'},
        {icon: 'shield-check', text: 'CCTV & On-site Security'},
        {icon: 'bolt', text: '100% DG Power Backup'}
      ],
      paid: [
        {icon: 'video', text: 'Smart 4K Video Conf Rooms'},
        {icon: 'car', text: 'Reserved Basement Parking'},
        {icon: 'printer', text: 'High-speed Color Printing'}
      ]
    },
    options: [
      { name: 'Hot Desk', icon: 'armchair', price: '₹8,500/seat', desc: 'Any open workstation in our premium collaborative lounge.' },
      { name: 'Dedicated Desk', icon: 'device-laptop', price: '₹12,000/seat', desc: 'Your own reserved desk with lockable storage.' },
      { name: 'Private Cabin', icon: 'building', price: '₹15,000/seat', desc: 'Fully enclosed, sound-insulated lockable team cabin.' },
      { name: 'Virtual Office / Custom', icon: 'briefcase', price: 'Custom Quote', desc: 'Prestigious business address, GST registration & Custom Setup.' }
    ]
  },
  
  'loc-sohna': {
    title: 'Sohna Road',
    tag: 'Premium Business Hub',
    address: 'Sohna Road, Gurugram',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
    desc: 'An emerging premium business hub offering excellent connectivity and state-of-the-art facilities. Ideal for IT/ITES companies and corporate headquarters.',
    sqft: '25,000 Sq. Ft.',
    seats: '600+ Seats',
    amenities: {
      included: [
        {icon: 'wifi', text: 'High-Speed Internet'},
        {icon: 'coffee', text: 'Cafeteria & Lounge'},
        {icon: 'device-laptop', text: 'Premium Workstations'},
        {icon: 'clock', text: '24/7 Access'},
        {icon: 'shield-check', text: 'Security & CCTV'},
        {icon: 'bolt', text: 'Power Backup'}
      ],
      paid: [
        {icon: 'video', text: 'Conference Rooms'},
        {icon: 'car', text: 'Reserved Parking'},
        {icon: 'printer', text: 'Printing Services'}
      ]
    },
    options: [
      { name: 'Hot Desk', icon: 'armchair', price: '₹6,500/seat', desc: 'Flexible access to open workspaces.' },
      { name: 'Dedicated Desk', icon: 'device-laptop', price: '₹9,000/seat', desc: 'Your own reserved desk with storage.' },
      { name: 'Private Cabin', icon: 'building', price: '₹12,000/seat', desc: 'Secure, private space for your team.' },
      { name: 'Managed Office', icon: 'briefcase', price: 'Custom Quote', desc: 'Fully customized enterprise workspace.' }
    ]
  },'loc-sec44': {
    title: 'Sector 44',
    tag: 'Institutional Hub',
    address: 'Sector 44, Institutional Area, Gurugram',
    img: 'assets/images/spaces/loc_sector_44.jpg',
    desc: 'Situated in Gurugramâ€™s prime institutional zone near Huda City Centre metro. Features lush green surroundings, peaceful corporate ambience, and expansive layouts ideal for tech teams and growing companies.',
    sqft: '14,000 Sq. Ft.',
    seats: '300+ Seats',
    amenities: {
      included: [
        {icon: 'wifi', text: 'Dual High-Speed Fiber Lines'},
        {icon: 'coffee', text: 'Artisanal Tea & Coffee Lounge'},
        {icon: 'phone', text: 'Acoustic Calling Booths'},
        {icon: 'users', text: 'Community Events & Breakouts'},
        {icon: 'bolt', text: '100% Uninterrupted Power Backup'}
      ],
      paid: [
        {icon: 'video', text: 'Executive Boardrooms'},
        {icon: 'car', text: 'Dedicated Parking Space'},
        {icon: 'tools-kitchen-2', text: 'Cafeteria Meals & Snacks'}
      ]
    },
    options: [
      { name: 'Hot Desk', icon: 'armchair', price: '₹8,500/seat', desc: 'Open flexible desk access in collaborative zones.' },
      { name: 'Dedicated Desk', icon: 'device-laptop', price: '₹10,000/seat', desc: 'Fixed desk with under-desk locker.' },
      { name: 'Private Cabin', icon: 'building', price: '₹12,000/seat', desc: 'Acoustically treated private team cabin.' },
      { name: 'Virtual Office / Custom', icon: 'briefcase', price: 'Custom Quote', desc: 'Prestigious business address, GST registration & Custom Setup.' }
    ]
  },
  'loc-emaar': {
    title: 'Golf Course Extension',
    tag: 'Modern Corridor',
    address: 'Golf Course Extension Road, Sector 65, Gurugram',
    img: 'assets/images/spaces/loc_golf_course_ext.jpg',
    desc: 'A modern, vibrant workspace located in the rapidly growing Golf Course Extension corridor. Features abundant natural lighting, ergonomic setups, and a bustling corporate community.',
    sqft: '16,000 Sq. Ft.',
    seats: '350+ Seats',
    amenities: {
      included: [
        {icon: 'sun', text: 'Ample Natural Sunlight'},
        {icon: 'armchair', text: 'Ergonomic Seating'},
        {icon: 'wifi', text: 'Enterprise Grade WiFi'},
        {icon: 'coffee', text: 'Premium Coffee Machine'},
        {icon: 'sparkles', text: 'Community Breakout Lounge'}
      ],
      paid: [
        {icon: 'video', text: 'Conference & Boardrooms'},
        {icon: 'car', text: 'Visitor Parking Passes'},
        {icon: 'printer', text: 'Print & Copy Center'}
      ]
    },
    options: [
      { name: 'Hot Desk', icon: 'armchair', price: '₹8,500/seat', desc: 'Flexible open seating in collaborative work zone.' },
      { name: 'Dedicated Desk', icon: 'device-laptop', price: '₹11,000/seat', desc: 'Your own reserved desk with locker.' },
      { name: 'Private Cabin', icon: 'building', price: '₹14,000/seat', desc: 'Fully enclosed, lockable private team space.' },
      { name: 'Virtual Office / Custom', icon: 'briefcase', price: 'Custom Quote', desc: 'Prestigious business address, GST registration & Custom Setup.' }
    ]
  },
  'loc-star': {
    title: 'Sector 32',
    tag: 'Highway Connectivity',
    address: 'Sector 32, Exit 8, NH-8, Gurugram',
    img: 'assets/images/spaces/loc_sector_32.jpg',
    desc: 'Strategically located off the NH-8 expressway near IFFCO Chowk, this centre offers supreme accessibility for commuters across Delhi & Gurugram. Ideal for corporate branches, sales teams, and client-facing consultancies.',
    sqft: '12,000 Sq. Ft.',
    seats: '250+ Seats',
    amenities: {
      included: [
        {icon: 'wifi', text: 'High-Speed Enterprise WiFi'},
        {icon: 'coffee', text: 'Unlimited Fresh Tea & Coffee'},
        {icon: 'shield-check', text: '24/7 CCTV & Security'},
        {icon: 'sparkles', text: 'Daily Cleaning & Sanitization'},
        {icon: 'bolt', text: '100% Continuous Power Backup'}
      ],
      paid: [
        {icon: 'video', text: 'Meeting & Interview Rooms'},
        {icon: 'car', text: 'Reserved Parking'},
        {icon: 'printer', text: 'Printing & Scanning'}
      ]
    },
    options: [
      { name: 'Hot Desk', icon: 'armchair', price: '₹6,500/seat', desc: 'Flexible seating in collaborative open zones.' },
      { name: 'Dedicated Desk', icon: 'device-laptop', price: '₹7,500/seat', desc: 'Dedicated desk with personal lockable storage.' },
      { name: 'Private Cabin', icon: 'building', price: '₹10,500/seat', desc: 'Sound-proof private office for executive teams.' },
      { name: 'Virtual Office / Custom', icon: 'briefcase', price: 'Custom Quote', desc: 'Prestigious business address, GST registration & Custom Setup.' }
    ]
  },
  'loc-sig': {
    title: 'NH-8',
    tag: 'Prime Expressway',
    address: 'NH-8, South City I, Gurugram',
    img: 'assets/images/spaces/loc_nh8.jpg',
    desc: 'Operate directly on the NH-8 highway. Offering scalable Managed Offices and flexible coworking directly on the expressway, providing maximum convenience and connectivity.',
    sqft: '30,000 Sq. Ft.',
    seats: '800+ Seats',
    amenities: {
      included: [
        {icon: 'wifi', text: 'Enterprise Leased Internet'},
        {icon: 'building', text: 'Premium Corporate Ambience'},
        {icon: 'coffee', text: 'Pantry Access & Refreshments'},
        {icon: 'shield-check', text: 'Tier 1 Security & Access Control'},
        {icon: 'bolt', text: '100% Uninterrupted Power Backup'}
      ],
      paid: [
        {icon: 'video', text: 'Conference Rooms'},
        {icon: 'car', text: 'Valet & Dedicated Parking'},
        {icon: 'printer', text: 'Document Center'}
      ]
    },
    options: [
      { name: 'Hot Desk', icon: 'armchair', price: '₹7,500 - ₹8,500/seat', desc: 'Cost-effective flexible desk directly on highway.' },
      { name: 'Dedicated Desk', icon: 'device-laptop', price: '₹9,000/seat', desc: 'Your own reserved desk with locker.' },
      { name: 'Private Cabin', icon: 'building', price: '₹12,000/seat', desc: 'Fully enclosed, lockable private team office.' },
      { name: 'Virtual Office / Custom', icon: 'briefcase', price: 'Custom Quote', desc: 'Prestigious business address, GST registration & Custom Setup.' }
    ]
  },
  'loc-udyog': {
    title: 'Udyog Vihar',
    tag: 'Tech Corridor',
    address: 'Phase IV, Udyog Vihar, Sector 18, Gurugram',
    img: 'assets/images/spaces/loc_udyog_vihar.jpg',
    desc: 'A tech-enabled workspace designed specifically for startups, IT, and ITES companies in Gurugram traditional technology corridor, with robust infrastructure and round-the-clock support.',
    sqft: '20,000 Sq. Ft.',
    seats: '500+ Seats',
    amenities: {
      included: [
        {icon: 'server', text: 'Robust IT Infrastructure'},
        {icon: 'wifi', text: 'Dual High-Speed ISP Lines'},
        {icon: 'coffee', text: 'Large Pantry & Beverage Station'},
        {icon: 'clock', text: '24/7 Operations Support'},
        {icon: 'bolt', text: 'Heavy Duty Power Backup'}
      ],
      paid: [
        {icon: 'video', text: 'Meeting & Interview Rooms'},
        {icon: 'car', text: 'Dedicated Parking Space'},
        {icon: 'printer', text: 'Printing/Scanning Services'}
      ]
    },
    options: [
      { name: 'Hot Desk', icon: 'armchair', price: '₹7,500 - ₹8,500/seat', desc: 'Flexible seating in an open tech-friendly floor.' },
      { name: 'Dedicated Desk', icon: 'device-laptop', price: '₹9,000/seat', desc: 'Your own reserved desk with locker.' },
      { name: 'Private Cabin', icon: 'building', price: '₹12,000/seat', desc: 'Fully enclosed, lockable private team space.' },
      { name: 'Virtual Office / Custom', icon: 'briefcase', price: 'Custom Quote', desc: 'Prestigious business address, GST registration & Custom Setup.' }
    ]
  },
  'loc-augusta': {
    title: 'Golf Course Road',
    tag: 'Ultra Premium',
    address: 'Golf Course Road, Sector 53, Gurugram',
    img: 'assets/images/spaces/loc_golf_course_road.jpg',
    desc: 'An ultra-premium setting catering to high-profile clients, executives, and luxury businesses. Features world-class facilities, bespoke interiors, concierge services, and panoramic views.',
    sqft: '18,000 Sq. Ft.',
    seats: '300+ Seats',
    amenities: {
      included: [
        {icon: 'star', text: '5-Star Bespoke Interiors'},
        {icon: 'bell', text: 'Concierge & Reception Services'},
        {icon: 'wifi', text: 'Dedicated Leased Line Internet'},
        {icon: 'coffee', text: 'Barista Quality Coffee & Tea'},
        {icon: 'shield-check', text: 'VIP Access Control & Security'}
      ],
      paid: [
        {icon: 'car', text: 'Valet Parking'},
        {icon: 'video', text: 'Premium 4K Boardrooms'},
        {icon: 'sparkles', text: 'Private Event Spaces'}
      ]
    },
    options: [
      { name: 'Hot Desk', icon: 'armchair', price: '₹8,500/seat', desc: 'Access to luxury open lounge and flexible workstations.' },
      { name: 'Dedicated Desk', icon: 'device-laptop', price: '₹12,000/seat', desc: 'Dedicated desk with concierge privileges.' },
      { name: 'Private Cabin', icon: 'building', price: '₹15,000/seat', desc: 'High-end sound-proof cabin for executive teams.' },
      { name: 'Virtual Office / Custom', icon: 'briefcase', price: 'Custom Quote', desc: 'Prestigious business address, GST registration & Custom Setup.' }
    ]
  }
};

var openLocDetail = window.openLocDetail = function(locId) {
  if (locMetaData[locId]) updateMetaTags(locMetaData[locId].title, locMetaData[locId].desc);
  const data = locationsDB[locId];
  if(!data) return;

  // Populate Header
  const hero = document.getElementById('locDetailHero');
  if (hero) hero.style.backgroundImage = `url("${data.img}")`;
  
  const title = document.getElementById('locDetailTitle');
  if (title) title.innerText = data.title;
  
  const addr = document.getElementById('locDetailAddress');
  if (addr) addr.innerHTML = '<i class="ti ti-map-pin" style="color:#f5a623;"></i> ' + data.address;
  
  const tag = document.getElementById('locDetailTag');
  if (tag) {
    if (data.tag) {
      tag.style.display = 'inline-block';
      tag.innerText = data.tag;
    } else {
      tag.style.display = 'none';
    }
  }

  // Populate Content
  const desc = document.getElementById('locDetailDesc');
  if (desc) desc.innerText = data.desc;
  
  const sqft = document.getElementById('locDetailSqft');
  if (sqft) sqft.innerText = data.sqft;
  
  const seats = document.getElementById('locDetailSeats');
  if (seats) seats.innerText = data.seats;
  
  // Included Amenities
  const incAmensHtml = data.amenities.included.map(a => `
    <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;">
      <div style="background:#e0e7ff;color:#4f46e5;width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;">
        <i class="ti ti-${a.icon}"></i>
      </div>
      <span style="font-size:0.95rem;font-weight:600;color:#334155;">${a.text}</span>
      <i class="ti ti-check" style="margin-left:auto;color:#10b981;font-size:1.3rem;font-weight:bold;"></i>
    </div>
  `).join('');
  const incContainer = document.getElementById('locDetailIncludedAmens');
  if (incContainer) incContainer.innerHTML = incAmensHtml;

  // Paid Amenities
  const paidAmensHtml = data.amenities.paid.map(a => `
    <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:#fff5f5;border-radius:10px;border:1px solid #fed7d7;">
      <div style="background:#fee2e2;color:#ef4444;width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;">
        <i class="ti ti-${a.icon}"></i>
      </div>
      <span style="font-size:0.95rem;font-weight:600;color:#334155;">${a.text}</span>
      <span style="margin-left:auto;font-size:0.75rem;font-weight:700;color:#ef4444;background:#fef2f2;padding:4px 8px;border-radius:6px;border:1px solid #fecaca;">EXTRA</span>
    </div>
  `).join('');
  const paidContainer = document.getElementById('locDetailPaidAmens');
  if (paidContainer) paidContainer.innerHTML = paidAmensHtml;

  // Options/Pricing
  const optionsHtml = data.options.map(opt => `
    <div style="background:#fff;border:1px solid #e2e8f0;border-left:4px solid #f5a623;padding:24px;border-radius:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:15px;box-shadow:0 8px 16px rgba(0,0,0,0.03);transition:transform 0.3s;">
      <div style="display:flex;align-items:center;gap:16px;">
        <div style="width:44px;height:44px;border-radius:10px;background:#f8fafc;border:1px solid #e2e8f0;color:#262161;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">
          <i class="ti ti-${opt.icon || 'armchair'}"></i>
        </div>
        <div>
          <h4 style="font-size:1.2rem;margin-bottom:4px;color:#0f172a;font-weight:700;">${opt.name}</h4>
          <p style="font-size:0.95rem;color:#64748b;margin:0;">${opt.desc}</p>
        </div>
      </div>
      <div style="text-align:right;margin-left:auto;">
        <div style="font-size:1.4rem;font-weight:900;color:#3D1A8E;">${opt.price}</div>
        <button class="btn-primary" style="padding:10px 20px;font-size:0.9rem;margin-top:10px;" onclick="openLeadModal('${opt.name} at ${data.title}')">Enquire Now</button>
      </div>
    </div>
  `).join('');
  const optContainer = document.getElementById('locDetailOptions');
  if (optContainer) optContainer.innerHTML = optionsHtml;

  // Show page
  if (typeof window.showPage === 'function') window.showPage('loc-detail');
  else if (typeof showPage === 'function') showPage('loc-detail');
  window.scrollTo({top:0, behavior:'smooth'});
};

var closeLocDetail = window.closeLocDetail = function() {
  if (typeof window.showPage === 'function') window.showPage('locations');
  else if (typeof showPage === 'function') showPage('locations');
  window.scrollTo({top:0, behavior:'smooth'});
};


// ==========================================
// 3. MODAL CONTROLS
// ==========================================
window.openLeadModal = function(solution = 'Tour') {
  const modal = document.getElementById('leadModal');
  if (modal) {
    modal.classList.add('active', 'open');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  const select = document.getElementById('modalSolutionSelect');
  if (select && solution) {
    for (let opt of select.options) {
      if (opt.value.toLowerCase().includes(solution.toLowerCase()) || solution.toLowerCase().includes(opt.value.toLowerCase())) {
        select.value = opt.value;
        break;
      }
    }
  }
};

window.closeLeadModal = function(e) {
  if (e && e.target && e.target !== e.currentTarget && !e.target.classList.contains('modal-close')) return;
  const modal = document.getElementById('leadModal');
  if (modal) {
    modal.classList.remove('active', 'open');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
};

window.openEnquireModal = function(spaceName = '') {
  const modal = document.getElementById('enquireModal');
  if (modal) {
    modal.classList.add('active', 'open');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  const typeSelect = document.getElementById('enq-type');
  if (typeSelect && spaceName) {
    for (let opt of typeSelect.options) {
      if (opt.value.toLowerCase().includes(spaceName.toLowerCase())) {
        typeSelect.value = opt.value;
        break;
      }
    }
  }
};

window.closeEnquireModal = function(e) {
  if (e && e.target && e.target !== e.currentTarget && !e.target.classList.contains('modal-close')) return;
  const modal = document.getElementById('enquireModal');
  if (modal) {
    modal.classList.remove('active', 'open');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
};

window.openScheduleModal = function(center = 'MG Road') {
  const modal = document.getElementById('scheduleModal');
  if (modal) {
    modal.classList.add('active', 'open');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  const locSelect = document.getElementById('sch-location');
  if (locSelect && center) {
    for (let opt of locSelect.options) {
      if (opt.value.toLowerCase().includes(center.toLowerCase())) {
        locSelect.value = opt.value;
        break;
      }
    }
  }
  const dateInput = document.getElementById('sch-date');
  if (dateInput && !dateInput.value) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
    dateInput.min = new Date().toISOString().split('T')[0];
  }
};

window.closeScheduleModal = function(e) {
  if (e && e.target && e.target !== e.currentTarget && !e.target.classList.contains('modal-close')) return;
  const modal = document.getElementById('scheduleModal');
  if (modal) {
    modal.classList.remove('active', 'open');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
};

window.openExpertModal = function() {
  const modal = document.getElementById('expertModal');
  if (modal) {
    modal.classList.add('active', 'open');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
};

window.closeExpertModal = function(e) {
  if (e && e.target && e.target !== e.currentTarget && !e.target.classList.contains('modal-close')) return;
  const modal = document.getElementById('expertModal');
  if (modal) {
    modal.classList.remove('active', 'open');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
};

window.openReviewModal = function() {
  const m = document.getElementById('reviewModal');
  if (m) {
    m.classList.add('active', 'open');
    m.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
};

window.closeReviewModal = function(e) {
  if (e && e.target && e.target !== e.currentTarget && !e.target.classList.contains('modal-close')) return;
  const m = document.getElementById('reviewModal');
  if (m) {
    m.classList.remove('active', 'open');
    m.style.display = 'none';
    document.body.style.overflow = '';
  }
};

window.submitReview = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const successEl = document.getElementById('reviewSuccess');
  if (successEl) successEl.style.display = 'block';
  setTimeout(() => {
    closeReviewModal();
    if (successEl) successEl.style.display = 'none';
    if (e.target && e.target.reset) e.target.reset();
  }, 1500);
  return false;
};


// ==========================================
// 4. ROUTING, NAVIGATION & SEO
// ==========================================
const pageSEO = {
  home: {
    title: 'Yayath Spaces | Luxury Coworking & Managed Offices in Gurugram',
    desc: 'Experience premium coworking spaces & Managed Offices in Gurugram at MG Road, Sector 44, Golf Course Road, Sector 32, Udyog Vihar & NH-8.'
  },
  about: {
    title: 'About Us | Yayath Spaces - Elevating Workspaces',
    desc: 'Learn about Yayath Spaces - Gurugrams premier luxury coworking and Managed Offices provider.'
  },
  spaces: {
    title: 'Our Spaces | Hot Desks, Cabins & Enterprise Suites - Yayath',
    desc: 'Explore flexible hot desks, dedicated desks, private cabins, and bespoke enterprise suites in Gurugram.'
  },
  locations: {
    title: 'Locations in Gurugram | MG Road, Sector 44, Golf Course & More',
    desc: 'Find Yayath Spaces coworking centres across prime business hubs in Gurugram with top metro connectivity.'
  },
  'cold-storage': {
    title: 'Cold Storage Solutions | Yayath Spaces',
    desc: 'Temperature-controlled warehousing for perishables, pharma, and sensitive goods across India.'
  },
  '3pl-services': {
    title: '3PL Warehouse Services | Yayath Spaces',
    desc: 'Premium warehouse and 3PL services across India tailored to corporate and nascent needs.'
  },
  'dark-storage': {
    title: 'Dark Storage Spaces | Yayath Spaces',
    desc: 'Cost-effective bulk storage spaces for inventory with specialized handling needs.'
  },
  'loc-detail': {
    title: 'Centre Details | Yayath Spaces Gurugram',
    desc: 'View centre amenities, seating plans, floor plans, and pricing for Yayath Spaces.'
  },
  enterprise: {
    title: 'Managed Offices | Custom Managed Offices - Yayath Spaces',
    desc: 'Custom-built enterprise offices, dedicated team suites, and HQ solutions in Gurugram.'
  },
  virtual: {
    title: 'Virtual Office | GST & Business Registration - Yayath Spaces',
    desc: 'Premium virtual office addresses in Gurugram for company registration and GST compliance.'
  },
  amenities: {
    title: 'World-Class Amenities | Yayath Spaces Gurugram',
    desc: 'High-speed WiFi, artisanal coffee, video conference rooms, ergonomic setups, and 24/7 access.'
  },
  pricing: {
    title: 'Transparent Pricing & Plans | Yayath Spaces Gurugram',
    desc: 'Explore flexible pricing for Hot Desks, Dedicated Desks, Private Cabins, and Custom Suites.'
  },
  gallery: {
    title: 'Workspace Gallery | Yayath Spaces Visual Tour',
    desc: 'Take a virtual photographic tour through our luxurious coworking spaces and modern offices.'
  },
  contact: {
    title: 'Contact Us | Book a Free Tour - Yayath Spaces',
    desc: 'Get in touch with our leasing specialists. Call +91 84489 19797 or visit our Gurugram centres.'
  },
  blog: {
    title: 'Insights & Blog | Future of Work - Yayath Spaces',
    desc: 'Industry insights, workspace trends, startup guides, and enterprise office strategies.'
  }
};

function updateMetaSEO(pageName) {
  const seo = pageSEO[pageName] || pageSEO.home;
  document.title = seo.title;
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = seo.desc;
}

const pageAliases = {
  'spaces': 'coworking',
  'coworking-solutions': 'coworking',
  'enterprise': 'managed',
  'enterprise-solutions': 'managed',
  'virtual': 'virtual-office',
  'meeting': 'meeting-rooms',
  'pricing': 'coworking',
  'desk': 'space-detail'
};

var showPage = window.showPage = function(name, updateUrl = true) {
  if (seoMetaData[name]) updateMetaTags(seoMetaData[name].title, seoMetaData[name].desc);
  name = (name || 'home').toLowerCase().trim();
  if (pageAliases[name]) {
    name = pageAliases[name];
  }
  console.log('showPage resolved to:', name);
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
    page.style.display = 'none';
  });

  const target = document.getElementById('page-' + name);
  if (target) {
    target.classList.add('active');
    target.style.display = 'block';
  } else {
    const home = document.getElementById('page-home');
    if (home) { home.classList.add('active'); home.style.display = 'block'; }
    name = 'home';
  }

  // Update active nav links
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    a.classList.remove('active');
    const href = a.getAttribute('href') || '';
    const onclick = a.getAttribute('onclick') || '';
    if (href === '#' + name || onclick.includes("'" + name + "'")) {
      a.classList.add('active');
    }
  });

  if (updateUrl) {
    history.pushState({ page: name }, '', name === 'home' ? './' : '#' + name);
  }

  updateMetaSEO(name);
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (typeof closeMobile === 'function') closeMobile();
  setTimeout(() => {
    if (typeof initReveal === 'function') initReveal();
  }, 100);
};

function handleUrlRouting() {
  const hash = window.location.hash.replace('#', '').trim();
  if (hash) {
    showPage(hash, false);
  } else {
    showPage('home', false);
  }
}

window.addEventListener('DOMContentLoaded', handleUrlRouting);
window.addEventListener('hashchange', handleUrlRouting);
window.addEventListener('popstate', (e) => {
  if (e.state && e.state.page) {
    showPage(e.state.page, false);
  } else {
    handleUrlRouting();
  }
});


// ==========================================
// MOBILE MENU & TOUCH ACCORDION NAVIGATION
// ==========================================
var toggleMobile = window.toggleMobile = function() {
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileOverlay');
  const hamburger = document.getElementById('hamburger') || document.querySelector('.mobile-toggle');
  
  if (!menu) return;
  const isOpen = menu.classList.contains('open');
  
  if (isOpen) {
    menu.classList.remove('open');
    if (overlay) overlay.classList.remove('active', 'show');
    if (hamburger) hamburger.classList.remove('open', 'active');
    document.body.style.overflow = '';
  } else {
    menu.classList.add('open');
    if (overlay) overlay.classList.add('active', 'show');
    if (hamburger) hamburger.classList.add('open', 'active');
    document.body.style.overflow = 'hidden';
  }
};

var closeMobile = window.closeMobile = function() {
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileOverlay');
  const hamburger = document.getElementById('hamburger') || document.querySelector('.mobile-toggle');
  
  if (menu) menu.classList.remove('open');
  if (overlay) overlay.classList.remove('active', 'show');
  if (hamburger) hamburger.classList.remove('open', 'active');
  document.body.style.overflow = '';
};

var toggleMobAccordion = window.toggleMobAccordion = function(btn) {
  const accordion = btn.closest('.mob-accordion');
  if (!accordion) return;
  
  // Close other open accordions
  document.querySelectorAll('.mob-accordion').forEach(acc => {
    if (acc !== accordion) acc.classList.remove('active');
  });
  
  accordion.classList.toggle('active');
};


// Î“Ã¶Ã‡Î“Ã¶Ã‡ PRELOADER Î“Ã¶Ã‡Î“Ã¶Ã‡
window.addEventListener('load', () => {
  // Trigger hero animations
  document.querySelectorAll('.animate-in').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 150 + 200);
  });
  // Start counters
  startCounters();
  // Create particles
  createParticles();
});

// Î“Ã¶Ã‡Î“Ã¶Ã‡ SCROLL EFFECTS Î“Ã¶Ã‡Î“Ã¶Ã‡
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  const scrollTop = document.getElementById('scrollTop');
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
  if (scrollTop) scrollTop.classList.toggle('show', window.scrollY > 400);
  // Parallax
  handleParallax();
  // Reveal
  initReveal();
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Î“Ã¶Ã‡Î“Ã¶Ã‡ PARALLAX Î“Ã¶Ã‡Î“Ã¶Ã‡
function handleParallax() {
  // CSS handles parallax with background-attachment: fixed;
}

// Î“Ã¶Ã‡Î“Ã¶Ã‡ REVEAL ON SCROLL Î“Ã¶Ã‡Î“Ã¶Ã‡
function initReveal() {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      const delay = el.style.getPropertyValue('--delay') || '0s';
      const ms = parseFloat(delay) * 1000;
      setTimeout(() => el.classList.add('visible'), ms);
    }
  });
}
// Initial reveal call
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initReveal, 100);
  initReveal();
});

// Î“Ã¶Ã‡Î“Ã¶Ã‡ COUNTER ANIMATION Î“Ã¶Ã‡Î“Ã¶Ã‡
function startCounters() {
  document.querySelectorAll('.hstat-num').forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current) + (el.dataset.count === '99' ? '%' : '+');
    }, 25);
  });
}

// Î“Ã¶Ã‡Î“Ã¶Ã‡ FLOATING PARTICLES Î“Ã¶Ã‡Î“Ã¶Ã‡
function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 12 + 4;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 8}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;
    container.appendChild(p);
  }
}

// Î“Ã¶Ã‡Î“Ã¶Ã‡ FILTER: SPACES Î“Ã¶Ã‡Î“Ã¶Ã‡
function filterSpaces(btn, type) {
  document.querySelectorAll('.spaces-filter-bar .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.space-full-card').forEach(card => {
    const show = type === 'all' || card.dataset.space === type;
    card.style.display = show ? 'grid' : 'none';
    if (show) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'all 0.4s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 50);
    }
  });
}

// Î“Ã¶Ã‡Î“Ã¶Ã‡ FILTER: GALLERY Î“Ã¶Ã‡Î“Ã¶Ã‡
function filterGallery(btn, cat) {
  document.querySelectorAll('.gallery-filter .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.gallery-item').forEach((item, i) => {
    const show = cat === 'all' || item.dataset.cat === cat;
    item.style.display = show ? 'block' : 'none';
    if (show) {
      item.style.opacity = '0';
      setTimeout(() => {
        item.style.transition = 'opacity 0.4s ease';
        item.style.opacity = '1';
      }, i * 60);
    }
  });
}

// Î“Ã¶Ã‡Î“Ã¶Ã‡ LIGHTBOX Î“Ã¶Ã‡Î“Ã¶Ã‡
let lightboxIdx = 0;
const lightboxClasses = ['g-img-1', 'g-img-2', 'g-img-3', 'g-img-4', 'g-img-5', 'g-img-6', 'g-img-7', 'g-img-8', 'g-img-9', 'g-img-10', 'g-img-11', 'g-img-12', 'g-img-13', 'g-img-14', 'g-img-15', 'g-img-16'];
function openLightbox(idx) {
  lightboxIdx = idx;
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  if (!lb || !img) return;
  img.className = 'lightbox-img ' + lightboxClasses[idx];
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
function lightboxNav(dir) {
  lightboxIdx = (lightboxIdx + dir + lightboxClasses.length) % lightboxClasses.length;
  const img = document.getElementById('lightboxImg');
  if (img) {
    img.style.opacity = '0';
    setTimeout(() => {
      img.className = 'lightbox-img ' + lightboxClasses[lightboxIdx];
      img.style.transition = 'opacity 0.3s';
      img.style.opacity = '1';
    }, 150);
  }
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lightboxNav(-1);
  if (e.key === 'ArrowRight') lightboxNav(1);
});

// Î“Ã¶Ã‡Î“Ã¶Ã‡ BILLING TOGGLE Î“Ã¶Ã‡Î“Ã¶Ã‡
let isAnnual = false;
function toggleBilling() {
  isAnnual = !isAnnual;
  const toggle = document.getElementById('billingToggle');
  const monthLabel = document.getElementById('monthly-label');
  const annualLabel = document.getElementById('annual-label');
  if (toggle) toggle.classList.toggle('active', isAnnual);
  if (monthLabel) monthLabel.classList.toggle('active-label', !isAnnual);
  if (annualLabel) annualLabel.classList.toggle('active-label', isAnnual);

  document.querySelectorAll('.price-val').forEach(el => {
    const monthly = parseInt(el.dataset.monthly);
    const annual = parseInt(el.dataset.annual);
    const val = isAnnual ? annual : monthly;
    if (!isNaN(val)) {
      const formatted = val >= 1000 ? 'Rs.' + (val/1000).toFixed(val % 1000 === 0 ? 0 : 2) + ',000' : 'Rs.' + val;
      el.textContent = isAnnual ? ('Rs.' + val.toLocaleString('en-IN')) : ('Rs.' + val.toLocaleString('en-IN'));
      // simple approach
      el.textContent = 'Rs.' + val.toLocaleString('en-IN');
    }
  });
}

// Î“Ã¶Ã‡Î“Ã¶Ã‡ FORM SUBMIT: LEAD Î“Ã¶Ã‡Î“Ã¶Ã‡


// Î“Ã¶Ã‡Î“Ã¶Ã‡ SPACE DETAILS PAGE Î“Ã¶Ã‡Î“Ã¶Ã‡
const spaceData = {
  'desk': {
    title: 'Flexible <span class="gradient-text">Hot Desk</span>',
    tag: 'Hot Desk',
    breadcrumb: 'Hot Desk',
    subtitle: 'About Yayath Spaces - Hot Desk',
    desc: 'Perfect for freelancers and remote workers who need a professional workspace without commitment. Come in, find a desk, and get to work immediately. Enjoy high-speed internet, premium coffee, and a vibrant community of professionals.',
    price: '<strong>₹4,999</strong> / seat / seat',
    bg: 'assets/images/spaces/DSC01092.JPG'
  },
  'dedicated': {
    title: 'Dedicated <span class="gradient-text">Desk</span>',
    tag: 'Dedicated Desk',
    breadcrumb: 'Dedicated Desk',
    subtitle: 'About Yayath Spaces - Dedicated Desk',
    desc: 'Your permanent desk, your storage, your space. Come every day knowing exactly where you will be. Ideal for individuals who want a consistent work environment within a shared community, complete with secure pedestal storage.',
    price: '<strong>₹6,999</strong> / seat / seat',
    bg: 'assets/images/spaces/DSC01094.JPG'
  },
  'cabin': {
    title: 'Private <span class="gradient-text">Cabin</span>',
    tag: 'Private Cabin',
    breadcrumb: 'Private Cabin',
    subtitle: 'About Yayath Spaces - Private Cabin',
    desc: 'A fully enclosed private office for 1-4 people. Glass walls, branded door and complete privacy. Gives your team the focus they need while still having access to the shared amenities and networking events.',
    price: '<strong>₹14,999</strong> / cabin / seat',
    bg: 'assets/images/spaces/DSC01094.JPG'
  },
};

function togglePropReadMore(btn, moreId) {
  var moreText = document.getElementById(moreId);
  if (moreText.style.display === 'none') {
    moreText.style.display = 'inline';
    btn.innerHTML = 'Read Less <i class="ti ti-chevron-up"></i>';
  } else {
    moreText.style.display = 'none';
    btn.innerHTML = 'Read More <i class="ti ti-chevron-down"></i>';
  }
}

// Dynamic Blog Fetching
let allBlogs = [];

const supabaseUrl = 'https://fwyrrabbnrqgkhvazxnq.supabase.co';
const supabaseKey = 'sb_publishable_F6sv1y2f38PXGcVdkSVdGw_EXoadkIh';
const _supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

async function loadBlogs() {
  try {
    const { data, error } = await _supabase.from('blogs').select('*').order('date', { ascending: false });
    if (error) throw error;
    allBlogs = data.map(b => ({
      id: b.id,
      title: b.title,
      category: b.category,
      date: b.date,
      readTime: b.readtime,
      isFeatured: b.isfeatured,
      excerpt: b.excerpt,
      image: b.image,
      image_alt: b.image_alt,
      content: b.content,
      authorName: b.authorname,
      authorRole: b.authorrole,
      authorImg: b.authorimg
    }));
    renderBlogs();
  } catch (err) {
    console.error('Error loading blogs from Supabase:', err);
  }
}

function renderBlogs() {
  const grid = document.getElementById('dynamic-blog-grid');
  const featuredContainer = document.getElementById('dynamic-featured-blog');
  
  if (!grid || !featuredContainer) return;
  
  grid.innerHTML = '';
  featuredContainer.innerHTML = '';

  const featuredBlog = allBlogs.find(b => b.isFeatured) || allBlogs[0];
  const standardBlogs = allBlogs.filter(b => b.id !== (featuredBlog ? featuredBlog.id : null));

  // Render Featured Blog
  if (featuredBlog) {
    featuredContainer.innerHTML = `
      <div class="pro-blog-featured reveal" onclick="openBlog('${featuredBlog.id}')">
        <div class="pro-blog-featured-img" style="background-image: url('${featuredBlog.image}');" role="img" aria-label="${featuredBlog.image_alt || featuredBlog.title}"></div>
        <div class="pro-blog-featured-body">
          <div class="blog-meta">
            <span class="blog-tag" style="background: var(--gold); color: white;">${featuredBlog.category}</span>
            <span class="blog-date">${featuredBlog.date}</span>
          </div>
          <h2>${featuredBlog.title}</h2>
          <p>${featuredBlog.excerpt}</p>
          <div class="pro-blog-author">
            <div class="pro-blog-author-img">${featuredBlog.authorImg}</div>
            <div class="pro-blog-author-info">
              <span class="pro-blog-author-name">${featuredBlog.authorName}</span>
              <span class="pro-blog-author-role">${featuredBlog.authorRole}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Render Standard Blogs
  standardBlogs.forEach(blog => {
    grid.innerHTML += `
      <div class="pro-blog-card reveal" onclick="openBlog('${blog.id}')">
        <div class="pro-blog-img-wrap"><div class="pro-blog-img" style="background-image: url('${blog.image}');" role="img" aria-label="${blog.image_alt || blog.title}"></div></div>
        <div class="pro-blog-body">
          <div class="blog-meta"><span class="blog-tag">${blog.category}</span><span class="blog-date">${blog.date}</span></div>
          <h3>${blog.title}</h3>
          <p>${blog.excerpt}</p>
          <div class="pro-blog-author">
            <div class="pro-blog-author-img">${blog.authorImg}</div>
            <div class="pro-blog-author-info">
              <span class="pro-blog-author-name">${blog.authorName}</span>
              <span class="pro-blog-author-role">${blog.authorRole}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

function openBlog(id) {
  const blog = allBlogs.find(b => b.id === id);
  if (!blog) return;

  document.getElementById('single-blog-category').textContent = blog.category;
  document.getElementById('single-blog-title').textContent = blog.title;
  document.getElementById('single-blog-breadcrumb').textContent = blog.title;
  document.getElementById('single-blog-author-img').innerHTML = blog.authorImg;
  document.getElementById('single-blog-author-name').textContent = blog.authorName;
  document.getElementById('single-blog-date').textContent = blog.date;
  document.getElementById('single-blog-content').innerHTML = blog.content;
  document.getElementById('single-blog-hero-bg').style.backgroundImage = `url('${blog.image}')`;
  document.getElementById('single-blog-hero-bg').setAttribute('aria-label', blog.image_alt || blog.title);
  document.getElementById('single-blog-hero-bg').setAttribute('role', 'img');
  document.getElementById('single-blog-hero-bg').setAttribute('aria-label', blog.image_alt || blog.title);
  document.getElementById('single-blog-hero-bg').setAttribute('role', 'img');

  showPage('blog-single');
  window.scrollTo(0, 0);
}

// Call loadBlogs on startup
document.addEventListener('DOMContentLoaded', loadBlogs);



window.toggleFaq = function(element) {
  const allFaqs = document.querySelectorAll('.faq-item');
  const isActive = element.classList.contains('active');
  
  // Close all FAQs first
  allFaqs.forEach(faq => faq.classList.remove('active'));
  
  // If it wasn't active, open it
  if (!isActive) {
    element.classList.add('active');
  }
};

// === REVIEW MODAL LOGIC ===
window.openReviewModal = function() {
  document.getElementById('reviewModal').classList.add('active');
};

window.closeReviewModal = function() {
  document.getElementById('reviewModal').classList.remove('active');
  // Reset form
  document.getElementById('reviewForm').style.display = 'block';
  document.getElementById('reviewSuccess').style.display = 'none';
  document.getElementById('reviewForm').reset();
  document.querySelectorAll('.rating-star').forEach(s => s.classList.remove('active'));
  document.getElementById('reviewRating').value = '';
};

// Star Rating Interaction
document.querySelectorAll('.rating-star').forEach(star => {
  star.addEventListener('click', function() {
    const val = this.getAttribute('data-value');
    document.getElementById('reviewRating').value = val;
    document.getElementById('ratingError').style.display = 'none';
    document.querySelectorAll('.rating-star').forEach(s => {
      if(s.getAttribute('data-value') <= val) {
        s.classList.remove('ti-star');
        s.classList.add('ti-star-filled');
        s.classList.add('active');
      } else {
        s.classList.add('ti-star');
        s.classList.remove('ti-star-filled');
        s.classList.remove('active');
      }
    });
  });
});

window.submitReview = function(e) {
  e.preventDefault();
  const rating = document.getElementById('reviewRating').value;
  if(!rating) {
    document.getElementById('ratingError').style.display = 'block';
    return;
  }
  
  // Get Form Values
  const nameInput = document.getElementById('reviewName').value;
  const companyInput = document.getElementById('reviewCompany').value;
  const textInput = document.getElementById('reviewText').value;
  
  // Generate Avatar Initials
  const initials = nameInput.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
  
  // Generate Stars HTML
  let starsHtml = '';
  for(let i=0; i<5; i++) {
      if(i < parseInt(rating)) starsHtml += '<i class="ti ti-star-filled"></i>';
      else starsHtml += '<i class="ti ti-star"></i>';
  }
  
  // Construct Review HTML
  const newReviewHtml = `
    <div class="review-card" style="animation: fadeIn 0.5s ease;">
      <div class="review-card-head">
        <div class="reviewer-avatar" style="background: var(--gold); color: var(--gray-900);">${initials}</div>
        <div class="reviewer-info">
          <h4>${nameInput}</h4>
          ${companyInput ? `<p>${companyInput}</p>` : ''}
        </div>
      </div>
      <div class="review-stars">
        ${starsHtml}
      </div>
      <p class="review-text">"${textInput}"</p>
    </div>
  `;
  
  // Add to Grid
  const grid = document.querySelector('.reviews-grid');
  if(grid) {
      grid.insertAdjacentHTML('afterbegin', newReviewHtml);
  }
  
  // Show Success
  const form = document.getElementById('reviewForm');
  const successMsg = document.getElementById('reviewSuccess');
  
  if(form && successMsg) {
      form.style.display = 'none';
      successMsg.style.display = 'flex';
      successMsg.style.flexDirection = 'column';
      successMsg.style.alignItems = 'center';
      successMsg.style.justifyContent = 'center';
  }
};

// Sticky bar dismiss logic
// Sticky Booking Bar Logic (10 min delay & localStorage dismissal)
// === STICKY BOOKING BAR (10 MIN TIMER + PERMANENT DISMISS) ===
let canShowBookingPopup = false;

function checkIsDismissed() {
  return localStorage.getItem('bookingPopupDismissed') === 'true' || 
         sessionStorage.getItem('bookingPopupDismissed') === 'true';
}

if (!checkIsDismissed()) {
  // 4-minute timer (600,000 ms)
  setTimeout(() => {
    canShowBookingPopup = true;
    const bar = document.getElementById('stickyBookingBar');
    if (bar && window.scrollY > 300 && !checkIsDismissed()) {
      bar.classList.add('visible');
    }
  }, 240000);
} else {
  // If already dismissed, ensure bar is hidden
  const bar = document.getElementById('stickyBookingBar');
  if (bar) bar.style.display = 'none';
}

window.addEventListener('scroll', () => {
  const bar = document.getElementById('stickyBookingBar');
  if (!bar) return;
  
  if (checkIsDismissed()) {
    bar.classList.remove('visible');
    bar.style.display = 'none';
    return;
  }
  
  if (window.scrollY > 300 && canShowBookingPopup) {
    bar.classList.add('visible');
  } else {
    bar.classList.remove('visible');
  }
});

window.closeStickyBar = window.dismissStickyBar = function(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  const bar = document.getElementById('stickyBookingBar');
  if (bar) {
    bar.classList.remove('visible');
    bar.style.display = 'none';
  }
  localStorage.setItem('bookingPopupDismissed', 'true');
  sessionStorage.setItem('bookingPopupDismissed', 'true');
};

window.setRating = function(val) {
  document.getElementById('reviewRating').value = val;
  document.getElementById('ratingError').style.display = 'none';
  document.querySelectorAll('.rating-star').forEach(s => {
    if(parseInt(s.getAttribute('data-value')) <= parseInt(val)) {
      s.classList.remove('ti-star');
      s.classList.add('ti-star-filled');
      s.classList.add('active');
    } else {
      s.classList.add('ti-star');
      s.classList.remove('ti-star-filled');
      s.classList.remove('active');
    }
  });
};

function toggleAmAccordion(el) {
  const isOpen = el.classList.contains('am-open');
  // Close all open items
  document.querySelectorAll('.am-accordion-item.am-open').forEach(item => item.classList.remove('am-open'));
  // Toggle clicked
  if (!isOpen) el.classList.add('am-open');
}

// --- Hero Slider Logic ---
let currentSlideIdx = 0;
let slideInterval;
const slides = document.querySelectorAll('.sk-slide');
const dotsContainer = document.getElementById('sliderDots');

function initSlider() {
  if (!slides.length) return;
  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = sk-dot ;
    dot.onclick = () => goToSlide(i);
    if(dotsContainer) dotsContainer.appendChild(dot);
  });
  updateSliderContent(0);
  startSlideInterval();
}

function updateSliderContent(idx) {
  const slide = slides[idx];
  if(!slide) return;
  
  document.querySelectorAll('.sk-slide').forEach(s => s.classList.remove('active'));
  slide.classList.add('active');
  
  if (dotsContainer) {
    document.querySelectorAll('.sk-dot').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
  }
}

function changeSlide(dir) {
  currentSlideIdx = (currentSlideIdx + dir + slides.length) % slides.length;
  updateSliderContent(currentSlideIdx);
  resetSlideInterval();
}

function goToSlide(idx) {
  currentSlideIdx = idx;
  updateSliderContent(currentSlideIdx);
  resetSlideInterval();
}

function startSlideInterval() {
  slideInterval = setInterval(() => changeSlide(1), 5000);
}

function resetSlideInterval() {
  clearInterval(slideInterval);
  startSlideInterval();
}

document.addEventListener('DOMContentLoaded', () => {
  initSlider();
});


// ==========================================
// SHARED NAVIGATION DATA SOURCE (Desktop & Mobile)
// ==========================================
window.NAV_MENU_CONFIG = [
  { id: 'home', label: 'Home', link: '#home', page: 'home', icon: 'ti-home' },
  {
    id: 'about',
    label: 'About',
    icon: 'ti-info-circle',
    dropdown: [
      { label: 'About Us', link: '#about', page: 'about', icon: 'ti-info-circle' },
      { label: 'Gallery', link: '#gallery', page: 'gallery', icon: 'ti-photo' }
    ]
  },
  {
    id: 'spaces',
    label: 'Our Spaces',
    icon: 'ti-layout-grid',
    dropdown: [
      { label: 'Our Commercial Space', link: '#commercial-spaces', page: 'commercial-spaces', icon: 'ti-building-skyscraper' },
      { label: 'Retail Spaces', link: '#retail-spaces', page: 'retail-spaces', icon: 'ti-shopping-cart' },
      { label: 'Coworking Spaces', link: '#coworking-spaces', page: 'coworking-spaces', icon: 'ti-armchair' },
      { label: 'Managed Offices', link: '#managed-offices', page: 'managed-offices', icon: 'ti-building' },
      {
        label: 'Mobility',
        icon: 'ti-car',
        isNested: true,
        nested: [
          { label: 'Meeting Rooms', link: '#meeting-rooms', page: 'meeting-rooms', icon: 'ti-users' },
          { label: 'Daypass', link: '#daypass', page: 'daypass', icon: 'ti-ticket' },
          { label: 'Virtual Office', link: '#virtual-office', page: 'virtual-office', icon: 'ti-briefcase' }
        ]
      },
      {
        label: 'Warehouse',
        icon: 'ti-package',
        isNested: true,
        nested: [
          { label: '3PL Services', link: '#3pl-services', page: '3pl-services', icon: 'ti-truck-delivery' },
          { label: 'Dark Store', link: '#dark-storage', page: 'dark-storage', icon: 'ti-box' },
          { label: 'Cold Storage', link: '#cold-storage', page: 'cold-storage', icon: 'ti-snowflake' }
        ]
      }
    ]
  },
  { id: 'locations', label: 'Locations', link: '#locations', page: 'locations', icon: 'ti-map-pin' },
  { id: 'amenities', label: 'Amenities', link: '#amenities', page: 'amenities', icon: 'ti-sparkles' },
  { id: 'blog', label: 'Blog', link: '#blog', page: 'blog', icon: 'ti-article' },
  { id: 'contact', label: 'Contact', link: '#contact', page: 'contact', icon: 'ti-phone' }
];

window.renderNavigationMenus = function() {
  const desktopNav = document.getElementById('navLinks');
  const mobileInner = document.getElementById('mobileMenuInner');
  
  if (desktopNav) {
    desktopNav.innerHTML = window.NAV_MENU_CONFIG.map(item => {
      if (!item.dropdown) {
        return `<li><a class="nav-link" data-page="${item.page}" href="${item.link}" onclick="showPage('${item.page}')">${item.label}</a></li>`;
      }
      const dropItems = item.dropdown.map(drop => {
        if (!drop.isNested) {
          return `<a href="${drop.link}" onclick="showPage('${drop.page}')"><i class="ti ${drop.icon}"></i> ${drop.label}</a>`;
        }
        const nestedItems = drop.nested.map(nest => `<a href="${nest.link}" onclick="showPage('${nest.page}')"><i class="ti ${nest.icon}"></i> ${nest.label}</a>`).join('');
        return `<div class="has-nested-dropdown" style="position: relative;">
          <a style="justify-content: space-between;"><div style="display:flex;align-items:center;gap:10px;"><i class="ti ${drop.icon}"></i> ${drop.label}</div> <i class="ti ti-chevron-right" style="color:var(--gray-800);font-size:12px;"></i></a>
          <div class="nested-dropdown-menu">
            ${nestedItems}
          </div>
        </div>`;
      }).join('\n          ');

      return `<li class="has-dropdown">
        <a class="nav-link" data-page="${item.id}" style="cursor: pointer;">${item.label} <i class="ti ti-chevron-down"></i></a>
        <div class="dropdown-menu">
          ${dropItems}
        </div>
      </li>`;
    }).join('\n      ');
  }

  if (mobileInner) {
    const mobileLinksHtml = window.NAV_MENU_CONFIG.map(item => {
      if (!item.dropdown) {
        return `<a href="${item.link}" onclick="showPage('${item.page}');closeMobile();" class="mob-nav-item"><i class="ti ${item.icon}"></i> ${item.label}</a>`;
      }
      const subItems = item.dropdown.map(drop => {
        if (!drop.isNested) {
          return `<a href="${drop.link}" onclick="showPage('${drop.page}');closeMobile();"><i class="ti ${drop.icon}"></i> ${drop.label}</a>`;
        }
        const nestedSub = drop.nested.map(nest => `<a href="${nest.link}" onclick="showPage('${nest.page}');closeMobile();" style="padding-left:28px;"><i class="ti ${nest.icon}"></i> ${nest.label}</a>`).join('\n        ');
        return `<div class="mob-nested-section">
          <div class="mob-nested-title" style="padding: 8px 14px; font-size: 0.82rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;"><i class="ti ${drop.icon}"></i> ${drop.label}</div>
          ${nestedSub}
        </div>`;
      }).join('\n        ');

      return `<div class="mob-accordion">
        <button class="mob-accordion-btn" onclick="toggleMobAccordion(this)">
          <span><i class="ti ${item.icon}"></i> ${item.label}</span>
          <i class="ti ti-chevron-down mob-chevron"></i>
        </button>
        <div class="mob-accordion-content">
          ${subItems}
        </div>
      </div>`;
    }).join('\n    ');

    mobileInner.innerHTML = `${mobileLinksHtml}
    <div class="mobile-cta-wrap">
      <button class="mobile-cta btn-primary" onclick="openLeadModal('Tour');closeMobile();"><i class="ti ti-calendar-event"></i> Book a Tour</button>
      <a href="tel:+918448919797" class="mobile-call-cta"><i class="ti ti-phone-call"></i> Call +91 84489 19797</a>
    </div>`;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (typeof renderNavigationMenus === 'function') renderNavigationMenus();
});


// --- New Form Submit Handlers ---
window.submitRetailForm = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const name = document.getElementById('retail-name')?.value?.trim() || '';
  const email = document.getElementById('retail-email')?.value?.trim() || '';
  const phone = document.getElementById('retail-phone')?.value?.trim() || '';
  const company = document.getElementById('retail-company')?.value?.trim() || 'Not Specified';
  const type = document.getElementById('retail-type')?.value || 'Retail Space';
  const location = document.getElementById('retail-location')?.value?.trim() || 'Gurugram';
  const budget = document.getElementById('retail-budget')?.value?.trim() || '';
  const notes = document.getElementById('retail-notes')?.value?.trim() || '';

  if (!name || name.length < 2) { alert('Please enter your name.'); return false; }
  if (!phone || phone.length < 10 || !/^\d+$/.test(phone)) { alert('Please enter a valid phone number (digits only).'); return false; }

  const btn = e.target ? e.target.querySelector('button[type="submit"]') : null;
  const oldText = btn ? btn.innerHTML : 'Submit';
  if (btn) { btn.innerHTML = '<i class="ti ti-loader animate-spin"></i> Submitting...'; btn.disabled = true; }

  pushLeadToCRM({
    name: name,
    phone: phone,
    email: email,
    company: company,
    solution: 'Retail Space - ' + type,
    location: location,
    budget: budget,
    source: 'Retail Spaces Page',
    notes: notes
  });

  setTimeout(() => {
    alert('Thank you for your enquiry. Our retail leasing experts will get back to you shortly.');
    if (e.target && e.target.reset) e.target.reset();
    if (btn) { btn.innerHTML = oldText; btn.disabled = false; }
  }, 800);
  return false;
};

window.submitWarehouseForm = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const name = document.getElementById('warehouse-name')?.value?.trim() || '';
  const email = document.getElementById('warehouse-email')?.value?.trim() || '';
  const phone = document.getElementById('warehouse-phone')?.value?.trim() || '';
  const company = document.getElementById('warehouse-company')?.value?.trim() || 'Not Specified';
  const type = document.getElementById('warehouse-type')?.value || 'Warehouse Services';
  const location = document.getElementById('warehouse-location')?.value?.trim() || 'Gurugram';
  const budget = document.getElementById('warehouse-budget')?.value?.trim() || '';
  const notes = document.getElementById('warehouse-notes')?.value?.trim() || '';

  if (!name || name.length < 2) { alert('Please enter your name.'); return false; }
  if (!phone || phone.length < 10 || !/^\d+$/.test(phone)) { alert('Please enter a valid phone number (digits only).'); return false; }

  const btn = e.target ? e.target.querySelector('button[type="submit"]') : null;
  const oldText = btn ? btn.innerHTML : 'Submit';
  if (btn) { btn.innerHTML = '<i class="ti ti-loader animate-spin"></i> Submitting...'; btn.disabled = true; }

  pushLeadToCRM({
    name: name,
    phone: phone,
    email: email,
    company: company,
    solution: type,
    location: location,
    budget: budget,
    source: 'Warehouse Showcase Page',
    notes: notes
  });

  setTimeout(() => {
    alert('Thank you for your enquiry. Our logistics experts will get back to you shortly.');
    if (e.target && e.target.reset) e.target.reset();
    if (btn) { btn.innerHTML = oldText; btn.disabled = false; }
  }, 800);
  return false;
};

window.submit3PLForm = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const name = document.getElementById('tpl-name')?.value?.trim() || '';
  const email = document.getElementById('tpl-email')?.value?.trim() || '';
  const phone = document.getElementById('tpl-phone')?.value?.trim() || '';
  const company = document.getElementById('tpl-company')?.value?.trim() || 'Not Specified';
  const address = document.getElementById('tpl-address')?.value?.trim() || '';
  const budget = document.getElementById('tpl-budget')?.value?.trim() || '';
  const message = document.getElementById('tpl-message')?.value?.trim() || '';

  if (!name || name.length < 2) { alert('Please enter your name.'); return false; }
  if (!phone || phone.length < 10) { alert('Please enter a valid phone number.'); return false; }

  const btn = e.target ? e.target.querySelector('button[type="submit"]') : null;
  const oldText = btn ? btn.innerHTML : 'Submit';
  if (btn) { btn.innerHTML = '<i class="ti ti-loader animate-spin"></i> Submitting...'; btn.disabled = true; }

  let details = [];
  if (address) details.push(`• Address: ${address}`);
  if (budget) details.push(`• Budget: ${budget}`);
  if (message) details.push(`• Message: ${message}`);
  const finalNotes = details.join('\n');

  pushLeadToCRM({
    name: name,
    phone: phone,
    email: email,
    company: company,
    solution: '3PL Warehousing',
    location: address || 'Gurugram',
    source: '3PL Services Page',
    notes: finalNotes,
    budget: budget
  });

  setTimeout(() => {
    alert('Thank you for your enquiry. Our logistics experts will get back to you shortly.');
    if (e.target && e.target.reset) e.target.reset();
    if (btn) { btn.innerHTML = oldText; btn.disabled = false; }
  }, 800);
  return false;
};

window.submitDarkStoreForm = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const name = document.getElementById('dark-name')?.value?.trim() || '';
  const email = document.getElementById('dark-email')?.value?.trim() || '';
  const phone = document.getElementById('dark-phone')?.value?.trim() || '';
  const company = document.getElementById('dark-company')?.value?.trim() || 'Not Specified';
  const city = document.getElementById('dark-city')?.value?.trim() || '';
  const budget = document.getElementById('dark-budget')?.value?.trim() || '';
  const cold = document.getElementById('dark-cold')?.value?.trim() || '';

  if (!name || name.length < 2) { alert('Please enter your name.'); return false; }
  if (!phone || phone.length < 10) { alert('Please enter a valid phone number.'); return false; }

  const btn = e.target ? e.target.querySelector('button[type="submit"]') : null;
  const oldText = btn ? btn.innerHTML : 'Submit';
  if (btn) { btn.innerHTML = '<i class="ti ti-loader animate-spin"></i> Submitting...'; btn.disabled = true; }

  let details = [];
  if (city) details.push(`• Address: ${city}`);
  if (budget) details.push(`• Budget: ${budget}`);
  if (cold) details.push(`• Message: ${cold}`);
  const finalNotes = details.join('\n');

  pushLeadToCRM({
    name: name,
    phone: phone,
    email: email,
    company: company,
    solution: 'Dark Store',
    location: city || 'Gurugram',
    source: 'Dark Store Page',
    notes: finalNotes,
    budget: budget
  });

  setTimeout(() => {
    alert('Thank you for your enquiry. Our fulfillment experts will get back to you shortly.');
    if (e.target && e.target.reset) e.target.reset();
    if (btn) { btn.innerHTML = oldText; btn.disabled = false; }
  }, 800);
  return false;
};

window.submitColdStorageForm = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const name = document.getElementById('cs-name')?.value?.trim() || '';
  const email = document.getElementById('cs-email')?.value?.trim() || '';
  const phone = document.getElementById('cs-phone')?.value?.trim() || '';
  const company = document.getElementById('cs-company')?.value?.trim() || 'Not Specified';
  const address = document.getElementById('cs-address')?.value?.trim() || '';
  const budget = document.getElementById('cs-budget')?.value?.trim() || '';
  const message = document.getElementById('cs-message')?.value?.trim() || '';

  if (!name || name.length < 2) { alert('Please enter your name.'); return false; }
  if (!phone || phone.length < 10) { alert('Please enter a valid phone number.'); return false; }

  const btn = e.target ? e.target.querySelector('button[type="submit"]') : null;
  const oldText = btn ? btn.innerHTML : 'Submit';
  if (btn) { btn.innerHTML = '<i class="ti ti-loader animate-spin"></i> Submitting...'; btn.disabled = true; }

  let details = [];
  if (address) details.push(`• Address: ${address}`);
  if (budget) details.push(`• Budget: ${budget}`);
  if (message) details.push(`• Message: ${message}`);
  const finalNotes = details.join('\n');

  pushLeadToCRM({
    name: name,
    phone: phone,
    email: email,
    company: company,
    solution: 'Cold Storage',
    location: address || 'Gurugram',
    source: 'Cold Storage Page',
    notes: finalNotes,
    budget: budget
  });

  setTimeout(() => {
    alert('Thank you for your enquiry. Our cold chain experts will get back to you shortly.');
    if (e.target && e.target.reset) e.target.reset();
    if (btn) { btn.innerHTML = oldText; btn.disabled = false; }
  }, 800);
  return false;
};
