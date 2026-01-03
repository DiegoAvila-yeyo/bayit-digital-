import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'; 
import courseRoutes from './routes/courseRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js'; 

dotenv.config();
const app = express();

conectarDB();

app.use(helmet());
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// --- DEFINICIÓN DE RUTAS CORREGIDA ---
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes); 
app.use('/api/courses', courseRoutes); // SOLO UNA VEZ

app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});