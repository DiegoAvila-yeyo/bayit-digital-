import multer from 'multer';
import path from 'path';

// Configuramos dónde y cómo se guardan los archivos
const storage = multer.diskStorage({
    destination(req, file, cb) {
        // Asegúrate de tener una carpeta llamada 'uploads' en la raíz de tu backend
        cb(null, 'uploads/'); 
    },
    filename(req, file, cb) {
        // Le damos un nombre único: nombreDelCampo-fecha-extension
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

// Función para filtrar qué tipos de archivos permitimos
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|mp4|mkv|mov/; // Permitimos fotos y videos
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Formato no válido. Solo se admiten imágenes (jpg, png) y videos (mp4, mkv).'));
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

export default upload;