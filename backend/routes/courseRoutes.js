import express from 'express';
const router = express.Router();
import { getCourses, getCourseBySlug } from '../controllers/courseController.js';

router.get('/', getCourses);
router.get('/:slug', getCourseBySlug);

export default router;