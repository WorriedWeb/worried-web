
import mongoose from 'mongoose';
import Joi from 'joi';

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, trim: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true }, // Stores HTML
  coverImage: { type: String },
  author: { type: String, default: 'Admin' },
  tags: [{ type: String }],
  publishedAt: { type: Date, default: Date.now }
});

export const BlogPost = mongoose.model('BlogPost', blogPostSchema);

export const validateBlogPost = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    slug: Joi.string().required(),
    excerpt: Joi.string().required(),
    content: Joi.string().required(),
    coverImage: Joi.string().optional(),
    author: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    publishedAt: Joi.date().optional()
  });
  return schema.validate(data);
};
