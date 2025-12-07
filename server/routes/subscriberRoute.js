
import express from 'express';
import { Subscriber } from '../models/Subscriber.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    if(!email) return res.status(400).json({error: "Email required"});
    const sub = new Subscriber({ email });
    await sub.save();
    res.status(201).json(sub);
  } catch(err) {
    res.status(400).json({error: err.message});
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const subs = await Subscriber.find().sort('-date');
    res.json(subs);
  } catch(err) { res.status(500).json({error: err.message}); }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        await Subscriber.findByIdAndDelete(req.params.id);
        res.json({message: "Deleted"});
    } catch(err) { res.status(500).json({error: err.message}); }
});

export default router;
