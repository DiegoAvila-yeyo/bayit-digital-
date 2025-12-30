import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
import courseRoutes from './routes/courseRoutes.js';
// CAMBIO CLAVE: Usamos import en lugar de require para mantener la consistencia
import authRoutes from './routes/authRoutes.js'; 

dotenv.config();
const app = express();

// Conexión a la base de datos
conectarDB();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Definición de Rutas
app.use('/api/courses', courseRoutes);
app.use('/api/auth', authRoutes); // Movido arriba del listen por orden profesional

app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente 🚀');
});

app.use(cors({
  origin: 'http://localhost:5173', // La URL de tu Vite/React
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Arrancar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});