import sys
with open('crm.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add Export Button
export_btn = '<button class="btn-icon" title="Export to CSV" id="exportBtn" style="color:var(--success);"><i class="ti ti-download"></i></button>\n      <button class="btn-icon" title="Refresh Data" id="refreshBtn">'
if 'id="exportBtn"' not in html:
    html = html.replace('<button class="btn-icon" title="Refresh Data" id="refreshBtn">', export_btn)

# 2. Add Modals before </body>
modals_html = '''
  <!-- MODALS -->
  <style>
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: none; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
    .modal-overlay.active { display: flex; }
    .modal-box { background: white; width: 90%; max-width: 600px; border-radius: 12px; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); max-height: 90vh; overflow-y: auto; position: relative; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 12px; }
    .modal-header h2 { font-size: 1.25rem; font-weight: 700; color: #1E293B; margin: 0; }
    .modal-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted); transition: 0.2s; }
    .modal-close:hover { color: var(--danger); }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-muted); margin-bottom: 6px; }
    .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 8px; font-size: 0.95rem; outline: none; transition: 0.2s; }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
    .modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; border-top: 1px solid var(--border); padding-top: 16px; }
    .btn { padding: 10px 20px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; font-size: 0.95rem; }
    .btn-cancel { background: #F1F5F9; color: #475569; }
    .btn-cancel:hover { background: #E2E8F0; }
    .btn-save { background: var(--primary); color: white; }
    .btn-save:hover { background: #4338CA; }
    
    /* Campaign Data Table */
    .campaign-data { width: 100%; border-collapse: collapse; margin-top: 10px; }
    .campaign-data th, .campaign-data td { padding: 10px; border: 1px solid var(--border); font-size: 0.9rem; text-align: left; }
    .campaign-data th { background: #F8FAFC; color: var(--text-muted); font-weight: 600; width: 35%; }
  </style>

  <!-- Edit Lead Modal -->
  <div class="modal-overlay" id="editLeadModal">
    <div class="modal-box">
      <div class="modal-header">
        <h2>Edit Lead / Add Notes</h2>
        <button class="modal-close" onclick="closeEditModal()">&times;</button>
      </div>
      <form id="editLeadForm">
        <input type="hidden" id="edit-id">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" id="edit-name" required>
        </div>
        <div class="form-group">
          <label>Email Address</label>
          <input type="email" id="edit-email">
        </div>
        <div class="form-group">
          <label>Phone Number</label>
          <input type="text" id="edit-phone" required>
        </div>
        <div class="form-group">
          <label>Company (Optional)</label>
          <input type="text" id="edit-company">
        </div>
        <div class="form-group">
          <label>Requirement / Workspace Solution</label>
          <select id="edit-solution">
            <option value="General">General / Not Specified</option>
            <option value="Managed Offices">Managed Offices</option>
            <option value="Coworking Spaces">Coworking Spaces</option>
            <option value="Meeting Rooms">Meeting Rooms</option>
            <option value="Virtual Office">Virtual Office</option>
            <option value="Daypass">Daypass</option>
            <option value="Commercial Spaces">Commercial Spaces</option>
            <option value="3PL Services">3PL Services</option>
            <option value="Dark Store">Dark Store</option>
            <option value="Cold Storage">Cold Storage</option>
            <option value="Retail Spaces">Retail Spaces</option>
          </select>
        </div>
        <div class="form-group">
          <label>Sales Notes / Feedback</label>
          <textarea id="edit-notes" rows="4" placeholder="Add follow-up notes, special requirements, etc."></textarea>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-cancel" onclick="closeEditModal()">Cancel</button>
          <button type="submit" class="btn btn-save" id="saveLeadBtn">Save Changes</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Campaign Preview Modal -->
  <div class="modal-overlay" id="campaignModal">
    <div class="modal-box">
      <div class="modal-header">
        <h2>Campaign / Source Details</h2>
        <button class="modal-close" onclick="closeCampaignModal()">&times;</button>
      </div>
      <div id="campaignContent">
        <!-- Injected dynamically -->
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-cancel" onclick="closeCampaignModal()">Close</button>
      </div>
    </div>
  </div>

  <script src="js/crm.js"></script>
</body>
'''

if 'id="editLeadModal"' not in html:
    html = html.replace('  <script src="js/crm.js"></script>\n</body>', modals_html)

with open('crm.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated crm.html")
