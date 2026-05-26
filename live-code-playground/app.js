// CodePlay — Live Code Playground
// 3-panel editor (HTML/CSS/JS) with live preview, console, templates, share

const $html = document.getElementById('editor-html');
const $css = document.getElementById('editor-css');
const $js = document.getElementById('editor-js');
const $preview = document.getElementById('preview-frame');
const $console = document.getElementById('console-panel');
const $toast = document.getElementById('toast');

const AUTOSAVE_KEY = 'codeplay_state';

// --- Templates ---

const TEMPLATES = {
  hello: {
    html: '<h1>Hello, World!</h1>\n<p>Start editing to see changes live.</p>',
    css: 'body {\n  font-family: system-ui, sans-serif;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  min-height: 100vh;\n  margin: 0;\n  background: #1a1a2e;\n  color: #e0e0e0;\n}\nh1 { color: #e94560; font-size: 2.5rem; }',
    js: 'console.log("Hello from CodePlay!");\nconsole.log("Try editing the panels above ↑");'
  },
  counter: {
    html: '<div class="counter-app">\n  <h2>Counter</h2>\n  <p class="count" id="count">0</p>\n  <div class="buttons">\n    <button onclick="change(-1)">-</button>\n    <button onclick="change(1)">+</button>\n  </div>\n</div>',
    css: 'body { margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; font-family:system-ui; background:#0f172a; color:#e2e8f0; }\n.counter-app { text-align:center; }\n.count { font-size:4rem; font-weight:700; color:#38bdf8; margin:20px 0; }\nbutton { font-size:1.5rem; width:60px; height:60px; border-radius:12px; border:none; background:#334155; color:#e2e8f0; cursor:pointer; margin:0 8px; }\nbutton:hover { background:#475569; }',
    js: 'let count = 0;\nfunction change(delta) {\n  count += delta;\n  document.getElementById("count").textContent = count;\n  console.log(`Count: ${count}`);\n}'
  },
  todo: {
    html: '<div class="todo-app">\n  <h2>TODO</h2>\n  <div class="input-row">\n    <input id="todo-input" type="text" placeholder="Add a task..." />\n    <button onclick="addTodo()">+</button>\n  </div>\n  <ul id="todo-list"></ul>\n</div>',
    css: 'body { margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; font-family:system-ui; background:#0f172a; color:#e2e8f0; }\n.todo-app { width:360px; background:#1e293b; border-radius:12px; padding:24px; }\nh2 { margin-top:0; color:#a78bfa; }\n.input-row { display:flex; gap:8px; margin-bottom:16px; }\ninput { flex:1; padding:8px 12px; border-radius:8px; border:1px solid #334155; background:#0f172a; color:#e2e8f0; outline:none; }\ninput:focus { border-color:#a78bfa; }\nbutton { padding:8px 16px; border-radius:8px; border:none; background:#a78bfa; color:#fff; cursor:pointer; font-weight:600; }\nul { list-style:none; padding:0; }\nli { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #334155; }\nli button { background:none; color:#f87171; font-size:1.2rem; padding:0 4px; }',
    js: 'function addTodo() {\n  const input = document.getElementById("todo-input");\n  const text = input.value.trim();\n  if (!text) return;\n  const li = document.createElement("li");\n  li.innerHTML = `<span>${text}</span><button onclick="this.parentElement.remove()">×</button>`;\n  document.getElementById("todo-list").appendChild(li);\n  input.value = "";\n  input.focus();\n  console.log(`Added: ${text}`);\n}'
  },
  canvas: {
    html: '<canvas id="canvas"></canvas>',
    css: 'body { margin:0; overflow:hidden; background:#0f172a; }\ncanvas { display:block; }',
    js: 'const c = document.getElementById("canvas");\nconst ctx = c.getContext("2d");\n\nfunction resize() {\n  c.width = window.innerWidth;\n  c.height = window.innerHeight;\n}\nresize();\nwindow.addEventListener("resize", resize);\n\nconst particles = [];\nfor (let i = 0; i < 60; i++) {\n  particles.push({\n    x: Math.random() * c.width,\n    y: Math.random() * c.height,\n    r: Math.random() * 3 + 1,\n    vx: (Math.random() - 0.5) * 2,\n    vy: (Math.random() - 0.5) * 2,\n    hue: Math.random() * 360\n  });\n}\n\nfunction draw() {\n  ctx.fillStyle = "rgba(15, 23, 42, 0.15)";\n  ctx.fillRect(0, 0, c.width, c.height);\n  particles.forEach(p => {\n    p.x += p.vx;\n    p.y += p.vy;\n    if (p.x < 0) p.x = c.width;\n    if (p.x > c.width) p.x = 0;\n    if (p.y < 0) p.y = c.height;\n    if (p.y > c.height) p.y = 0;\n    ctx.beginPath();\n    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);\n    ctx.fillStyle = `hsl(${p.hue}, 80%, 65%)`;\n    ctx.fill();\n  });\n  requestAnimationFrame(draw);\n}\ndraw();\nconsole.log("Canvas animation started — 60 particles");'
  },
  fetch: {
    html: '<div class="app">\n  <h2>API Demo</h2>\n  <button onclick="fetchPosts()">Fetch Posts</button>\n  <div id="output"></div>\n</div>',
    css: 'body { margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; font-family:system-ui; background:#0f172a; color:#e2e8f0; }\n.app { width:500px; text-align:center; }\nh2 { color:#38bdf8; }\nbutton { padding:10px 24px; border-radius:8px; border:none; background:#38bdf8; color:#0f172a; font-weight:600; cursor:pointer; margin:16px 0; }\nbutton:hover { background:#7dd3fc; }\n#output { text-align:left; }\n.post { background:#1e293b; padding:12px 16px; border-radius:8px; margin:8px 0; }\n.post h3 { margin:0 0 4px; font-size:1rem; color:#e2e8f0; }\n.post p { margin:0; font-size:0.85rem; color:#94a3b8; }',
    js: 'async function fetchPosts() {\n  const out = document.getElementById("output");\n  out.innerHTML = "<p style=\'color:#94a3b8\'>Loading...</p>";\n  try {\n    const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");\n    const posts = await res.json();\n    console.log(`Fetched ${posts.length} posts`);\n    out.innerHTML = posts.map(p =>\n      `<div class="post"><h3>${p.title}</h3><p>${p.body.slice(0,80)}...</p></div>`\n    ).join("");\n  } catch(e) {\n    console.error(e.message);\n    out.innerHTML = `<p style="color:#f87171">Error: ${e.message}</p>`;\n  }\n}\nconsole.log("Click the button to fetch data");'
  }
};

