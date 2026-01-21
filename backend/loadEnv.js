import dotenv from 'dotenv';
dotenv.config();

if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET === 'clave_temporal') {
    console.error("❌ ERROR CRÍTICO: No puedes usar la clave temporal en producción.");
    process.exit(1); // Detiene el servidor por seguridad
}