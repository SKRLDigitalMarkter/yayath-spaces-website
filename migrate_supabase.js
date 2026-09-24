const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://fwyrrabbnrqgkhvazxnq.supabase.co';
const supabaseKey = 'sb_publishable_F6sv1y2f38PXGcVdkSVdGw_EXoadkIh'; 
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log('Starting migration...');
  
  try {
    const settings = JSON.parse(fs.readFileSync('data/admin_settings.json', 'utf8'));
    const { data: setRes, error: setErr } = await supabase
      .from('settings')
      .upsert({
        id: 'global',
        geminiapikey: settings.geminiApiKey,
        authorname: settings.authorName,
        authorrole: settings.authorRole,
        brandtagline: settings.brandTagline,
        ctatext: settings.ctaText,
        adminpin: settings.adminPin || '1234',
        cronschedule: settings.cronSchedule,
        bloglength: settings.blogLength,
        blogformat: settings.blogFormat,
        imagemode: settings.imageMode,
        autopublish: settings.autoPublish
      });
    if (setErr) console.error('Settings migration error:', setErr);
    else console.log('Settings migrated!');
  } catch (e) {
    console.error('Settings read error:', e.message);
  }

  try {
    const blogs = JSON.parse(fs.readFileSync('data/blogs.json', 'utf8'));
    for (const b of blogs) {
      const { error } = await supabase
        .from('blogs')
        .upsert({
          id: b.id,
          title: b.title,
          excerpt: b.excerpt,
          category: b.category,
          date: b.date,
          readtime: b.readTime,
          isfeatured: b.isFeatured,
          image: b.image,
          content: b.content,
          authorname: b.authorName,
          authorrole: b.authorRole,
          authorimg: b.authorImg
        });
      if (error) console.error('Blog migration error for', b.id, ':', error);
      else console.log('Migrated blog:', b.title);
    }
  } catch (e) {
    console.error('Blogs read error:', e.message);
  }

  console.log('Migration script finished.');
}

migrate();
