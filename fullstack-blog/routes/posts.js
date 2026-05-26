const { Router } = require('express');
const db = require('../db');
const { authRequired } = require('../middleware/auth');

const router = Router();

// List posts
router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
  const tag = req.query.tag || null;
  res.json(db.listPosts({ page, limit, tag }));
});

// Get single post
router.get('/:id', (req, res) => {
  const post = db.getPostById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

// Create post (auth)
router.post('/', authRequired, (req, res) => {
  const { title, content, summary, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  const post = db.createPost({ title, content, summary, tags, userId: req.userId });
  res.status(201).json(post);
});

// Update post (auth)
router.put('/:id', authRequired, (req, res) => {
  const post = db.getPostById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (post.user_id !== req.userId) {
    return res.status(403).json({ error: 'You can only edit your own posts' });
  }
  const updated = db.updatePost(req.params.id, req.body);
  res.json(updated);
});

// Delete post (auth)
router.delete('/:id', authRequired, (req, res) => {
  const post = db.getPostById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (post.user_id !== req.userId) {
    return res.status(403).json({ error: 'You can only delete your own posts' });
  }
  db.deletePost(req.params.id);
  res.json({ success: true });
});

// List comments for a post
router.get('/:id/comments', (req, res) => {
  const post = db.getPostById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(db.listComments(req.params.id));
});

// Add comment to a post
router.post('/:id/comments', (req, res) => {
  const post = db.getPostById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  const { author, content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Comment content is required' });
  }
  const comment = db.createComment(req.params.id, { author, content });
  res.status(201).json(comment);
});

module.exports = router;
