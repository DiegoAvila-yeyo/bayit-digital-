import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'; 
import courseRoutes from './routes/courseRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/userRoutes.js';
import path from 'path'; 

dotenv.config();
const app = express();
const __dirname = path.resolve();

conectarDB();

app.use(helmet({
  crossOriginResourcePolicy: false, // Permite que el frontend vea tus videos/fotos
}));
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use('/uploads', express.static('uploads'));

// --- DEFINICIÓN DE RUTAS CORREGIDA ---
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes); 
app.use('/api/courses', courseRoutes); // SOLO UNA VEZ
app.use('/uploads', express.static('uploads'));
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});