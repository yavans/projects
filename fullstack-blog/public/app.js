// FullStack Blog — Vanilla JS SPA
// Hash router, JWT auth, API client, page renderers

const App = {
  token: localStorage.getItem('blog_token'),
  user: JSON.parse(localStorage.getItem('blog_user') || 'null')
};

// --- Router ---

function route() {
  const hash = window.location.hash.slice(1) || '/';
  const [path, qs] = hash.split('?');
  const params = {};
  if (qs) {
    qs.split('&').forEach(p => {
      const [k, v] = p.split('=');
      params[decodeURIComponent(k)] = decodeURIComponent(v || '');
    });
  }

  const match = (pattern) => {
    const keys = [];
    const regexStr = pattern.replace(/:(\w+)/g, (_, k) => { keys.push(k); return '([^/]+)'; });
    const m = path.match(new RegExp('^' + regexStr + '$'));
    if (m) {
      const vals = {};
      keys.forEach((k, i) => { vals[k] = m[i + 1]; });
      return vals;
    }
    return null;
  };

  updateNav();

  // Route matching
  if (path === '/') return renderPostList(params);
  if (path === '/login') return renderLogin();
  if (path === '/register') return renderRegister();
  if (path === '/admin') return renderAdmin();
  if (path === '/admin/new') return renderEditor(null);

  let vals = match('/post/:id');
  if (vals) return renderPost(vals.id);

  vals = match('/admin/edit/:id');
  if (vals) return renderEditor(vals.id);

  render404();
}

window.addEventListener('hashchange', route);
window.addEventListener('load', route);

// --- API Client ---

async function api(method, url, body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (App.token) opts.headers['Authorization'] = 'Bearer ' + App.token;
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function apiGet(url) { return api('GET', url); }
function apiPost(url, body) { return api('POST', url, body); }
function apiPut(url, body) { return api('PUT', url, body); }
function apiDelete(url) { return api('DELETE', url); }

// --- Auth ---

App.login = async () => {
  const username = document.getElementById('login-user').value.trim();
  const password = document.getElementById('login-pass').value;
  if (!username || !password) return toast('Please fill in all fields', 'error');
  try {
    const data = await apiPost('/api/auth/login', { username, password });
    App.token = data.token;
    App.user = data.user;
    localStorage.setItem('blog_token', data.token);
    localStorage.setItem('blog_user', JSON.stringify(data.user));
    updateNav();
    toast('Logged in as ' + data.user.username, 'success');
    window.location.hash = '#/admin';
  } catch (e) {
    toast(e.message, 'error');
  }
};

App.register = async () => {
  const username = document.getElementById('reg-user').value.trim();
  const password = document.getElementById('reg-pass').value;
  if (!username || !password) return toast('Please fill in all fields', 'error');
  if (username.length < 3) return toast('Username must be at least 3 characters', 'error');
  if (password.length < 6) return toast('Password must be at least 6 characters', 'error');
  try {
    const data = await apiPost('/api/auth/register', { username, password });
    App.token = data.token;
    App.user = data.user;
    localStorage.setItem('blog_token', data.token);
    localStorage.setItem('blog_user', JSON.stringify(data.user));
    updateNav();
    toast('Account created! Welcome, ' + data.user.username, 'success');
    window.location.hash = '#/';
  } catch (e) {
    toast(e.message, 'error');
  }
};

App.logout = () => {
  App.token = null;
  App.user = null;
  localStorage.removeItem('blog_token');
  localStorage.removeItem('blog_user');
  updateNav();
  toast('Logged out', 'success');
  window.location.hash = '#/';
};

function updateNav() {
  const login = document.getElementById('nav-login');
  const register = document.getElementById('nav-register');
  const logout = document.getElementById('nav-logout');
  const admin = document.querySelector('.admin-link');

  if (App.user) {
    if (login) login.style.display = 'none';
    if (register) register.style.display = 'none';
    if (logout) logout.style.display = '';
    if (admin) admin.style.display = '';
  } else {
    if (login) login.style.display = '';
    if (register) register.style.display = '';
    if (logout) logout.style.display = 'none';
    if (admin) admin.style.display = 'none';
  }
}

// --- Toast ---

function toast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => { el.remove(); }, 3000);
}

// --- Page Renderers ---

