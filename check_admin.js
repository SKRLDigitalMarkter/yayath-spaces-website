const fs = require('fs');
const code = fs.readFileSync('autoblog-admin-v2.html', 'utf8');

const windowExpose = code.indexOf('window.renderAllBlogs');
console.log('window.renderAllBlogs exposed:', windowExpose !== -1);

const moduleScript = code.indexOf('type="module"');
const moduleScriptEnd = code.indexOf('</script>', moduleScript);
const renderAllBlogsIdx = code.indexOf('function renderAllBlogs');
console.log('Module script starts at:', moduleScript);
console.log('Module script ends at:', moduleScriptEnd);
console.log('renderAllBlogs defined at:', renderAllBlogsIdx);
console.log('renderAllBlogs inside module?', renderAllBlogsIdx > moduleScript && renderAllBlogsIdx < moduleScriptEnd);

// Check window.nav exposure
const navExpose = code.indexOf('window.nav');
console.log('window.nav exposed at:', navExpose);

// Show context around window exposures
const windowsLine = code.indexOf('window.openEditModal');
console.log('window.openEditModal exposed?', windowsLine !== -1);
