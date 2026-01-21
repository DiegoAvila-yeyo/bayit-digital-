import ErrorResponse from '../utils/errorResponse.js';

// 1. Middleware para rutas no encontradas (ESTO ES LO QUE FALTA)
// 1. Middleware para rutas no encontradas
const notFound = (req, res, next) => {
  const error = new Error(`No encontrado - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// 2. Manejador de errores global
const errorHandler = (err, req, res, next) => {
  // Si el status ya estaba seteado (ej. 404), lo usamos, sino 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error("🔥 Error detectado:", err.message);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error del Servidor',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

export { notFound, errorHandler };
// IMPORTANTE: Exportar ambos
