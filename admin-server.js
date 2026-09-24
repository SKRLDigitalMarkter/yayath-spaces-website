/**
 * Yayath Spaces - Autoblog Admin Server
 * =====================================
 * Standalone Node.js server that powers the admin dashboard.
 * - Serves admin UI on http://localhost:4000
 * - Full CRUD for blogs.json
 * - Gemini API for content + image generation
 * - Auto-deploys to Vercel after every change
 * - Cron-based autoblogging (no Antigravity needed)
 */

const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
const { execSync, exec } = require('child_process');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = 4000;
const PROJECT_DIR = __dirname;
const BLOGS_FILE = path.join(PROJECT_DIR, 'data', 'blogs.json');
const KEYWORDS_FILE = path.join(PROJECT_DIR, 'data', 'blog_keywords.txt');
const LOGS_FILE = path.join(PROJECT_DIR, 'data', 'automation_logs.json');
const SETTINGS_FILE = path.join(PROJECT_DIR, 'data', 'admin_settings.json');
const BLOG_IMAGES_DIR = path.join(PROJECT_DIR, 'assets', 'images', 'blogs');

// ── Middleware ──
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.static(PROJECT_DIR)); // Serve site files

// ── Helpers ──
function readJSON(file, fallback = []) {
  try { return JSON.parse(fs.readFileSync(file, 'utf-8')); }
  catch { return fallback; }
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}
function readText(file, fallback = '') {
  try { return fs.readFileSync(file, 'utf-8'); } catch { return fallback; }
}
function writeText(file, text) {
  fs.writeFileSync(file, text, 'utf-8');
}
function addLog(status, blogTitle, message, keywordUsed = 'N/A') {
  const logs = readJSON(LOGS_FILE, []);
  logs.push({ timestamp: new Date().toISOString(), status, blogTitle, message, keywordUsed });
  writeJSON(LOGS_FILE, logs);
}

// ── Gemini AI Setup ──
function getGemini() {
  const settings = readJSON(SETTINGS_FILE, {});
  const apiKey = settings.geminiApiKey || process.env.GEMINI_API_KEY || '';
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
}

// ── Vercel Deploy ──
function deployToVercel() {
  return new Promise((resolve) => {
    exec('npx vercel --prod --yes', { cwd: PROJECT_DIR }, (err, stdout, stderr) => {
      if (err) { console.error('Deploy error:', stderr); resolve({ ok: false, error: stderr }); }
      else { console.log('Deploy success:', stdout.substring(0, 300)); resolve({ ok: true, output: stdout }); }
    });
  });
}

// ══════════════════════════════════════════
//  API ROUTES
// ══════════════════════════════════════════

// ── Settings ──
app.get('/api/settings', (req, res) => {
  res.json(readJSON(SETTINGS_FILE, {
    geminiApiKey: '',
    authorName: 'Yayath Spaces Team',
    authorRole: 'Workspace Experts',
    cronSchedule: '0 9 * * *',
    blogLength: 'medium',
    blogFormat: 'criteria',
    imageMode: 'ai',
    ctaText: 'Book a free tour at Yayath Spaces. Call: +91 95603 80807 | www.yayathspaces.com',
    brandTagline: 'Yayath Spaces — Premium Coworking & Managed Office Spaces in Gurugram',
    autoPublish: true
  }));
});

app.post('/api/settings', (req, res) => {
  const current = readJSON(SETTINGS_FILE, {});
  const updated = { ...current, ...req.body };
  writeJSON(SETTINGS_FILE, updated);
  // Restart cron with new schedule if changed
  if (req.body.cronSchedule) restartCron(req.body.cronSchedule);
  res.json({ ok: true, settings: updated });
});

// ── Blogs ──
app.get('/api/blogs', (req, res) => {
  res.json(readJSON(BLOGS_FILE, []));
});

app.post('/api/blogs', async (req, res) => {
  const blogs = readJSON(BLOGS_FILE, []);
  const blog = req.body;
  blog.id = blog.id || blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/, '');
  // New blogs go to the top
  blogs.unshift(blog);
  writeJSON(BLOGS_FILE, blogs);
  addLog('success', blog.title, 'Blog manually published from dashboard.', blog.targetKeyword || 'Manual');
  const deploy = await deployToVercel();
  res.json({ ok: true, blog, deployed: deploy.ok });
});

