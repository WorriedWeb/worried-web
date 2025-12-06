
import express from 'express';
import { Contact, validateContact } from '../models/Contact.js';
import { Lead, validateLead } from '../models/Lead.js';
import { Subscriber } from '../models/Subscriber.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/contact', async (req, res) => {
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

router.get('/contact', protect, async (req, res) => {
  try {
    const messages = await Contact.find().sort('-createdAt');
    res.json(messages);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/contact/:id', protect, async (req, res) => {
    try {
        const msg = await Contact.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(msg);
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.delete('/contact/:id', protect, async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({message: "Deleted"});
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.post('/leads', async (req, res) => {
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

router.get('/leads', protect, async (req, res) => {
  try {
    const leads = await Lead.find().sort('-createdAt');
    res.send(leads);
  } catch (err) {
    res.status(500).send({ error: 'Server error' });
  }
});

router.put('/leads/:id', protect, async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(lead);
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.delete('/leads/:id', protect, async (req, res) => {
    try {
        await Lead.findByIdAndDelete(req.params.id);
        res.json({message: "Deleted"});
    } catch(err) { res.status(500).json({error: err.message}); }
});

router.post('/subscribers', async (req, res) => {
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

router.get('/subscribers', protect, async (req, res) => {
  try {
    const subs = await Subscriber.find().sort('-date');
    res.json(subs);
  } catch(err) { res.status(500).json({error: err.message}); }
});

router.delete('/subscribers/:id', protect, async (req, res) => {
    try {
        await Subscriber.findByIdAndDelete(req.params.id);
        res.json({message: "Deleted"});
    } catch(err) { res.status(500).json({error: err.message}); }
});

export const contactRoutes = router;
