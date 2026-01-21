import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cursos_senda', // Nombre de la carpeta en tu Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'mp4'],
    resource_type: 'auto', // Esto permite subir tanto imagen como video
  },
});

export { cloudinary, storage };