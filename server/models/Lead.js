
import mongoose from 'mongoose';
import Joi from 'joi';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true, default: '' },
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Qualified', 'Lost'], 
    default: 'New' 
  },
  source: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Lead = mongoose.model('Lead', leadSchema);

export const validateLead = (data) => {
  const schema = Joi.object({
    id: Joi.string().optional(), // Allow id if sent, but it will be ignored by Mongoose creation usually
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow('', null).optional(),
    status: Joi.string().valid('New', 'Contacted', 'Qualified', 'Lost').optional(),
    source: Joi.string().required(),
    createdAt: Joi.date().optional()
  });
  return schema.validate(data);
};
