
import express from 'express';
import { upload } from '../middleware/fileUpload.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const url = await uploadToCloudinary(req.file.buffer);
    res.json({ url });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

router.post('/multiple', protect, upload.array('images', 10), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  try {
    const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer));
    const urls = await Promise.all(uploadPromises);
    res.json({ urls });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

export default router;
