import sys

with open('js/crm.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Update the table rendering to include onClick for the Campaign and edit/delete buttons
# Finding the table rendering part:
# <span class="client-source"></span>
new_source = '''<span class="client-source" style="cursor:pointer; text-decoration:underline; color:var(--primary);" onclick="openCampaignPreview('')" title="Click to view full campaign data"></span>'''
js = js.replace('<span class="client-source"></span>', new_source)

# Finding the action icons:
# <button class="btn-icon" title="Edit"><i class="ti ti-edit"></i></button>
# <button class="btn-icon" title="Delete"><i class="ti ti-trash"></i></button>
old_actions = '''<button class="btn-icon" title="Edit"><i class="ti ti-edit"></i></button>
              <button class="btn-icon" title="Delete"><i class="ti ti-trash"></i></button>'''
new_actions = '''<button class="btn-icon" title="Edit" onclick="openEditModal('')"><i class="ti ti-edit"></i></button>
              <button class="btn-icon" title="Delete" onclick="deleteLead('')"><i class="ti ti-trash"></i></button>'''
js = js.replace(old_actions, new_actions)

# 2. Append the new functions at the bottom before });
# We need to expose them to window as well.

new_logic = '''
  // ======== EDIT / DELETE / CAMPAIGN / EXPORT LOGIC ========
  const fbDbUrl = 'https://yayath-crm-live-default-rtdb.asia-southeast1.firebasedatabase.app/leads';

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

  document.getElementById('editLeadForm').addEventListener('submit', function(e) {
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

    fetch(${fbDbUrl}/.json, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    })
    .then(res => res.json())
    .then(() => {
      // Update local array
      const index = allLeads.findIndex(l => l.id === id);
      if (index !== -1) {
        allLeads[index] = { ...allLeads[index], ...updatedData };
      }
      btn.textContent = 'Save Changes';
      btn.disabled = false;
      closeEditModal();
      
      // Re-filter and re-render
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

  window.deleteLead = function(id) {
    if (!confirm('Are you sure you want to permanently delete this lead?')) return;
    
    fetch(${fbDbUrl}/.json, {
      method: 'DELETE'
    })
    .then(() => {
      allLeads = allLeads.filter(l => l.id !== id);
      // Re-filter and re-render
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

  window.openCampaignPreview = function(id) {
    const lead = allLeads.find(l => l.id === id);
    if (!lead) return;

    let html = '<table class="campaign-data"><tbody>';
    // List out all properties of the lead
    for (const [key, value] of Object.entries(lead)) {
       // Skip very long tokens or raw message objects if they exist
       if(typeof value === 'object' || key === 'rawMessage') continue;
       
       let displayVal = value;
       if (key === 'timestamp') {
         displayVal = new Date(value).toLocaleString('en-IN');
       }
       html += <tr><th></th><td></td></tr>;
    }
    html += '</tbody></table>';

    document.getElementById('campaignContent').innerHTML = html;
    document.getElementById('campaignModal').classList.add('active');
  };

  window.closeCampaignModal = function() {
    document.getElementById('campaignModal').classList.remove('active');
  };

  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function() {
      // Get currently filtered leads
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

      // Convert to CSV
      const headers = ['Date', 'Time', 'Name', 'Email', 'Phone', 'Company', 'Solution', 'Location', 'Source', 'Notes'];
      let csvContent = headers.join(',') + '\\n';

      filtered.forEach(lead => {
        const dateObj = new Date(lead.timestamp);
        const date = dateObj.toLocaleDateString('en-IN');
        const time = dateObj.toLocaleTimeString('en-IN');
        
        const row = [
          date,
          time,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        ];
        csvContent += row.join(',') + '\\n';
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
'''

if '// ======== EDIT / DELETE' not in js:
    # insert before the final '});'
    js = js.replace('});', new_logic + '\n});')

with open('js/crm.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Updated js/crm.js")
