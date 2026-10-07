import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const baseUrl = 'https://www.yayathspaces.com';
    const today = new Date().toISOString().split('T')[0];

    // Core indexable public pages
    const pages = [
      { url: '/', lastmod: '2026-09-11', priority: '1.0' },
      { url: '/about-us.html', lastmod: '2026-09-11', priority: '0.8' },
      { url: '/coworking-spaces.html', lastmod: '2026-09-11', priority: '0.9' },
      { url: '/managed-offices.html', lastmod: '2026-09-11', priority: '0.9' },
      { url: '/retail.html', lastmod: '2026-09-11', priority: '0.8' },
      { url: '/gallery.html', lastmod: '2026-09-11', priority: '0.7' },
      { url: '/contact-us.html', lastmod: '2026-09-11', priority: '0.8' },
      { url: '/why-coworking-in-gurugram-is-booming.html', lastmod: '2026-09-14', priority: '0.8' }
    ];

    // Dynamic blog pages from data/blogs.json
    try {
      const blogsPath = path.join(process.cwd(), 'data', 'blogs.json');
      if (fs.existsSync(blogsPath)) {
        const blogs = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));
        blogs.forEach(blog => {
          if (blog.id && blog.id !== 'why-coworking-in-gurugram-is-booming') {
            pages.push({
              url: `/${blog.id}.html`,
              lastmod: today,
              priority: '0.8'
            });
          }
        });
      }
    } catch (e) {
      console.warn('Error reading blogs for sitemap:', e);
    }

    // Build clean XML string
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    pages.forEach(p => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${p.url}</loc>\n`;
      xml += `    <lastmod>${p.lastmod}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>${p.priority}</priority>\n`;
      xml += '  </url>\n';
    });

    xml += '</urlset>';

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(200).send(xml);
  } catch (err) {
    console.error('Sitemap generation error:', err);
    res.setHeader('Content-Type', 'text/plain');
    return res.status(500).send('Error generating sitemap');
  }
}
