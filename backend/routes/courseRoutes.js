import express from 'express';
import { createCourse, getCourses, getCourseById } from '../controllers/courseController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Configuramos para recibir 1 imagen 'thumbnail' y hasta 20 'videos'
const uploadFields = upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'videos', maxCount: 20 }
]);

router.route('/')
    .get(getCourses)
    .post(protect, uploadFields, createCourse);

router.route('/:id').get(getCourseById);

export default router;