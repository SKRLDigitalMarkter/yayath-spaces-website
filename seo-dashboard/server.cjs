const express = require('express');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// If we are running this from yayath-spaces-final/seo-dashboard
const WEBSITE_DIR = path.join(__dirname, '..');

// Get all pages and their SEO data
app.get('/api/pages', (req, res) => {
    try {
        const files = fs.readdirSync(WEBSITE_DIR);
        const htmlFiles = files.filter(f => f.endsWith('.html'));
        
        const pagesData = htmlFiles.map(file => {
            const filePath = path.join(WEBSITE_DIR, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const $ = cheerio.load(content);
            
            return {
                filename: file,
                title: $('title').text() || '',
                description: $('meta[name="description"]').attr('content') || '',
                keywords: $('meta[name="keywords"]').attr('content') || '',
                h1: $('h1').first().text() || ''
            };
        });
        
        res.json({ pages: pagesData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update SEO data for a page
app.post('/api/update-seo', (req, res) => {
    const { filename, title, description, keywords } = req.body;
    
    if (!filename) return res.status(400).json({ error: 'Filename is required' });
    
    try {
        const filePath = path.join(WEBSITE_DIR, filename);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        const $ = cheerio.load(content);
        
        if (title !== undefined) {
            if ($('title').length) $('title').text(title);
            else $('head').append(`<title>${title}</title>`);
        }
        
        if (description !== undefined) {
            if ($('meta[name="description"]').length) $('meta[name="description"]').attr('content', description);
            else $('head').append(`<meta name="description" content="${description}">`);
        }
        
        if (keywords !== undefined) {
            if ($('meta[name="keywords"]').length) $('meta[name="keywords"]').attr('content', keywords);
            else $('head').append(`<meta name="keywords" content="${keywords}">`);
        }
        
        fs.writeFileSync(filePath, $.html());
        res.json({ success: true, message: `Updated ${filename}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Serve the built React dashboard (which is in the same folder now!)
app.use(express.static(__dirname));
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Yayath SEO CMS Server running on http://localhost:${PORT}`);
    console.log(`Connected to website directory: ${WEBSITE_DIR}`);
});
