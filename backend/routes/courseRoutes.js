import express from 'express';
const router = express.Router();
import { createCourse, getCourses, getCourseById } from '../controllers/courseController.js'; // Asegúrate de tener getCourseById en tu controller
import { protect } from '../middleware/authMiddleware.js';

router.route('/')
    .get(getCourses)
    .post(protect, createCourse);

// ESTA RUTA ES LA QUE FALTA PARA EL DETALLE
router.route('/:id')
    .get(getCourseById);

export default router;