const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

const loadBlogsStart = code.indexOf('function loadBlogs');
const openBlogStart = code.indexOf('function openBlog(id)');

const newLoadBlogs = `async function loadBlogs() {
  try {
    const { data, error } = await _supabase.from('blogs').select('*').order('date', { ascending: false });
    if (error) throw error;
    allBlogs = data.map(b => ({
      id: b.id,
      title: b.title,
      category: b.category,
      date: b.date,
      readTime: b.readtime,
      isFeatured: b.isfeatured,
      excerpt: b.excerpt,
      image: b.image,
      image_alt: b.image_alt,
      content: b.content,
      authorName: b.authorname,
      authorRole: b.authorrole,
      authorImg: b.authorimg
    }));
    renderBlogs();
  } catch (err) {
    console.error('Error loading blogs from Supabase:', err);
  }
}`;

const cleanRenderBlogs = `function renderBlogs() {
  const grid = document.getElementById('dynamic-blog-grid');
  const featuredContainer = document.getElementById('dynamic-featured-blog');
  
  if (!grid || !featuredContainer) return;
  
  grid.innerHTML = '';
  featuredContainer.innerHTML = '';

  const featuredBlog = allBlogs.find(b => b.isFeatured) || allBlogs[0];
  const standardBlogs = allBlogs.filter(b => b.id !== (featuredBlog ? featuredBlog.id : null));

  // Render Featured Blog
  if (featuredBlog) {
    featuredContainer.innerHTML = \`
      <div class="pro-blog-featured reveal" onclick="openBlog('\${featuredBlog.id}')">
        <div class="pro-blog-featured-img" style="background-image: url('\${featuredBlog.image}');" role="img" aria-label="\${featuredBlog.image_alt || featuredBlog.title}"></div>
        <div class="pro-blog-featured-body">
          <div class="blog-meta">
            <span class="blog-tag" style="background: var(--gold); color: white;">\${featuredBlog.category}</span>
            <span class="blog-date">\${featuredBlog.date}</span>
          </div>
          <h2>\${featuredBlog.title}</h2>
          <p>\${featuredBlog.excerpt}</p>
          <div class="pro-blog-author">
            <div class="pro-blog-author-img">\${featuredBlog.authorImg}</div>
            <div class="pro-blog-author-info">
              <span class="pro-blog-author-name">\${featuredBlog.authorName}</span>
              <span class="pro-blog-author-role">\${featuredBlog.authorRole}</span>
            </div>
          </div>
        </div>
      </div>
    \`;
  }

  // Render Standard Blogs
  standardBlogs.forEach(blog => {
    grid.innerHTML += \`
      <div class="pro-blog-card reveal" onclick="openBlog('\${blog.id}')">
        <div class="pro-blog-img-wrap"><div class="pro-blog-img" style="background-image: url('\${blog.image}');" role="img" aria-label="\${blog.image_alt || blog.title}"></div></div>
        <div class="pro-blog-body">
          <div class="blog-meta"><span class="blog-tag">\${blog.category}</span><span class="blog-date">\${blog.date}</span></div>
          <h3>\${blog.title}</h3>
          <p>\${blog.excerpt}</p>
          <div class="pro-blog-author">
            <div class="pro-blog-author-img">\${blog.authorImg}</div>
            <div class="pro-blog-author-info">
              <span class="pro-blog-author-name">\${blog.authorName}</span>
              <span class="pro-blog-author-role">\${blog.authorRole}</span>
            </div>
          </div>
        </div>
      </div>
    \`;
  });
}`;

let newCode = code.substring(0, loadBlogsStart) + newLoadBlogs + '\n\n' + cleanRenderBlogs + '\n\n' + code.substring(openBlogStart);

// Also patch openBlog to use the SEO tags
newCode = newCode.replace(
  /document\.getElementById\('single-blog-hero-bg'\)\.style\.backgroundImage = `url\('\$\{blog\.image\}'\)`;/g,
  'document.getElementById(\'single-blog-hero-bg\').style.backgroundImage = `url(\'${blog.image}\')`;\n  document.getElementById(\'single-blog-hero-bg\').setAttribute(\'aria-label\', blog.image_alt || blog.title);\n  document.getElementById(\'single-blog-hero-bg\').setAttribute(\'role\', \'img\');'
);

// We need to fix the syntax error causing the website to completely break. The location filter also broke because this whole file was throwing a SyntaxError.
fs.writeFileSync('js/main.js', newCode);
console.log('Successfully repaired main.js');
