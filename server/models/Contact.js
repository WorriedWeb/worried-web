
import mongoose from 'mongoose';
import Joi from 'joi';

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  company: { type: String, trim: true },
  serviceInterest: { type: String, required: true },
  message: { type: String, required: true, minlength: 20 },
  consent: { type: Boolean, required: true },
  status: { type: String, enum: ['new', 'read', 'resolved'], default: 'new' },
  ip: { type: String },
  userAgent: { type: String }
}, { timestamps: true });

export const Contact = mongoose.model('Contact', contactSchema);

export const validateContact = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    company: Joi.string().allow('').optional(),
    serviceInterest: Joi.string().required(),
    message: Joi.string().min(20).required(),
    consent: Joi.boolean().valid(true).required()
  });
  return schema.validate(data);
};
