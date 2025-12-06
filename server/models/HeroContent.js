
import mongoose from 'mongoose';

const heroContentSchema = new mongoose.Schema({
  headline: { type: String, required: true },
  subheadline: { type: String, required: true },
  ctaText: { type: String, default: 'Start a Project' },
  ctaLink: { type: String, default: '/contact' },
  isCurrent: { type: Boolean, default: true }
}, { timestamps: true });

export const HeroContent = mongoose.model('HeroContent', heroContentSchema);
