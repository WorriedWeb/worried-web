import { v2 as cloudinary } from 'cloudinary';

let initialized = false;
export function initCloudinary() {
  if (initialized) return;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  initialized = true;
}

// upload function that assumes initCloudinary() already ran
export const uploadToCloudinary = (buffer) => {
  if (!process.env.CLOUDINARY_API_KEY) {
    throw new Error('CLOUDINARY_API_KEY not set; call initCloudinary() after dotenv.config()');
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'worried-web-assets', resource_type: 'auto' },
      (error, result) => {
        if (error || !result) return reject(error || new Error('Cloudinary upload failed'));
        resolve(result.secure_url);
      }
    );
    stream.on('error', reject);
    stream.end(buffer);
  });
};

export { cloudinary };