async function renderPostList(params) {
  const page = parseInt(params.page) || 1;
  const main = document.getElementById('app-main');

  try {
    const data = await apiGet('/api/posts?page=' + page + '&limit=10');
    let html = '<div class="post-list">';
    if (data.items.length === 0) {
      html += '<div class="empty-state"><p>No posts yet.</p></div>';
    }
    data.items.forEach(p => {
      const tags = p.tags ? p.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      html += `
        <div class="post-card" onclick="window.location.hash='#/post/${p.id}'">
          <h2>${esc(p.title)}</h2>
          <div class="meta">
            <span>${esc(p.author)}</span>
            <span>${fmtDate(p.created_at)}</span>
          </div>
          <p class="summary">${esc(p.summary || '')}</p>
          ${tags.length ? '<div class="tags">' + tags.map(t => `<span class="tag">${esc(t)}</span>`).join('') + '</div>' : ''}
        </div>`;
    });
    html += '</div>';

    // Pagination
    if (data.totalPages > 1) {
      html += '<div class="pagination">';
      html += `<button ${page <= 1 ? 'disabled' : ''} onclick="window.location.hash='#/?page=${page - 1}'">Prev</button>`;
      for (let i = 1; i <= data.totalPages; i++) {
        html += `<button class="${i === page ? 'active' : ''}" onclick="window.location.hash='#/?page=${i}'">${i}</button>`;
      }
      html += `<button ${page >= data.totalPages ? 'disabled' : ''} onclick="window.location.hash='#/?page=${page + 1}'">Next</button>`;
      html += '</div>';
    }

    main.innerHTML = html;
  } catch (e) {
    main.innerHTML = '<div class="empty-state"><p>Failed to load posts.</p></div>';
  }
}

async function renderPost(id) {
  const main = document.getElementById('app-main');
  main.innerHTML = '<div class="empty-state"><p>Loading...</p></div>';

  try {
    const post = await apiGet('/api/posts/' + id);
    const comments = await apiGet('/api/posts/' + id + '/comments');
    const tags = post.tags ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

    let html = `
      <a href="#/" class="back-link">&larr; Back to posts</a>
      <div class="post-full">
        <h1>${esc(post.title)}</h1>
        <div class="meta">
          <span>By ${esc(post.author)}</span>
          <span>${fmtDate(post.created_at)}</span>
          ${tags.length ? ' · ' + tags.map(t => `<span class="tag">${esc(t)}</span>`).join(' ') : ''}
        </div>
        <div class="post-content">${marked.parse(post.content)}</div>
      </div>

      <div class="comments-section">
        <h3>Comments (${comments.length})</h3>`;

    comments.forEach(c => {
      html += `
        <div class="comment">
          <span class="c-author">${esc(c.author)}</span>
          <span class="c-time">${fmtDate(c.created_at)}</span>
          <p class="c-content">${esc(c.content)}</p>
        </div>`;
    });

    html += `
        <div class="comment-form">
          <input type="text" id="c-author" placeholder="Your name (optional)" maxlength="50" />
          <textarea id="c-content" placeholder="Write a comment..." maxlength="1000"></textarea>
          <button class="btn btn-primary" onclick="App.addComment('${post.id}')">Submit Comment</button>
        </div>
      </div>`;

    main.innerHTML = html;
  } catch (e) {
    main.innerHTML = '<div class="empty-state"><p>Post not found.</p></div>';
  }
}

App.addComment = async (postId) => {
  const author = document.getElementById('c-author').value.trim();
  const content = document.getElementById('c-content').value.trim();
  if (!content) return toast('Please enter a comment', 'error');
  try {
    await apiPost('/api/posts/' + postId + '/comments', { author, content });
    toast('Comment added', 'success');
    renderPost(postId);
  } catch (e) {
    toast(e.message, 'error');
  }
};

function renderLogin() {
  document.getElementById('app-main').innerHTML = `
    <div class="form-card">
      <h2>Login</h2>
      <div class="form-group">
        <label>Username</label>
        <input type="text" id="login-user" placeholder="admin" />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="login-pass" placeholder="admin123" />
      </div>
      <button class="btn btn-primary btn-block" onclick="App.login()">Login</button>
    </div>`;
}

function renderRegister() {
  document.getElementById('app-main').innerHTML = `
    <div class="form-card">
      <h2>Register</h2>
      <div class="form-group">
        <label>Username</label>
        <input type="text" id="reg-user" placeholder="Choose a username" maxlength="30" />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="reg-pass" placeholder="At least 6 characters" />
      </div>
      <button class="btn btn-primary btn-block" onclick="App.register()">Create Account</button>
    </div>`;
}

