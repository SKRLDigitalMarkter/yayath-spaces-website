const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  await page.goto('file://' + process.cwd() + '/index.html', { waitUntil: 'networkidle0' });
  
  await page.evaluate(() => {
     if (typeof showPage === 'function') showPage('locations');
     
     document.querySelectorAll('.loc-filter-btn').forEach((b, i) => {
        b.addEventListener('click', () => console.log('CLICK FIRED ON BUTTON', i));
     });
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  const btns = await page.$$('.loc-filter-btn');
  await btns[1].click();
  
  await new Promise(r => setTimeout(r, 500));
  
  const active = await page.$eval('.loc-filter-btn.active', el => el.textContent);
  console.log('Active button is now:', active);
  
  await browser.close();
})();
