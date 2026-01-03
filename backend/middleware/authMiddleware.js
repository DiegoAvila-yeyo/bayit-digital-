import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// --- PROTECCIÓN (Verifica que el usuario esté logueado) ---
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clave_temporal');

            // Buscamos al usuario y lo inyectamos en 'req.user' para que el siguiente middleware lo vea
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error('Error en el middleware de protección:', error);
            res.status(401).json({ message: 'No autorizado, token fallido' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'No autorizado, no hay token' });
    }
};

// --- ADMIN (Verifica que el usuario sea administrador) ---
// Este bloque es el nuevo que solicitaste
export const admin = (req, res, next) => {
    // Si el usuario existe y su campo 'role' es 'admin'
    if (req.user && req.user.role === 'admin') {
        next(); // Tiene permiso, puede pasar al controlador
    } else {
        res.status(403).json({ 
            message: 'Acceso denegado: Se requiere perfil de Administrador para esta acción' 
        });
    }
};