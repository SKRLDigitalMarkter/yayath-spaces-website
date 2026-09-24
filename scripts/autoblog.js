const fs = require('fs');
const path = require('path');

const title = process.argv[2];
const keywords = process.argv[3];
const content = process.argv[4];

if (!title || !keywords || !content) {
    console.log('Usage: node autoblog.js "Blog Title" "keyword1, keyword2" "Your blog content here..."');
    process.exit(1);
}

const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const date = new Date().toISOString().split('T')[0];
const htmlFileName = `${slug}.html`;

// Basic HTML template for the blog post
const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Yayath Spaces Blog</title>
    <meta name="description" content="${content.substring(0, 150)}...">
    <meta name="keywords" content="${keywords}">
    <link rel="canonical" href="https://www.yayathspaces.com/${htmlFileName}" />
    <link rel="stylesheet" href="css/style.css">
    <style>
        body { font-family: 'Outfit', sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 0; }
        .blog-container { max-width: 800px; margin: 50px auto; padding: 40px; background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .blog-header { text-align: center; margin-bottom: 40px; }
        .blog-title { font-size: 2.5rem; font-weight: 800; color: #262161; }
        .blog-meta { color: #64748b; font-size: 0.9rem; margin-top: 10px; }
        .blog-content { font-size: 1.1rem; line-height: 1.8; color: #334155; }
        .back-link { display: inline-block; margin-top: 40px; color: #f5a623; text-decoration: none; font-weight: 600; }
        .back-link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="blog-container">
        <div class="blog-header">
            <h1 class="blog-title">${title}</h1>
            <div class="blog-meta">Published on ${date} | Keywords: ${keywords}</div>
        </div>
        <div class="blog-content">
            <p>${content.replace(/\n/g, '<br>')}</p>
        </div>
        <a href="index.html#blog" class="back-link">&larr; Back to Main Website</a>
    </div>
</body>
</html>`;

// 1. Create the HTML file
const rootDir = path.join(__dirname, '..');
fs.writeFileSync(path.join(rootDir, htmlFileName), htmlTemplate, 'utf8');
console.log(`[SUCCESS] Created blog post: ${htmlFileName}`);

// 2. Update sitemap.xml
const sitemapPath = path.join(rootDir, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
    let sitemap = fs.readFileSync(sitemapPath, 'utf8');
    const newUrlEntry = `
  <url>
    <loc>https://www.yayathspaces.com/${htmlFileName}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    
    // Insert before </urlset>
    sitemap = sitemap.replace('</urlset>', `${newUrlEntry}\n</urlset>`);
    fs.writeFileSync(sitemapPath, sitemap, 'utf8');
    console.log(`[SUCCESS] Added ${htmlFileName} to sitemap.xml`);
}

// 3. Optional: Add a link to index.html (Simple Append for now)
console.log(`\nAuto-Blogging complete! To view it, go to /${htmlFileName}`);
console.log(`Don't forget to run 'npx vercel --prod' to deploy the new post.`);
