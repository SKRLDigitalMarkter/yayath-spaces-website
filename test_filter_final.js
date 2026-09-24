const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE:', msg.text()));
  page.on('pageerror', err => console.log('ERROR:', err.message));
  
  await page.goto('file://' + process.cwd() + '/index.html', { waitUntil: 'networkidle0' });
  
  // Navigate to locations page
  await page.evaluate(() => {
    if (typeof showPage === 'function') showPage('locations');
  });
  await new Promise(r => setTimeout(r, 800));
  
  // Check what's at the filter button center now
  const overlap = await page.evaluate(() => {
    const btn = document.querySelectorAll('.loc-filter-btn')[1];
    if (!btn) return 'NO BUTTON FOUND';
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const el = document.elementFromPoint(x, y);
    return `${el.tagName} / class="${el.className}" / id="${el.id}"`;
  });
  console.log('Element at filter btn center:', overlap);
  
  // Try clicking
  const btns = await page.$$('.loc-filter-btn');
  console.log('Filter buttons found:', btns.length);
  
  if (btns.length > 1) {
    await btns[1].click();
    await new Promise(r => setTimeout(r, 500));
    
    const active = await page.$eval('.loc-filter-btn.active', el => el.textContent.trim());
    console.log('Active button after click:', active);
    
    const visibleCards = await page.$$eval('.loc-card', cards =>
      cards.filter(c => getComputedStyle(c).display !== 'none').length
    );
    const totalCards = await page.$$eval('.loc-card', cards => cards.length);
    console.log(`Visible cards: ${visibleCards} / ${totalCards} (filter is working if < total)`);
  }
  
  await browser.close();
})();
