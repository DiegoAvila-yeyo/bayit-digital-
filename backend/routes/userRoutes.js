import express from 'express';
const router = express.Router();
import { getMe, updateProgress, simulatePurchase } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

// --- RUTAS DE USUARIO ---

// Obtener mi perfil (Esta ya la tenías bien)
router.get('/me', protect, getMe);

// Actualizar progreso (Añadimos 'protect' para que el backend sepa quién rinde cuentas)
router.post('/update-progress', protect, updateProgress);

// Simular compra (Añadimos 'protect' para evitar compras anónimas o fallos de ID)
router.post('/simulate-purchase', protect, simulatePurchase);

export default router;