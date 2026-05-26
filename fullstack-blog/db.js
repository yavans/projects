// JSON file-based database — zero native dependencies
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, 'data.json');

function uid() {
  return Date.now().toString(36) + crypto.randomBytes(4).toString('hex');
}

function now() {
  return new Date().toISOString();
}

let data = { users: [], posts: [], comments: [] };

function load() {
  try {
    if (fs.existsSync(DB_PATH)) {
      data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    }
  } catch (e) {
    data = { users: [], posts: [], comments: [] };
  }
}

function save() {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// --- Users ---

function findUserByUsername(username) {
  return data.users.find(u => u.username === username);
}

function findUserById(id) {
  return data.users.find(u => u.id === id);
}

function createUser(username, hashedPassword) {
  const user = {
    id: uid(),
    username,
    password: hashedPassword,
    created_at: now()
  };
  data.users.push(user);
  save();
  return { id: user.id, username: user.username, created_at: user.created_at };
}

// --- Posts ---

function listPosts({ page = 1, limit = 10, tag } = {}) {
  let posts = [...data.posts].sort((a, b) => b.created_at.localeCompare(a.created_at));
  if (tag) {
    posts = posts.filter(p => p.tags && p.tags.split(',').map(t => t.trim()).includes(tag));
  }
  const total = posts.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const items = posts.slice(start, start + limit).map(p => ({
    id: p.id,
    title: p.title,
    summary: p.summary,
    tags: p.tags,
    author: p.author,
    created_at: p.created_at
  }));
  return { items, total, page, totalPages };
}

function getPostById(id) {
  const post = data.posts.find(p => p.id === id);
  if (!post) return null;
  return { ...post };
}

function createPost({ title, content, summary, tags, userId }) {
  const user = findUserById(userId);
  const post = {
    id: uid(),
    title,
    content,
    summary: summary || '',
    tags: tags || '',
    user_id: userId,
    author: user ? user.username : 'unknown',
    created_at: now(),
    updated_at: now()
  };
  data.posts.push(post);
  save();
  return post;
}

function updatePost(id, { title, content, summary, tags }) {
  const idx = data.posts.findIndex(p => p.id === id);
  if (idx === -1) return null;
  if (title !== undefined) data.posts[idx].title = title;
  if (content !== undefined) data.posts[idx].content = content;
  if (summary !== undefined) data.posts[idx].summary = summary;
  if (tags !== undefined) data.posts[idx].tags = tags;
  data.posts[idx].updated_at = now();
  save();
  return data.posts[idx];
}

function deletePost(id) {
  const idx = data.posts.findIndex(p => p.id === id);
  if (idx === -1) return false;
  data.posts.splice(idx, 1);
  // Cascade delete comments
  data.comments = data.comments.filter(c => c.post_id !== id);
  save();
  return true;
}

// --- Comments ---

function listComments(postId) {
  return data.comments
    .filter(c => c.post_id === postId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}

function createComment(postId, { author, content }) {
  const comment = {
    id: uid(),
    post_id: postId,
    author: author || 'Anonymous',
    content,
    created_at: now()
  };
  data.comments.push(comment);
  save();
  return comment;
}

// --- Seed ---

function seed() {
  if (data.posts.length > 0) return;
  const admin = createUser('admin', require('bcryptjs').hashSync('admin123', 10));
  const posts = [
    {
      title: 'Getting Started with Node.js',
      content: `# Getting Started with Node.js\n\nNode.js is a **JavaScript runtime** built on Chrome\'s V8 engine.\n\n## Why Node.js?\n\n- Non-blocking I/O\n- Single-threaded event loop\n- NPM ecosystem\n\n\`\`\`js\nconst http = require(\'http\');\nhttp.createServer((req, res) => {\n  res.end(\'Hello World\');\n}).listen(3000);\n\`\`\`\n\nStart building today!`,
      summary: 'A beginner-friendly introduction to Node.js and its core concepts.',
      tags: 'nodejs, javascript, backend'
    },
    {
      title: 'Understanding JWT Authentication',
      content: `# Understanding JWT Authentication\n\n**JSON Web Tokens** provide a stateless way to handle auth.\n\n## How it works\n\n1. Client sends credentials\n2. Server validates and returns a signed JWT\n3. Client includes JWT in subsequent requests\n4. Server verifies the signature\n\n> JWTs are *not encrypted* — don\'t store secrets in them!`,
      summary: 'Learn how JSON Web Tokens work and how to implement them securely.',
      tags: 'security, jwt, backend'
    },
    {
      title: 'Building SPAs with Vanilla JavaScript',
      content: `# Building SPAs with Vanilla JavaScript\n\nYou don\'t need React or Vue to build a single-page application.\n\n## Core Ingredients\n\n1. **Hash-based routing** — listen to \`hashchange\` events\n2. **Template rendering** — generate HTML from data\n3. **State management** — keep it simple with a plain object\n\nThis blog itself is a vanilla JS SPA!`,
      summary: 'No framework? No problem. Build a single-page app with plain JavaScript.',
      tags: 'javascript, frontend, spa'
    }
  ];
  posts.forEach(p => {
    createPost({ ...p, userId: admin.id });
  });
  console.log('[DB] Seeded 3 sample posts + admin user (admin / admin123)');
}

// Init
load();

module.exports = {
  findUserByUsername,
  findUserById,
  createUser,
  listPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  listComments,
  createComment,
  seed
};
