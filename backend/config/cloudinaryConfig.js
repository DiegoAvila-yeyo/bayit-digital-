import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configuración con tus credenciales de la captura
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dcyt3wykp',
  api_key: process.env.CLOUDINARY_API_KEY || '694479375363784',
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cursos_senda',
    allowed_formats: ['jpg', 'png', 'jpeg', 'mp4'],
    resource_type: 'auto',
  },
});

import multer from 'multer';
const upload = multer({ storage });

export { cloudinary, storage, upload };