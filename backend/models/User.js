import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
        maxlength: [100, 'La contraseña no puede exceder los 100 caracteres']
    },
    profilePicture: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    },
    googleId: {
        type: String,
        default: null
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    verificationCode: { 
        type: String 
    },
    verificationCodeExpires: { 
        type: Date 
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

// --- MIDDLEWARE PARA ENCRIPTAR (Corregido: userSchema con minúscula) ---
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw new Error('Error al encriptar contraseña');
    }
});

// --- MÉTODO PARA COMPARAR PASSWORDS ---
// Cambiamos 'comparePassword' por 'matchPassword' para que coincida con tu controlador
userSchema.methods.matchPassword = async function(candidatePassword) {
    if (!this.password) return false; 
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;