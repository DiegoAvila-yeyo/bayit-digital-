import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinaryConfig.js'; // Asegúrate de que esta ruta sea correcta

// Configuramos el "almacén" en la nube
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'cursos_spirit', // Nombre de la carpeta en tu panel de Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mkv'], // Formatos que permitimos
        resource_type: 'auto', // Esto es vital para que acepte tanto imágenes como videos
    },
});

const upload = multer({ storage });

export default upload;