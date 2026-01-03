import express from 'express';
const router = express.Router();
import { createCategory, getCategories } from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
    .get(getCategories)
    .post(createCategory); // Aquí podrías añadir el middleware 'protect' y 'admin' más adelante

export default router;