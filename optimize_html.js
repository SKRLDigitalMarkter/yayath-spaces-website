const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const sizeOf = require('image-size');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        if (dirPath.includes('node_modules')) return;
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

walkDir('.', (filePath) => {
    if (filePath.endsWith('.html')) {
        let html = fs.readFileSync(filePath, 'utf8');
        const $ = cheerio.load(html, { decodeEntities: false });

        let isHeroFound = false;

        $('img').each((i, el) => {
            const img = $(el);
            let src = img.attr('src');
            if (src) {
                // Convert to webp
                if (src.match(/\.(png|jpg|jpeg)$/i)) {
                    src = src.replace(/\.[^/.]+$/, "") + ".webp";
                    img.attr('src', src);
                }

                // Add width and height if missing
                if (!img.attr('width') || !img.attr('height')) {
                    try {
                        const imgPath = path.join(path.dirname(filePath), src);
                        if (fs.existsSync(imgPath)) {
                            const dimensions = sizeOf(imgPath);
                            img.attr('width', dimensions.width);
                            img.attr('height', dimensions.height);
                        } else if (fs.existsSync(src)) {
                            const dimensions = sizeOf(src);
                            img.attr('width', dimensions.width);
                            img.attr('height', dimensions.height);
                        }
                    } catch (e) {
                        // ignore
                    }
                }

                // First image (likely hero) -> fetchpriority="high", others -> loading="lazy"
                if (!isHeroFound && (img.closest('header').length || img.closest('.hero').length || i === 0)) {
                    img.attr('fetchpriority', 'high');
                    img.removeAttr('loading');
                    isHeroFound = true;
                } else if (!img.attr('loading') && isHeroFound) {
                    img.attr('loading', 'lazy');
                }
            }
        });

        // Defer scripts
        $('script').each((i, el) => {
            const script = $(el);
            if (script.attr('src') && !script.attr('defer') && !script.attr('async') && !script.attr('type')) {
                script.attr('defer', 'defer');
            }
        });

        // Preload fonts or critical CSS (optional, skipping for now, relying on GTM being deferred mostly)
        
        fs.writeFileSync(filePath, $.html());
        console.log('Optimized:', filePath);
    }
});
