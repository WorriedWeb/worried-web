
import express from 'express';
import { BlogPost, validateBlogPost } from '../models/BlogPost.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find().sort('-publishedAt');
    res.send(posts);
  } catch (err) {
    res.status(500).send({ error: 'Server error' });
  }
});

router.post('/', protect, async (req, res) => {
  const { error } = validateBlogPost(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });
  
  try {
    const post = new BlogPost(req.body);
    await post.save();
    res.status(201).send(post);
  } catch (err) {
    res.status(500).send({ error: 'Server error' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
