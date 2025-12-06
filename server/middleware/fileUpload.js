
import multer from 'multer';

// Use memory storage to handle the file buffer directly
const storage = multer.memoryStorage();

export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit to 5MB
});
