
import express from 'express';
import { HeroContent } from '../models/HeroContent.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const hero = await HeroContent.findOne({ isCurrent: true }) || await HeroContent.findOne();
    res.json(hero || {});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    let hero = await HeroContent.findOne({ isCurrent: true });
    if (hero) {
      Object.assign(hero, req.body);
      await hero.save();
    } else {
      hero = new HeroContent({ ...req.body, isCurrent: true });
      await hero.save();
    }
    res.json(hero);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

export default router;
