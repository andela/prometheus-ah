import { config, uploader } from 'cloudinary';

const cloudinaryConfig = () => config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export { cloudinaryConfig, uploader };
