
import dotenv from 'dotenv';
dotenv.config();
import { initCloudinary } from './config/cloudinary.js';
initCloudinary();

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';

import authRouter from './routes/authRoute.js';
import projectRouter from './routes/projectRoute.js';
import blogRouter from './routes/blogRoute.js';
import contactRouter from './routes/contactRoute.js';
import leadRouter from './routes/leadRoute.js';
import subscriberRouter from './routes/subscriberRoute.js';
import serviceRouter from './routes/serviceRoute.js';
import testimonialRouter from './routes/testimonialRoute.js';
import teamRouter from './routes/teamRoute.js';
import faqRouter from './routes/faqRoute.js';
import offerRouter from './routes/offerRoute.js';
import heroRouter from './routes/heroRoute.js';
import uploadRouter from './routes/uploadRoute.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
await connectDB();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));

app.get('/', (req, res) => res.send("API is working"));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/project', projectRouter);
app.use('/api/blog', blogRouter);
app.use('/api/contact', contactRouter);
app.use('/api/lead', leadRouter);
app.use('/api/subscriber', subscriberRouter);
app.use('/api/service', serviceRouter);
app.use('/api/testimonial', testimonialRouter);
app.use('/api/team', teamRouter);
app.use('/api/faq', faqRouter);
app.use('/api/offer', offerRouter);
app.use('/api/hero', heroRouter);
app.use('/api/upload', uploadRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
