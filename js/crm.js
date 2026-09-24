document.addEventListener('DOMContentLoaded', () => {
  const fbDbUrl = 'https://yayath-crm-live-default-rtdb.asia-southeast1.firebasedatabase.app/leads';
  
  let allLeads = [];

  function fetchLeads() {
    const refreshBtn = document.getElementById('refreshBtn');
    if(refreshBtn) refreshBtn.classList.add('refreshing');

    fetch('https://ntfy.sh/yayath_spaces_crm_leads_live_prod_2026/json?poll=1')
      .then(res => res.text())
      .then(text => {
        const leadsMap = {};
        const lines = text.trim().split('\n');
        lines.forEach(line => {
          try {
            if(!line) return;
            const obj = JSON.parse(line);
            if (obj.event === 'message' && obj.message) {
              const lead = JSON.parse(obj.message);
              if (lead && lead.id) leadsMap[lead.id] = lead;
            }
          } catch(e) {}
        });

        return fetch('https://yayath-crm.vercel.app/api/leads')
          .then(r => r.json())
          .then(data => {
            if (data && data.leads) {
              data.leads.forEach(lead => {
                if (lead && lead.id) leadsMap[lead.id] = lead;
              });
            }
            return leadsMap;
          })
          .catch(() => leadsMap);
      })
      .then(leadsMap => {
        const leadsArray = Object.values(leadsMap).sort((a, b) => b.timestamp - a.timestamp);
        allLeads = leadsArray;
        updateMetrics(leadsArray);
        renderTable(leadsArray);
        if(refreshBtn) refreshBtn.classList.remove('refreshing');
      })
      .catch(err => {
        console.error('Error fetching leads:', err);
        document.getElementById('leadsBody').innerHTML = '<tr><td colspan="8" style="text-align:center;color:red;">Error loading leads.</td></tr>';
        if(refreshBtn) refreshBtn.classList.remove('refreshing');
      });
  }

  function updateMetrics(leads) {
    if(document.getElementById('totalLeads')) document.getElementById('totalLeads').textContent = leads.length;
    
    // New today
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    const newLeads = leads.filter(l => l.timestamp > oneDayAgo).length;
    if(document.getElementById('newLeads')) document.getElementById('newLeads').textContent = newLeads;
    
    // Top location
    if (leads.length > 0) {
      const locCounts = {};
      leads.forEach(l => {
        const loc = l.location || 'Gurugram';
        locCounts[loc] = (locCounts[loc] || 0) + 1;
      });
      const topLoc = Object.keys(locCounts).reduce((a, b) => locCounts[a] > locCounts[b] ? a : b);
      if(document.getElementById('topLocation')) document.getElementById('topLocation').textContent = topLoc;
    }
  }

  window.changeStage = function(selectEl, leadId) {
    const val = selectEl.value;
    selectEl.className = 'stage-select';
    if(val === 'New') selectEl.classList.add('stage-new');
    if(val === 'In Progress') selectEl.classList.add('stage-progress');
    if(val === 'Won') selectEl.classList.add('stage-won');
    if(val === 'Lost') selectEl.classList.add('stage-lost');
  };

  function renderTable(leads) {
    const tbody = document.getElementById('leadsBody');
    if(!tbody) return;
    
    if(document.getElementById('showingText')) {
      document.getElementById('showingText').textContent = `Showing ${leads.length} of ${allLeads.length} leads`;
    }

    if (leads.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px;color:#64748B;">No leads found.</td></tr>';
      return;
    }
    
    tbody.innerHTML = leads.map(lead => {
      const date = new Date(lead.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'numeric', year: 'numeric' });
      const time = new Date(lead.timestamp).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }).toLowerCase();
      const isNew = (Date.now() - lead.timestamp) < (2 * 60 * 60 * 1000); // 2 hours
      const phoneNum = lead.phone ? lead.phone.replace(/[^0-9]/g, '') : '';
      
      const loc = lead.location || 'Gurugram';
      const sol = lead.solution || 'General';
      const comp = (lead.company && lead.company !== 'Not Specified') ? lead.company : 'Individual';

      let notesHtml = `<div class="notes-box" title="${lead.notes || 'No notes'}">${lead.notes || 'No extra notes provided.'}</div>`;
      if (lead.budget) {
        notesHtml += `<div style="margin-top:5px;display:inline-block;background:#E0F2FE;color:#0369A1;padding:3px 8px;border-radius:4px;font-size:0.75rem;font-weight:600;"><i class="ti ti-cash"></i> Budget: ${lead.budget}</div>`;
      }

      return `
        <tr>
          <td>
            <div class="stage-wrapper">
              <select class="stage-select stage-new" onchange="changeStage(this, '${lead.id}')">
                <option value="New" selected>New</option>
                <option value="In Progress">In Progress</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
          </td>
          <td>
            <div class="client-name">${lead.name}</div>
            <span class="client-source">${lead.source}</span>
          </td>
          <td>
            <div class="contact-item"><i class="ti ti-phone"></i> ${lead.phone} <a href="https://wa.me/91${phoneNum}" target="_blank" class="wa-btn"><i class="ti ti-brand-whatsapp"></i> Chat</a></div>
            <div class="contact-item"><i class="ti ti-mail"></i> ${lead.email}</div>
          </td>
          <td>
            <span class="sol-badge">${sol}</span>
          </td>
          <td>
            <div class="loc-info"><i class="ti ti-map-pin"></i> ${loc}</div>
          </td>
          <td>
            <div class="date-info">${date}, ${time}</div>
            <div class="time-ago">${isNew ? 'Just now' : ''}</div>
          </td>
          <td>
            ${notesHtml}
          </td>
          <td>
            <div class="action-icons">
              <button class="btn-icon" title="Edit" onclick="openEditModal('${lead.id}')"><i class="ti ti-edit"></i></button>
              <button class="btn-icon" title="Delete" onclick="deleteLead('${lead.id}')"><i class="ti ti-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  const searchInput = document.getElementById('searchInput');
  if(searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = allLeads.filter(l => 
        (l.name && l.name.toLowerCase().includes(term)) || 
        (l.email && l.email.toLowerCase().includes(term)) ||
        (l.phone && l.phone.includes(term))
      );
      renderTable(filtered);
    });
  }

  const refreshBtn = document.getElementById('refreshBtn');
  if(refreshBtn) refreshBtn.addEventListener('click', fetchLeads);

  // ======== EDIT / DELETE / EXPORT LOGIC ========

  window.openEditModal = function(id) {
    const lead = allLeads.find(l => l.id === id);
    if (!lead) return;
    
    document.getElementById('edit-id').value = lead.id;
    document.getElementById('edit-name').value = lead.name || '';
    document.getElementById('edit-email').value = lead.email || '';
    document.getElementById('edit-phone').value = lead.phone || '';
    document.getElementById('edit-company').value = (lead.company && lead.company !== 'Not Specified') ? lead.company : '';
    
    let sol = lead.solution || 'General';
    const solSelect = document.getElementById('edit-solution');
    let optionExists = Array.from(solSelect.options).some(opt => opt.value === sol);
    if (!optionExists) {
       let newOption = new Option(sol, sol);
       solSelect.add(newOption);
    }
    solSelect.value = sol;
    
    document.getElementById('edit-notes').value = lead.notes || '';
    
    document.getElementById('editLeadModal').classList.add('active');
  };

  window.closeEditModal = function() {
    document.getElementById('editLeadModal').classList.remove('active');
  };

  const editForm = document.getElementById('editLeadForm');
  if(editForm) {
    editForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = document.getElementById('saveLeadBtn');
      btn.textContent = 'Saving...';
      btn.disabled = true;

      const id = document.getElementById('edit-id').value;
      const updatedData = {
        name: document.getElementById('edit-name').value,
        email: document.getElementById('edit-email').value,
        phone: document.getElementById('edit-phone').value,
        company: document.getElementById('edit-company').value || 'Not Specified',
        solution: document.getElementById('edit-solution').value,
        notes: document.getElementById('edit-notes').value
      };

      fetch(`${fbDbUrl}/${id}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })
      .then(res => res.json())
      .then(() => {
        const index = allLeads.findIndex(l => l.id === id);
        if (index !== -1) {
          allLeads[index] = { ...allLeads[index], ...updatedData };
        }
        btn.textContent = 'Save Changes';
        btn.disabled = false;
        closeEditModal();
        
        const term = document.getElementById('searchInput').value.toLowerCase();
        const filtered = allLeads.filter(l => 
          (l.name && l.name.toLowerCase().includes(term)) || 
          (l.email && l.email.toLowerCase().includes(term)) ||
          (l.phone && l.phone.includes(term))
        );
        renderTable(filtered);
      })
      .catch(err => {
        console.error(err);
        alert('Failed to save changes.');
        btn.textContent = 'Save Changes';
        btn.disabled = false;
      });
    });
  }

  window.deleteLead = function(id) {
    if (!confirm('Are you sure you want to permanently delete this lead?')) return;
    
    fetch(`${fbDbUrl}/${id}.json`, {
      method: 'DELETE'
    })
    .then(() => {
      allLeads = allLeads.filter(l => l.id !== id);
      const term = document.getElementById('searchInput').value.toLowerCase();
      const filtered = allLeads.filter(l => 
        (l.name && l.name.toLowerCase().includes(term)) || 
        (l.email && l.email.toLowerCase().includes(term)) ||
        (l.phone && l.phone.includes(term))
      );
      renderTable(filtered);
      updateMetrics(allLeads);
    })
    .catch(err => {
      console.error(err);
      alert('Failed to delete lead.');
    });
  };

  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function() {
      const term = document.getElementById('searchInput').value.toLowerCase();
      const filtered = allLeads.filter(l => 
        (l.name && l.name.toLowerCase().includes(term)) || 
        (l.email && l.email.toLowerCase().includes(term)) ||
        (l.phone && l.phone.includes(term))
      );

      if (filtered.length === 0) {
        alert("No leads to export.");
        return;
      }

      const headers = ['Date', 'Time', 'Name', 'Email', 'Phone', 'Company', 'Solution', 'Location', 'Source', 'Notes', 'Budget'];
      let csvContent = headers.join(',') + '\n';

      filtered.forEach(lead => {
        const dateObj = new Date(lead.timestamp);
        const date = dateObj.toLocaleDateString('en-IN');
        const time = dateObj.toLocaleTimeString('en-IN');
        
        const row = [
          date,
          time,
          `"${(lead.name || '').replace(/"/g, '""')}"`,
          `"${(lead.email || '').replace(/"/g, '""')}"`,
          `"${(lead.phone || '').replace(/"/g, '""')}"`,
          `"${(lead.company || '').replace(/"/g, '""')}"`,
          `"${(lead.solution || '').replace(/"/g, '""')}"`,
          `"${(lead.location || '').replace(/"/g, '""')}"`,
          `"${(lead.source || '').replace(/"/g, '""')}"`,
          `"${(lead.notes || '').replace(/"/g, '""')}"`,
          `"${(lead.budget || '').replace(/"/g, '""')}"`
        ];
        csvContent += row.join(',') + '\n';
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "Yayath_CRM_Leads.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // ======== CAMPAIGNS TOGGLE LOGIC ========
  const tabLeads = document.getElementById('tab-leads');
  const tabCampaigns = document.getElementById('tab-campaigns');
  const viewLeads = document.getElementById('view-leads');
  const viewCampaigns = document.getElementById('view-campaigns');
  
  if (tabLeads && tabCampaigns) {
    tabLeads.addEventListener('click', () => {
      tabLeads.classList.add('active');
      tabCampaigns.classList.remove('active');
      viewLeads.style.display = 'block';
      viewCampaigns.style.display = 'none';
    });
    tabCampaigns.addEventListener('click', () => {
      tabCampaigns.classList.add('active');
      tabLeads.classList.remove('active');
      viewCampaigns.style.display = 'block';
      viewLeads.style.display = 'none';
    });
  }

  // ======== MOCK CAMPAIGN DATA & LOGIC ========
  const mockCampaigns = [
    { id: 'camp1', name: 'Search_Gurugram_HotDesk', source: 'Google Ads', status: 'Active', spend: '₹ 45,000', impressions: '120,500', clicks: '4,200', ctr: '3.48%', cpc: '₹ 10.71', conversions: '120', cpa: '₹ 375', roi: '+45%' },
    { id: 'camp2', name: 'Retargeting_Leads_FB', source: 'Facebook Ads', status: 'Active', spend: '₹ 20,000', impressions: '350,000', clicks: '1,500', ctr: '0.42%', cpc: '₹ 13.33', conversions: '45', cpa: '₹ 444', roi: '+22%' },
    { id: 'camp3', name: 'Display_ColdStorage_B2B', source: 'Google Display', status: 'Paused', spend: '₹ 80,200', impressions: '1.9M', clicks: '12,000', ctr: '0.63%', cpc: '₹ 6.68', conversions: '177', cpa: '₹ 453', roi: '+12%' }
  ];

  function renderCampaigns() {
    const tbody = document.getElementById('campaignsBody');
    if (!tbody) return;
    
    tbody.innerHTML = mockCampaigns.map(camp => {
      const statusBadge = camp.status === 'Active' ? '<span class="camp-status">Active</span>' : '<span class="camp-status paused">Paused</span>';
      return `
        <tr>
          <td>${statusBadge}</td>
          <td>
            <div class="client-name">${camp.name}</div>
            <span class="client-source">${camp.source}</span>
          </td>
          <td style="font-weight:600; color:#B91C1C;">${camp.spend}</td>
          <td>${camp.impressions}</td>
          <td>${camp.clicks} <span style="font-size:0.75rem; color:#64748B;">(${camp.ctr})</span></td>
          <td style="font-weight:600; color:#047857;">${camp.conversions}</td>
          <td>
            <button class="btn" style="background:#E0E7FF; color:#3730A3; padding:6px 12px; font-size:0.8rem;" onclick="openCampaignModal('${camp.id}')">View Details</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.openCampaignModal = function(id) {
    const camp = mockCampaigns.find(c => c.id === id);
    if (!camp) return;

    const content = `
      <div class="camp-header">
        <div class="camp-title">${camp.name} <span class="client-source" style="margin-left:8px;">${camp.source}</span></div>
        <div class="${camp.status === 'Active' ? 'camp-status' : 'camp-status paused'}">${camp.status}</div>
      </div>
      
      <table class="campaign-data">
        <tbody>
          <tr><th>Total Spend</th><td style="color:#B91C1C; font-weight:600;">${camp.spend}</td></tr>
          <tr><th>Impressions</th><td>${camp.impressions}</td></tr>
          <tr><th>Clicks</th><td>${camp.clicks}</td></tr>
          <tr><th>Click-Through Rate (CTR)</th><td>${camp.ctr}</td></tr>
          <tr><th>Cost Per Click (CPC)</th><td>${camp.cpc}</td></tr>
          <tr><th>Total Conversions (Leads)</th><td style="color:#047857; font-weight:600;">${camp.conversions}</td></tr>
          <tr><th>Cost Per Acquisition (CPA)</th><td>${camp.cpa}</td></tr>
          <tr><th>Return on Ad Spend (ROAS/ROI)</th><td style="color:var(--primary); font-weight:700; font-size:1.1rem;">${camp.roi}</td></tr>
        </tbody>
      </table>
    `;
    
    document.getElementById('campaignContent').innerHTML = content;
    document.getElementById('campaignModal').classList.add('active');
  };

  window.closeCampaignModal = function() {
    document.getElementById('campaignModal').classList.remove('active');
  };

  renderCampaigns();

  // Initial load
  fetchLeads();
  setInterval(fetchLeads, 30000);
});
