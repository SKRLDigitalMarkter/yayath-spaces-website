import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fwyrrabbnrqgkhvazxnq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_F6sv1y2f38PXGcVdkSVdGw_EXoadkIh';

const topics = [
  "Why Coworking Spaces in Gurugram Are Ideal for Startups",
  "Top 5 Benefits of Renting a Managed Office in Gurugram",
  "How Coworking Spaces Boost Productivity and Networking",
  "The Future of Hybrid Work and Flexible Workspaces",
  "Choosing the Right Coworking Space for Your Team in NCR"
];

export default async function handler(req, res) {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // 1. Fetch settings
    const { data: settingsData } = await supabase.from('settings').select('*').eq('id', 'global').single();
    if (!settingsData) throw new Error('Settings not found');
    
    const apiKey = settingsData.geminiapikey;
    if (!apiKey) throw new Error('API Key missing in settings');

    // 2. Pick a random topic
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const prompt = `Write a full SEO blog post about "${topic}" for a coworking space in Gurugram.
Return a JSON object exactly like this (NO markdown wrappers, just JSON):
{
  "title": "Catchy SEO Title",
  "excerpt": "Short 2 sentence summary",
  "content": "<h2>HTML content here...</h2>"
}`;

    // 3. Call AI
    let aiResponseText;
    if (apiKey.startsWith('sk-or-')) {
      // OpenRouter
      const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://yayathspaces.com',
          'X-Title': 'Yayath Spaces'
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const aiJson = await aiRes.json();
      if(aiJson.error) throw new Error(aiJson.error.message);
      aiResponseText = aiJson.choices[0].message.content;
    } else {
      // Direct OpenAI fallback if needed
      const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const aiJson = await aiRes.json();
      if(aiJson.error) throw new Error(aiJson.error.message);
      aiResponseText = aiJson.choices[0].message.content;
    }

    // 4. Parse response
    let cleanJson = aiResponseText.replace(/^```json\s*/,'').replace(/^```\s*/,'').replace(/```$/,'').trim();
    const aiData = JSON.parse(cleanJson);

    // 5. Generate Pollinations Image
    const seed = Math.floor(Math.random() * 100000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(aiData.title + ' modern coworking office space')}?width=800&height=500&nologo=true&seed=${seed}`;

    // 6. Save to Supabase
    const newBlog = {
      id: aiData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      title: aiData.title,
      excerpt: aiData.excerpt,
      category: 'Workspace Guide',
      date: new Date().toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'}),
      readtime: Math.ceil(aiData.content.replace(/<[^>]+>/g,'').split(/\s+/).length/200) + ' min read',
      isfeatured: false,
      image: imageUrl,
      content: aiData.content + `<br><p><strong>${settingsData.ctatext||''}</strong></p>`,
      authorname: settingsData.authorname || 'Yayath Spaces AI',
      authorrole: settingsData.authorrole || 'Workspace Expert',
      authorimg: "<i class='ti ti-robot'></i>"
    };

    const { error: insertErr } = await supabase.from('blogs').insert([newBlog]);
    if (insertErr) throw new Error(insertErr.message);

    res.status(200).json({ success: true, message: 'Autoblog generated', title: newBlog.title });
  } catch (err) {
    console.error('Autoblog Error:', err);
    res.status(500).json({ error: err.message });
  }
}
