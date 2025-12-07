
import express from 'express';
import { Contact, validateContact } from '../models/Contact.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validateContact(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  try {
    const contact = new Contact({
      ...req.body,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    await contact.save();
    res.status(201).send({ id: contact._id, message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).send({ error: 'Server error' });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const messages = await Contact.find().sort('-createdAt');
    res.json(messages);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', protect, async (req, res) => {
    try {
        const msg = await Contact.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(msg);
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({message: "Deleted"});
    } catch(err) { res.status(500).json({error: err.message}); }
});

export default router;
