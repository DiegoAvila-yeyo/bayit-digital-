import express from 'express';
import { createCourse, getCourses, getCourseById } from '../controllers/courseController.js';
import { protect, admin } from '../middleware/authMiddleware.js'; // Asegúrate de importar 'admin'
import { upload } from '../config/cloudinaryConfig.js'; // Ahora con llaves { }

const router = express.Router();

// Esto ahora funcionará porque 'upload' ya existe en el config
const uploadFields = upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'videos', maxCount: 20 }
]);

router.route('/')
    .get(getCourses)
    .post(protect, admin, uploadFields, createCourse); // Usa 'uploadFields' para aceptar imagen y videos

router.route('/:id').get(getCourseById);

export default router;