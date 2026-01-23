import express from 'express';
const router = express.Router();
import { getMe, updateProgress, simulatePurchase, updateCart, checkoutCart } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

// --- RUTAS DE USUARIO ---

// Obtener mi perfil (Esta ya la tenías bien)
router.get('/me', protect, getMe);

// Actualizar progreso (Añadimos 'protect' para que el backend sepa quién rinde cuentas)
router.post('/update-progress', protect, updateProgress);

// Simular compra (Añadimos 'protect' para evitar compras anónimas o fallos de ID)
router.post('/simulate-purchase', protect, simulatePurchase);

router.post('/checkout-cart', protect, checkoutCart);


router.put('/update-cart', protect, updateCart);
export default router;