
import dotenv from 'dotenv';
dotenv.config();
import { initCloudinary } from './config/cloudinary.js';
initCloudinary();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Use Named Imports for config and models
import { connectDB } from './config/db.js';
import { Admin } from './models/Admin.js';
import { BlogPost, validateBlogPost } from './models/BlogPost.js';

// Import Routes (Named Imports)
import { contactRoutes } from './routes/contactRoutes.js';
import { projectRoutes } from './routes/projectRoutes.js';
import { contentRoutes } from './routes/contentRoutes.js';
import { uploadRoutes } from './routes/uploadRoutes.js';
import { authRoutes } from './routes/authRoutes.js';

import { protect } from './middleware/authMiddleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

console.log(process.env.CLOUDINARY_API_KEY)
console.log(process.env.CLOUDINARY_CLOUD_NAME)
console.log(process.env.CLOUDINARY_API_SECRET)

// Connect Database
connectDB().then(async () => {
  // Seed Admin if not exists
  const adminExists = await Admin.findOne({ email: 'admin@worriedweb.com' });
  if (!adminExists) {
    try {
      const admin = new Admin({
        email: 'admin@worriedweb.com',
        password: 'admin123' 
      });
      await admin.save();
      console.log('Default Admin Created: admin@worriedweb.com / admin123');
    } catch (e) {
      console.error("Error seeding admin:", e);
    }
  }
});
const allowedOrigins = ['http://localhost:5173', 'https://worriedweb-frontend.vercel.app']


// Middleware
app.use(helmet());
app.use(cors({origin: allowedOrigins, credentials: true}));
app.use(express.json({ limit: '50mb' })); 

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 200 
});
app.use('/api', limiter);

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api', contactRoutes); 
app.use('/api/projects', projectRoutes); 
app.use('/api/content', contentRoutes); 
app.use('/api/upload', uploadRoutes); 

// Blog Routes
app.get('/', (req, res) => {
  res.send('Worried Web API is running');
})
app.get('/api/blog', async (req, res) => {
  try {
    const posts = await BlogPost.find().sort('-publishedAt');
    res.send(posts);
  } catch (err) {
    res.status(500).send({ error: 'Server error' });
  }
});

app.post('/api/blog', protect, async (req, res) => {
  const { error } = validateBlogPost(req.body);
  console.log('Validation Error:', error);
  if (error) return res.status(400).send({ error: error.details[0].message });
  
  try {
    const post = new BlogPost(req.body);
    await post.save();
    res.status(201).send(post);
  } catch (err) {
    res.status(500).send({ error: 'Server error' });
  }
});

app.put('/api/blog/:id', protect, async (req, res) => {
  try {
    const updated = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/blog/:id', protect, async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/health', (req, res) => res.send({ status: 'OK' }));

// Start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
