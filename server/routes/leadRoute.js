
import express from 'express';
import { Lead, validateLead } from '../models/Lead.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validateLead(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  try {
    const lead = new Lead({ ...req.body });
    await lead.save();
    res.status(201).send({ id: lead._id, message: 'Lead captured successfully' });
  } catch (err) {
    res.status(500).send({ error: 'Server error' });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const leads = await Lead.find().sort('-createdAt');
    res.send(leads);
  } catch (err) {
    res.status(500).send({ error: 'Server error' });
  }
});

router.put('/:id', protect, async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(lead);
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        await Lead.findByIdAndDelete(req.params.id);
        res.json({message: "Deleted"});
    } catch(err) { res.status(500).json({error: err.message}); }
});

export default router;
