import express from 'express';
const router = express.Router();
import { 
    getMe, 
    updateProgress, 
    simulatePurchase, 
    updateCart, 
    addToCart, // Importamos la nueva función
    checkoutCart 
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

// --- RUTAS DE USUARIO ---

// Obtener perfil
router.get('/me', protect, getMe);

// Carrito de compras
router.post('/cart/add', protect, addToCart); // <--- NUEVA RUTA QUE FALTABA
router.put('/update-cart', protect, updateCart);
router.post('/checkout-cart', protect, checkoutCart);

// Progreso y Compras
router.post('/update-progress', protect, updateProgress);
router.post('/simulate-purchase', protect, simulatePurchase);

export default router;