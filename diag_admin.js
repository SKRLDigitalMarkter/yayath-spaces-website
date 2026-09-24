// Diagnostic: Check all possible issues in autoblog admin
const fs = require('fs');
const code = fs.readFileSync('autoblog-admin-v2.html', 'utf8');

console.log('=== WINDOW EXPOSURES ===');
const windowLines = code.split('\n').filter(l => l.includes('window.'));
windowLines.forEach(l => console.log(l.trim()));

console.log('\n=== CHECKING KEY FUNCTIONS EXPOSED ===');
const funcs = ['openEditModal','closeEditModal','updateBlog','deleteBlog','renderAllBlogs','renderDashboard','nav','loadBlogs'];
funcs.forEach(fn => {
  const exposed = code.includes(`window.${fn}`);
  const defined = code.includes(`function ${fn}`);
  console.log(`${fn}: defined=${defined}, window-exposed=${exposed}`);
});

console.log('\n=== CHECKING editModal exists ===');
console.log('editModal div:', code.includes('id="editModal"'));
console.log('editId input:', code.includes('id="editId"'));
console.log('editTitle input:', code.includes('id="editTitle"'));
console.log('editContent div:', code.includes('id="editContent"'));

console.log('\n=== CHECKING modal-bg CSS ===');
const modalBgIdx = code.indexOf('.modal-bg');
if (modalBgIdx !== -1) {
  console.log('modal-bg CSS found at index:', modalBgIdx);
  console.log(code.substring(modalBgIdx, modalBgIdx + 200));
}

console.log('\n=== editModal.open check ===');
const openClassIdx = code.indexOf("classList.add('open')");
console.log('classList.add open usages:', (code.match(/classList\.add\('open'\)/g)||[]).length);
