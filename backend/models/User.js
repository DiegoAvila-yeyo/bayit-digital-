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
    // NUEVOS CAMPOS DE IDENTIDAD
    bio: { 
        type: String, 
        maxlength: [500, 'La biografía no puede exceder los 500 caracteres'],
        default: ''
    },
    specialty: { 
        type: String, 
        trim: true,
        default: ''
    },
    website: { 
        type: String, 
        trim: true,
        default: ''
    },
    // NUEVO: Campo para el carrito persistente
    cart: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course' 
    }],
    purchasedCourses: [{
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        enrolledAt: { type: Date, default: Date.now },
        completedLessons: [String],
        lastViewed: { type: Date, default: Date.now }
    }],
    streak: { type: Number, default: 0 },
    lastActivity: { type: Date, default: Date.now },
    activityLog: [{ 
        date: { type: Date, default: Date.now },
        count: { type: Number, default: 1 } 
    }],
    googleId: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw new Error('Error al encriptar contraseña');
    }
});

userSchema.methods.matchPassword = async function(candidatePassword) {
    if (!this.password) return false; 
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;