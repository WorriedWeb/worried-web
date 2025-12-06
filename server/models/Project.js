

import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  gallery: [{ type: String }],
  tags: [{ type: String }],
  technologies: [{ type: String }],
  category: { type: String, required: true },
  businessUnit: { type: String, required: true },
  featured: { type: Boolean, default: false },
  status: { type: String, default: 'Live' },
  websiteUrl: { type: String },
}, { timestamps: true });

export const Project = mongoose.model('Project', projectSchema);