app.put('/api/blogs/:id', async (req, res) => {
  const blogs = readJSON(BLOGS_FILE, []);
  const idx = blogs.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ ok: false, error: 'Blog not found' });
  blogs[idx] = { ...blogs[idx], ...req.body };
  writeJSON(BLOGS_FILE, blogs);
  const deploy = await deployToVercel();
  res.json({ ok: true, blog: blogs[idx], deployed: deploy.ok });
});

app.delete('/api/blogs/:id', async (req, res) => {
  let blogs = readJSON(BLOGS_FILE, []);
  blogs = blogs.filter(b => b.id !== req.params.id);
  writeJSON(BLOGS_FILE, blogs);
  const deploy = await deployToVercel();
  res.json({ ok: true, deployed: deploy.ok });
});

// ── Keywords ──
app.get('/api/keywords', (req, res) => {
  const text = readText(KEYWORDS_FILE);
  const keywords = text.split('\n').map(k => k.trim()).filter(k => k && !k.startsWith('#'));
  res.json({ keywords });
});

app.post('/api/keywords', (req, res) => {
  const { keywords } = req.body; // array
  writeText(KEYWORDS_FILE, keywords.join('\n'));
  res.json({ ok: true });
});

// ── Logs ──
app.get('/api/logs', (req, res) => {
  res.json(readJSON(LOGS_FILE, []));
});

// ── AI: Generate Blog Content ──
app.post('/api/generate/blog', async (req, res) => {
  const genAI = getGemini();
  if (!genAI) return res.status(400).json({ ok: false, error: 'Gemini API key not set. Go to Settings and add your API key.' });

  const { title, keywords, format, length, instructions } = req.body;
  const wordTarget = length === 'short' ? 600 : length === 'long' ? 2000 : 1200;
  const settings = readJSON(SETTINGS_FILE, {});

  const prompt = `You are an expert SEO content writer for Yayath Spaces, a premium coworking and managed office space provider in Gurugram, India.

Write a high-quality, SEO-optimized blog post with the following specifications:

Title: "${title}"
Target Keywords (use naturally in headings and body): ${keywords}
Content Format: ${format === 'criteria' ? 'Numbered practical criteria guide (like "7 criteria to choose...")' : format === 'comparison' ? 'Detailed comparison article' : format === 'tips' ? 'Practical tips listicle' : 'Comprehensive informational guide'}
Target Length: ~${wordTarget} words
Brand: Yayath Spaces — Premium Coworking & Managed Office Spaces in Gurugram
CTA at end: "${settings.ctaText || 'Book a free tour at Yayath Spaces. Call: +91 95603 80807 | www.yayathspaces.com'}"

Additional Instructions: ${instructions || 'Write in a professional, engaging tone. Include real Gurugram locations (MG Road, Golf Course Extension, Sohna Road, DLF Cyber City). Make it practical and informative.'}

IMPORTANT OUTPUT FORMAT:
- Return ONLY valid HTML content (no markdown, no code blocks)
- Use: <h2>, <h3>, <p>, <ul>, <li>, <ol>, <strong>, <em> tags only
- First element must be a <p> (not h2)
- Do NOT include <html>, <body>, <head> tags
- Do NOT include the title as h1 (it's already shown separately)
- Make sure target keywords appear in at least 2-3 h2 headings
- End with a strong CTA paragraph`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const content = result.response.text();
    res.json({ ok: true, content: content.trim() });
  } catch (err) {
    console.error('Gemini content error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── AI: Generate Image (using Gemini vision model or base64) ──
app.post('/api/generate/image', async (req, res) => {
  const genAI = getGemini();
  if (!genAI) return res.status(400).json({ ok: false, error: 'Gemini API key not set.' });

  const { description, filename } = req.body;

  // Use Gemini Imagen API (gemini-2.0-flash-exp supports image generation)
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-preview-image-generation' });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `Generate a high-quality, photorealistic blog hero image for a premium coworking space company in Gurugram, India. ${description}. Professional photography style, warm lighting, modern office environment.` }] }],
      generationConfig: { responseModalities: ['IMAGE', 'TEXT'] }
    });

    const parts = result.response.candidates?.[0]?.content?.parts || [];
    const imgPart = parts.find(p => p.inlineData);
    if (!imgPart) return res.status(500).json({ ok: false, error: 'No image generated' });

    const imgData = imgPart.inlineData.data;
    const mimeType = imgPart.inlineData.mimeType || 'image/jpeg';
    const ext = mimeType.includes('png') ? 'png' : 'jpg';
    const safeName = (filename || ('blog_img_' + Date.now())).replace(/[^a-z0-9_-]/gi, '_') + '.' + ext;
    const filePath = path.join(BLOG_IMAGES_DIR, safeName);

    fs.mkdirSync(BLOG_IMAGES_DIR, { recursive: true });
    fs.writeFileSync(filePath, Buffer.from(imgData, 'base64'));
    res.json({ ok: true, imagePath: 'assets/images/blogs/' + safeName });
  } catch (err) {
    console.error('Image generation error:', err);
    // Fallback: return error message
    res.status(500).json({ ok: false, error: 'Image generation failed: ' + err.message + '. Make sure you are using a Gemini API key that supports imagen.' });
  }
});