async function renderAdmin() {
  if (!App.user) return renderLogin();
  const main = document.getElementById('app-main');

  try {
    const data = await apiGet('/api/posts?limit=50');
    let html = `
      <div class="admin-header">
        <h2>Admin Dashboard</h2>
        <a href="#/admin/new" class="btn btn-primary">+ New Post</a>
      </div>`;

    if (data.items.length === 0) {
      html += '<div class="empty-state"><p>No posts. Create your first post!</p></div>';
    } else {
      html += '<table class="post-table"><thead><tr><th>Title</th><th>Author</th><th>Date</th><th>Actions</th></tr></thead><tbody>';
      data.items.forEach(p => {
        html += `
          <tr>
            <td><strong>${esc(p.title)}</strong></td>
            <td>${esc(p.author)}</td>
            <td>${fmtDate(p.created_at)}</td>
            <td class="actions">
              <a href="#/admin/edit/${p.id}" class="btn btn-ghost btn-sm">Edit</a>
              <button class="btn btn-danger btn-sm" onclick="App.deletePost('${p.id}')">Delete</button>
            </td>
          </tr>`;
      });
      html += '</tbody></table>';
    }

    main.innerHTML = html;
  } catch (e) {
    main.innerHTML = '<div class="empty-state"><p>Access denied. Please login.</p></div>';
  }
}

App.deletePost = async (id) => {
  if (!confirm('Delete this post?')) return;
  try {
    await apiDelete('/api/posts/' + id);
    toast('Post deleted', 'success');
    renderAdmin();
  } catch (e) {
    toast(e.message, 'error');
  }
};

function renderEditor(id) {
  if (!App.user) return renderLogin();
  const main = document.getElementById('app-main');

  if (id) {
    apiGet('/api/posts/' + id).then(post => {
      main.innerHTML = editorForm('Edit Post', post, id);
    }).catch(() => {
      main.innerHTML = '<div class="empty-state"><p>Post not found.</p></div>';
    });
  } else {
    main.innerHTML = editorForm('New Post', { title: '', content: '', summary: '', tags: '' }, null);
  }
}

function editorForm(heading, p, editId) {
  return `
    <form class="form-card" style="max-width:700px;" onsubmit="return false;">
      <h2>${heading}</h2>
      <div class="form-group">
        <label>Title</label>
        <input type="text" id="post-title" value="${escAttr(p.title)}" maxlength="200" />
      </div>
      <div class="form-group">
        <label>Content (Markdown)</label>
        <textarea id="post-content">${esc(p.content)}</textarea>
      </div>
      <div class="form-group">
        <label>Summary</label>
        <input type="text" id="post-summary" value="${escAttr(p.summary || '')}" maxlength="300" />
      </div>
      <div class="form-group">
        <label>Tags (comma separated)</label>
        <input type="text" id="post-tags" value="${escAttr(p.tags || '')}" placeholder="javascript, backend" />
      </div>
      <div class="form-actions">
        <button class="btn btn-primary" onclick="App.savePost('${editId || ''}')">${editId ? 'Update' : 'Publish'}</button>
        <a href="#/admin" class="btn btn-ghost">Cancel</a>
      </div>
    </form>`;
}

App.savePost = async (id) => {
  const title = document.getElementById('post-title').value.trim();
  const content = document.getElementById('post-content').value.trim();
  const summary = document.getElementById('post-summary').value.trim();
  const tags = document.getElementById('post-tags').value.trim();

  if (!title || !content) return toast('Title and content are required', 'error');

  try {
    if (id) {
      await apiPut('/api/posts/' + id, { title, content, summary, tags });
      toast('Post updated', 'success');
    } else {
      await apiPost('/api/posts', { title, content, summary, tags });
      toast('Post published', 'success');
    }
    window.location.hash = '#/admin';
  } catch (e) {
    toast(e.message, 'error');
  }
};

function render404() {
  document.getElementById('app-main').innerHTML = `
    <div class="empty-state" style="padding:80px 20px;">
      <h2 style="font-size:3rem;color:var(--primary);">404</h2>
      <p>Page not found.</p>
      <a href="#/" class="btn btn-primary" style="margin-top:16px;">Go Home</a>
    </div>`;
}

// --- Helpers ---

function esc(s) {
  if (!s) return '';
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function escAttr(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
