const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  await page.goto('file://' + process.cwd() + '/index.html', { waitUntil: 'networkidle0' });
  
  const btns = await page.$$('.loc-filter-btn');
  console.log('Found filter buttons:', btns.length);
  
  if (btns.length > 1) {
    console.log('Clicking second button...');
    await btns[1].click();
    await new Promise(r => setTimeout(r, 500));
    
    const active = await page.$eval('.loc-filter-btn.active', el => el.textContent);
    console.log('Active button is now:', active);
    
    const visibleCards = await page.$$eval('.loc-card', cards => {
        return cards.filter(c => getComputedStyle(c).display !== 'none').length;
    });
    console.log('Visible cards:', visibleCards);
  }
  
  await browser.close();
})();
