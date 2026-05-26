const express = require('express');
const path = require('path');
const db = require('./db');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// SPA fallback — serve index.html for all non-API GET routes
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Seed data on first run
db.seed();

app.listen(PORT, () => {
  console.log(`[Server] Blog running at http://localhost:${PORT}`);
});
