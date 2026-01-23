import './loadEnv.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path'; 
import mongoSanitize from 'express-mongo-sanitize';

// Configuraciones y Rutas
import conectarDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'; 
import courseRoutes from './routes/courseRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Inicialización
dotenv.config();
const app = express();
const __dirname = path.resolve();

// Conexión a la Base de Datos
conectarDB();

// --- 1. CONFIGURACIÓN DE ACCESO (CORS) ---
// Debe ir antes que cualquier otro middleware para permitir peticiones del frontend
const allowedOrigins = [
  'https://bayit-frontend.vercel.app', // Agrega tu URL de Vercel directamente
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origen (como Postman) o si está en la lista
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Origen bloqueado por CORS:", origin); // Esto te ayudará a debuguear
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Agregamos OPTIONS
  credentials: true
}));

// --- 2. SEGURIDAD Y LÍMITES (Protección) ---
app.use(helmet({
  crossOriginResourcePolicy: false, 
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo en 15 minutos.'
});
app.use('/api/', limiter);

// --- 3. PARSEERS Y SANITIZACIÓN (Tratamiento de Datos) ---
// Primero leemos el JSON, luego lo limpiamos de inyecciones
app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize());

// --- 4. ARCHIVOS ESTÁTICOS ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 5. RUTAS DE LA API ---
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes); 
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('Servidor seguro funcionando correctamente 🚀');
});

// --- 6. MANEJO DE ERRORES (Cierre de tubería) ---
// Estos SIEMPRE deben ser los últimos middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});