// --- State ---

function loadState() {
  try {
    const saved = localStorage.getItem(AUTOSAVE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

function saveState() {
  localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({
    html: $html.value,
    css: $css.value,
    js: $js.value
  }));
}

// --- Init editors ---

function initEditors() {
  // Try URL hash first, then localStorage, then default
  const hash = window.location.hash.slice(1);
  if (hash) {
    try {
      const decoded = JSON.parse(decodeURIComponent(hash));
      $html.value = decoded.html || '';
      $css.value = decoded.css || '';
      $js.value = decoded.js || '';
      return;
    } catch {}
  }

  const saved = loadState();
  if (saved) {
    $html.value = saved.html;
    $css.value = saved.css;
    $js.value = saved.js;
  } else {
    loadTemplate('hello');
  }
}

function loadTemplate(name) {
  const t = TEMPLATES[name];
  if (!t) return;
  $html.value = t.html;
  $css.value = t.css;
  $js.value = t.js;
  run();
  saveState();
  showToast('Template: ' + name);
}

// --- Preview ---

let debounceTimer;

function run() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const doc = buildDocument();
    const blob = new Blob([doc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    $preview.src = url;
    // Clean up old blob after load
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $console.innerHTML = '<div class="console-entry" style="color:var(--muted);">// Console output appears here...</div>';
    saveState();
  }, 250);
}

function buildDocument() {
  const html = $html.value;
  const css = $css.value;
  const js = $js.value;

  // Script to capture console
  const capture = `
<script>
(function() {
  var orig = {};
  ['log','error','warn','info'].forEach(function(m) {
    orig[m] = console[m];
    console[m] = function() {
      var args = Array.from(arguments).map(function(a) {
        try { return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a); }
        catch(e) { return String(a); }
      }).join(' ');
      parent.postMessage({ type: 'console', method: m, text: args, ts: new Date().toLocaleTimeString() }, '*');
      orig[m].apply(console, arguments);
    };
  });
  window.onerror = function(msg, src, line, col, err) {
    parent.postMessage({ type: 'console', method: 'error', text: msg + ' (line ' + line + ')', ts: new Date().toLocaleTimeString() }, '*');
    return false;
  };
})();
</script>`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>${css}</style>
${capture}
</head>
<body>${html}
<script>${js}<\/script>
</body>
</html>`;
}

// --- Console capture ---

window.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'console') {
    const { method, text, ts } = e.data;
    if ($console.querySelector('.placeholder')) {
      $console.innerHTML = '';
    }
    const entry = document.createElement('div');
    entry.className = 'console-entry console-' + (method === 'error' ? 'error' : method === 'warn' ? 'warn' : 'log');
    entry.innerHTML = `<span class="ts">${ts}</span>${escHtml(text)}`;
    $console.appendChild(entry);
    if ($console.children.length > 50) $console.firstChild.remove();
    $console.scrollTop = $console.scrollHeight;
  }
});

// --- Resize handles ---

function initResizers() {
  const editorsPane = document.getElementById('editors-pane');
  const outputPane = document.getElementById('output-pane');
  const panels = [
    document.getElementById('panel-html'),
    document.getElementById('panel-css'),
    document.getElementById('panel-js')
  ];

  // Vertical gutters (between editor panels)
  document.querySelectorAll('.gutter-v').forEach((gutter, i) => {
    let startX, startWidths;
    gutter.addEventListener('mousedown', (e) => {
      e.preventDefault();
      gutter.classList.add('dragging');
      startX = e.clientX;
      startWidths = panels.map(p => p.getBoundingClientRect().width);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', (e) => {
      if (!gutter.classList.contains('dragging')) return;
      const dx = e.clientX - startX;
      const total = startWidths.reduce((a, b) => a + b, 0);
      let w0 = startWidths[i] + dx;
      let w1 = startWidths[i + 1] - dx;
      const minW = 150;
      if (w0 < minW) { w1 -= (minW - w0); w0 = minW; }
      if (w1 < minW) { w0 -= (minW - w1); w1 = minW; }
      panels[i].style.flex = 'none';
      panels[i].style.width = (w0 / total * 100) + '%';
      panels[i + 1].style.flex = 'none';
      panels[i + 1].style.width = (w1 / total * 100) + '%';
    });
  });

  // Horizontal gutter (between editors and output)
  const gutterH = document.getElementById('gutter-h');
  let hStartY, hStartHeight;
  gutterH.addEventListener('mousedown', (e) => {
    e.preventDefault();
    gutterH.classList.add('dragging');
    hStartY = e.clientY;
    hStartHeight = editorsPane.getBoundingClientRect().height;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  });
  document.addEventListener('mousemove', (e) => {
    if (!gutterH.classList.contains('dragging')) return;
    const dy = e.clientY - hStartY;
    const containerH = document.getElementById('main-container').getBoundingClientRect().height;
    const newEdH = hStartHeight + dy;
    const minH = 120;
    if (newEdH < minH || (containerH - newEdH) < minH) return;
    editorsPane.style.flex = 'none';
    editorsPane.style.height = newEdH + 'px';
    outputPane.style.flex = '1';
  });
}

document.addEventListener('mouseup', () => {
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
  document.querySelectorAll('.gutter').forEach(g => g.classList.remove('dragging'));
});

// --- Console toggle ---

document.getElementById('btn-console-toggle').addEventListener('click', () => {
  $console.classList.toggle('collapsed');
  const btn = document.getElementById('btn-console-toggle');
  btn.textContent = $console.classList.contains('collapsed') ? 'Console ▸' : 'Console ▾';
});

// --- Toolbar actions ---

document.getElementById('btn-run').addEventListener('click', run);

document.getElementById('btn-download').addEventListener('click', () => {
  const doc = buildDocument();
  const blob = new Blob([doc], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'codeplay.html';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Downloaded codeplay.html');
});

document.getElementById('btn-share').addEventListener('click', () => {
  const data = JSON.stringify({
    html: $html.value,
    css: $css.value,
    js: $js.value
  });
  const url = window.location.origin + window.location.pathname + '#' + encodeURIComponent(data);
  navigator.clipboard.writeText(url).then(() => {
    showToast('Share URL copied to clipboard!');
  }).catch(() => {
    prompt('Copy this URL:', url);
  });
});

document.getElementById('btn-reset').addEventListener('click', () => {
  if (confirm('Reset all code to the Hello World template?')) {
    loadTemplate('hello');
  }
});

document.getElementById('template-select').addEventListener('change', (e) => {
  const name = e.target.value;
  if (name && TEMPLATES[name]) {
    if (confirm('Load template "' + name + '"? This will replace current code.')) {
      loadTemplate(name);
    }
  }
  e.target.value = '';
});

// --- Input handlers ---

[$html, $css, $js].forEach(el => {
  el.addEventListener('input', run);
  el.addEventListener('keydown', (e) => {
    // Tab to spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = el.selectionStart;
      const end = el.selectionEnd;
      el.value = el.value.substring(0, start) + '  ' + el.value.substring(end);
      el.selectionStart = el.selectionEnd = start + 2;
      run();
    }
    // Ctrl+S to run
    if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      run();
      showToast('Preview updated');
    }
  });
});

// --- Toast ---

function showToast(msg) {
  $toast.textContent = msg;
  $toast.classList.add('show');
  clearTimeout($toast._timeout);
  $toast._timeout = setTimeout(() => $toast.classList.remove('show'), 2000);
}

// --- Helpers ---

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// --- Start ---

initResizers();
initEditors();
run();
