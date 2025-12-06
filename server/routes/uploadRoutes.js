import express from 'express';
import { upload } from '../middleware/fileUpload.js'; // ensure this uses multer.memoryStorage()
import { protect } from '../middleware/authMiddleware.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

const router = express.Router();

// Helper: simple image check
const isImage = (mimetype) => mimetype && mimetype.startsWith('image/');

router.post('/', protect, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  if (!isImage(req.file.mimetype)) {
    return res.status(415).json({ error: 'Uploaded file is not an image' });
  }

  try {
    const url = await uploadToCloudinary(req.file.buffer);
    // 201 Created is more semantically correct for an upload
    return res.status(201).json({ url });
  } catch (error) {
    console.error('Upload Error:', error);
    return res.status(500).json({ error: 'Image upload failed' });
  }
});

router.post('/multiple', protect, upload.array('images', 10), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  // Validate images
  const bad = req.files.find(file => !isImage(file.mimetype));
  if (bad) {
    return res.status(415).json({ error: 'One or more files are not images' });
  }

  try {
    // Use allSettled to get partial success info
    const results = await Promise.allSettled(
      req.files.map(file => uploadToCloudinary(file.buffer))
    );

    const urls = [];
    const errors = [];

    results.forEach((r, idx) => {
      if (r.status === 'fulfilled') {
        urls.push({ filename: req.files[idx].originalname, url: r.value });
      } else {
        errors.push({
          filename: req.files[idx].originalname,
          reason: r.reason?.message || String(r.reason),
        });
      }
    });

    // 207 Multi-Status could be used when mixed results; fallback to 200
    const status = errors.length === 0 ? 201 : 207;
    return res.status(status).json({ uploaded: urls, failed: errors });
  } catch (error) {
    console.error('Unexpected Upload Error:', error);
    return res.status(500).json({ error: 'Image upload failed' });
  }
});

export const uploadRoutes = router;
