
import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String },
  isActive: { type: Boolean, default: true },
  expiryDate: { type: Date },
}, { timestamps: true });

export const Offer = mongoose.model('Offer', offerSchema);