// ── Manual Deploy ──
app.post('/api/deploy', async (req, res) => {
  const result = await deployToVercel();
  res.json(result);
});

// ── Full Auto Blog Generate + Publish ──
app.post('/api/autoblog', async (req, res) => {
  try {
    const keywords = readText(KEYWORDS_FILE).split('\n').map(k => k.trim()).filter(k => k && !k.startsWith('#'));
    const keyword = keywords[Math.floor(Math.random() * keywords.length)] || 'Coworking space in Gurugram';
    const settings = readJSON(SETTINGS_FILE, {});
    
    const genAI = getGemini();
    if (!genAI) {
      addLog('error', 'Autoblog Failed', 'Gemini API key not configured in Settings.', keyword);
      return res.status(400).json({ ok: false, error: 'Gemini API key not set' });
    }

    // Generate title first
    const titleModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const titleResult = await titleModel.generateContent(
      `Generate one creative, SEO-optimized blog post title for a Gurugram coworking space company targeting the keyword: "${keyword}". 
       Make it practical, numbered-list style (like "7 reasons...", "5 ways..."). 
       Return ONLY the title, nothing else.`
    );
    const title = titleResult.response.text().trim().replace(/^["']|["']$/g, '');

    // Generate content
    const wordTarget = settings.blogLength === 'short' ? 600 : settings.blogLength === 'long' ? 2000 : 1200;
    const allKeywords = keywords.slice(0, 5).join(', ');
    const contentModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const contentResult = await contentModel.generateContent(
      `Write a ${wordTarget}-word SEO blog post titled "${title}" for Yayath Spaces coworking company in Gurugram.
       Keywords to include naturally: ${allKeywords}
       Format: Numbered criteria/tips guide with 5-8 sections. Each section has h2 heading + 2-3 paragraphs.
       Brand CTA at end: "${settings.ctaText || 'Book a free tour at Yayath Spaces. Call: +91 95603 80807 | www.yayathspaces.com'}"
       Return ONLY HTML: <h2>, <p>, <ul>, <li>, <strong> tags. No title h1. No markdown. No code blocks.`
    );
    const content = contentResult.response.text().trim();
    const excerpt = content.replace(/<[^>]+>/g, '').substring(0, 200).trim() + '...';

    // Generate image
    let imagePath = 'assets/images/blogs/blog_coworking_hero.jpg';
    try {
      const imgModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-preview-image-generation' });
      const imgResult = await imgModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: `Photorealistic blog hero image for: "${title}". Premium coworking office in Gurugram India, professional lighting, modern design.` }] }],
        generationConfig: { responseModalities: ['IMAGE', 'TEXT'] }
      });
      const parts = imgResult.response.candidates?.[0]?.content?.parts || [];
      const imgPart = parts.find(p => p.inlineData);
      if (imgPart) {
        const ext = imgPart.inlineData.mimeType?.includes('png') ? 'png' : 'jpg';
        const fname = 'auto_' + Date.now() + '.' + ext;
        fs.mkdirSync(BLOG_IMAGES_DIR, { recursive: true });
        fs.writeFileSync(path.join(BLOG_IMAGES_DIR, fname), Buffer.from(imgPart.inlineData.data, 'base64'));
        imagePath = 'assets/images/blogs/' + fname;
      }
    } catch (imgErr) { console.warn('Auto image gen failed, using default:', imgErr.message); }

    // Save blog
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/, '').substring(0, 60);
    const blogs = readJSON(BLOGS_FILE, []);
    const newBlog = {
      id: slug + '-' + Date.now(),
      isFeatured: false,
      title, excerpt, content,
      category: 'Workspace Guide',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      readTime: Math.ceil(wordTarget / 200) + ' min read',
      image: imagePath,
      authorName: settings.authorName || 'Yayath Spaces Team',
      authorRole: settings.authorRole || 'Workspace Experts',
      authorImg: "<i class='ti ti-user'></i>",
      targetKeyword: keyword,
      seoKeywords: allKeywords
    };
    blogs.unshift(newBlog);
    writeJSON(BLOGS_FILE, blogs);
    addLog('success', newBlog.title, `Auto-published using keyword: "${keyword}". Image: ${imagePath}`, keyword);

    // Deploy
    const deploy = await deployToVercel();
    res.json({ ok: true, blog: newBlog, deployed: deploy.ok });
  } catch (err) {
    console.error('Autoblog error:', err);
    addLog('error', 'Autoblog Run', err.message, 'N/A');
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── Image Library ──
app.get('/api/images', (req, res) => {
  const dir = BLOG_IMAGES_DIR;
  const spaceImgDir = path.join(PROJECT_DIR, 'assets', 'images', 'spaces');
  let imgs = [];
  try {
    imgs = fs.readdirSync(dir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f)).map(f => ({ path: 'assets/images/blogs/' + f, label: f.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ') }));
  } catch {}
  try {
    const spaceImgs = fs.readdirSync(spaceImgDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f)).map(f => ({ path: 'assets/images/spaces/' + f, label: f.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ') }));
    imgs = [...imgs, ...spaceImgs];
  } catch {}
  res.json({ images: imgs });
});

// ── Admin Dashboard ──
app.get('/admin', (req, res) => {
  res.sendFile('autoblog-admin-v2.html', { root: PROJECT_DIR });
});
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: PROJECT_DIR });
});

// ══════════════════════════════════════════
//  CRON AUTOBLOG
// ══════════════════════════════════════════
let cronJob = null;

function restartCron(schedule) {
  if (cronJob) cronJob.stop();
  if (!schedule || schedule === 'off') return;
  try {
    cronJob = cron.schedule(schedule, async () => {
      console.log('[CRON] Autoblog triggered at', new Date().toLocaleString());
      const settings = readJSON(SETTINGS_FILE, {});
      if (!settings.autoPublish) return;
      try {
        const resp = await fetch('http://localhost:' + PORT + '/api/autoblog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
        const data = await resp.json();
        console.log('[CRON] Blog published:', data.ok ? data.blog?.title : data.error);
      } catch (e) { console.error('[CRON] Error:', e.message); }
    });
    console.log('[CRON] Scheduled:', schedule);
  } catch (e) { console.error('Invalid cron expression:', schedule, e.message); }
}

// Start server
app.listen(PORT, () => {
  console.log('\n═══════════════════════════════════════════');
  console.log('  Yayath Spaces Autoblog Admin Server');
  console.log('  http://localhost:' + PORT + '/admin');
  console.log('═══════════════════════════════════════════\n');
  // Start default cron
  const settings = readJSON(SETTINGS_FILE, {});
  restartCron(settings.cronSchedule || '0 9 * * *');
});

module.exports = app;
