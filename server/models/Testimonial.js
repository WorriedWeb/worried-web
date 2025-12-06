
import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, required: true },
  role: { type: String, required: true },
  imageUrl: { type: String, required: true },
  rating: { type: Number, default: 5 },
}, { timestamps: true });

export const Testimonial = mongoose.model('Testimonial', testimonialSchema);
