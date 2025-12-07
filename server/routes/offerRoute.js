
import express from 'express';
import { Offer } from '../models/Offer.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await Offer.find();
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});
router.post('/', protect, async (req, res) => {
  try {
    const newItem = new Offer(req.body);
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) { res.status(400).json({ error: err.message }); }
});
router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: err.message }); }
});
router.delete('/:id', protect, async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
