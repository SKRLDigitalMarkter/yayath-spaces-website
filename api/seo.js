import axios from 'axios';
import * as cheerio from 'cheerio';

const REPO_OWNER = 'SKRLDigitalMarkter';
const REPO_NAME = 'yayath-spaces-website';
const BRANCH = 'master'; // or main

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1] || process.env.GITHUB_TOKEN;
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized: GitHub token required' });
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
  };

  const API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

  if (req.method === 'GET') {
    try {
      // 1. Get the repository tree to find all HTML files
      const treeRes = await axios.get(`${API_BASE}/git/trees/${BRANCH}?recursive=1`, { headers });
      const htmlFiles = treeRes.data.tree.filter(file => file.path.endsWith('.html') && file.type === 'blob');

      const seoData = [];

      // 2. Fetch content of each HTML file and parse SEO tags
      for (const file of htmlFiles) {
        // Skip some partials if any, we'll just fetch all root level HTML files for now
        // To be fast, let's just fetch root level html files
        if (file.path.includes('/')) continue;

        const fileRes = await axios.get(`${API_BASE}/contents/${file.path}`, { headers });
        const content = Buffer.from(fileRes.data.content, 'base64').toString('utf-8');
        
        const $ = cheerio.load(content);
        const title = $('title').text();
        const description = $('meta[name="description"]').attr('content') || '';
        const keywords = $('meta[name="keywords"]').attr('content') || '';

        seoData.push({
          path: file.path,
          title,
          description,
          keywords,
          sha: fileRes.data.sha,
        });
      }

      return res.status(200).json({ success: true, data: seoData });
    } catch (error) {
      console.error(error.response?.data || error.message);
      return res.status(500).json({ success: false, error: 'Failed to fetch data' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { path, title, description, keywords, sha } = req.body;

      // 1. Fetch current content
      const fileRes = await axios.get(`${API_BASE}/contents/${path}`, { headers });
      const currentContent = Buffer.from(fileRes.data.content, 'base64').toString('utf-8');

      // 2. Modify content
      const $ = cheerio.load(currentContent);
      
      // Update Title
      if ($('title').length === 0) {
        $('head').append(`<title>${title}</title>`);
      } else {
        $('title').text(title);
      }

      // Update Description
      if ($('meta[name="description"]').length === 0) {
        $('head').append(`<meta name="description" content="${description}">`);
      } else {
        $('meta[name="description"]').attr('content', description);
      }

      // Update Keywords
      if ($('meta[name="keywords"]').length === 0) {
        $('head').append(`<meta name="keywords" content="${keywords}">`);
      } else {
        $('meta[name="keywords"]').attr('content', keywords);
      }

      // Get new HTML string
      const newHtml = $.html();

      // 3. Commit new content
      const commitRes = await axios.put(`${API_BASE}/contents/${path}`, {
        message: `Update SEO metadata for ${path}`,
        content: Buffer.from(newHtml, 'utf-8').toString('base64'),
        sha: fileRes.data.sha,
        branch: BRANCH
      }, { headers });

      return res.status(200).json({ success: true, message: 'Updated successfully!', newSha: commitRes.data.content.sha });
    } catch (error) {
      console.error(error.response?.data || error.message);
      return res.status(500).json({ success: false, error: 'Failed to update data' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
