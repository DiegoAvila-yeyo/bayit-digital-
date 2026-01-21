import admin from '../config/firebaseAdmin.js';

const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó un token de acceso.' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    // Inyectamos la info verificada en la petición
    req.user = decodedToken; 
    next();
  } catch (error) {
    console.error('Error al verificar token de Firebase:', error);
    res.status(403).json({ message: 'Token de Firebase inválido o expirado.' });
  }
};

export default verifyFirebaseToken;