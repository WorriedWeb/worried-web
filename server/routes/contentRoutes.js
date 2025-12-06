
import express from 'express';
import { Service } from '../models/Service.js';
import { Testimonial } from '../models/Testimonial.js';
import { TeamMember } from '../models/TeamMember.js';
import { FAQ } from '../models/FAQ.js';
import { Offer } from '../models/Offer.js';
import { HeroContent } from '../models/HeroContent.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Generic CRUD helper
const createCrud = (Model) => ({
  getAll: async (req, res) => {
    try {
      const items = await Model.find();
      res.json(items);
    } catch (err) { res.status(500).json({ error: err.message }); }
  },
  create: async (req, res) => {
    try {
      const newItem = new Model(req.body);
      const saved = await newItem.save();
      res.status(201).json(saved);
    } catch (err) { res.status(400).json({ error: err.message }); }
  },
  update: async (req, res) => {
    try {
      const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updated);
    } catch (err) { res.status(400).json({ error: err.message }); }
  },
  delete: async (req, res) => {
    try {
      await Model.findByIdAndDelete(req.params.id);
      res.json({ message: 'Deleted successfully' });
    } catch (err) { res.status(500).json({ error: err.message }); }
  }
});

const serviceCrud = createCrud(Service);
router.get('/services', serviceCrud.getAll);
router.post('/services', protect, serviceCrud.create);
router.put('/services/:id', protect, serviceCrud.update);
router.delete('/services/:id', protect, serviceCrud.delete);

const testimonialCrud = createCrud(Testimonial);
router.get('/testimonials', testimonialCrud.getAll);
router.post('/testimonials', protect, testimonialCrud.create);
router.put('/testimonials/:id', protect, testimonialCrud.update);
router.delete('/testimonials/:id', protect, testimonialCrud.delete);

const teamCrud = createCrud(TeamMember);
router.get('/team', teamCrud.getAll);
router.post('/team', protect, teamCrud.create);
router.put('/team/:id', protect, teamCrud.update);
router.delete('/team/:id', protect, teamCrud.delete);

const faqCrud = createCrud(FAQ);
router.get('/faqs', faqCrud.getAll);
router.post('/faqs', protect, faqCrud.create);
router.put('/faqs/:id', protect, faqCrud.update);
router.delete('/faqs/:id', protect, faqCrud.delete);

const offerCrud = createCrud(Offer);
router.get('/offers', offerCrud.getAll);
router.post('/offers', protect, offerCrud.create);
router.put('/offers/:id', protect, offerCrud.update);
router.delete('/offers/:id', protect, offerCrud.delete);

// Hero Content
router.get('/hero', async (req, res) => {
  try {
    const hero = await HeroContent.findOne({ isCurrent: true }) || await HeroContent.findOne();
    res.json(hero || {});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/hero', protect, async (req, res) => {
  try {
    // Upsert logic for current hero
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

export const contentRoutes = router;
