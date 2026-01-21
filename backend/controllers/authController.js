import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';

// Helper para generar tokens
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'clave_temporal', { expiresIn: '30d' });
};

// Función centralizada de respuesta (Mantenemos el populate que es tu "magia")
// En tu authController.js, busca la función sendUserResponse y cámbiala a esto:
const sendUserResponse = async (user, res) => {
    const populatedUser = await User.findById(user._id)
        .select('-password')
        .populate({
            path: 'purchasedCourses.courseId',
            populate: { path: 'category', select: 'name' }
        });

    if (!populatedUser) {
        res.status(404);
        throw new Error("Usuario no encontrado en la base de datos");
    }

    // 🛡️ ENVOLVEMOS TODO EN UN OBJETO "user" PARA EL FRONTEND
    res.json({
        user: {
            _id: populatedUser._id,
            name: populatedUser.name,
            email: populatedUser.email,
            role: populatedUser.role,
            profilePicture: populatedUser.profilePicture,
            isVerified: populatedUser.isVerified,
            streak: populatedUser.streak,
            purchasedCourses: populatedUser.purchasedCourses,
        },
        token: generateToken(populatedUser._id),
    });
};

// --- SOCIAL LOGIN (FIREBASE ADMIN) ---
export const socialLogin = asyncHandler(async (req, res) => {
    const { email, name, picture, uid } = req.user; 

    let user = await User.findOne({ email });

    if (user) {
        if (!user.googleId) {
            user.googleId = uid;
            user.isVerified = true; 
            await user.save();
        }
    } else {
        user = await User.create({
            name: name || "Usuario Nuevo",
            email,
            profilePicture: picture || "",
            googleId: uid,
            isVerified: true,
            password: Math.random().toString(36).slice(-10) + "Aa1!" 
        });
    }

    await sendUserResponse(user, res);
});

// --- LOGIN MANUAL ---
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        await sendUserResponse(user, res);
    } else {
        res.status(401);
        throw new Error('Correo o contraseña incorrectos');
    }
});

// --- REGISTRO MANUAL ---
export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("El usuario ya existe");
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.create({ name, email, password, verificationCode });

    const message = `<h1>Bienvenido</h1><p>Tu código es: <b>${verificationCode}</b></p>`;
    // No bloqueamos la respuesta si el email falla, pero lo manejamos
    try {
        await sendEmail({ email: user.email, subject: 'Verifica tu cuenta', message });
    } catch (mailError) {
        console.error("Error enviando email:", mailError);
    }

    res.status(201).json({ 
        message: "Código enviado", 
        user: { id: user._id, email: user.email, isVerified: false } 
    });
});

// --- VERIFICACIÓN DE CÓDIGO ---
export const verifyEmail = asyncHandler(async (req, res) => {
    const { email, verificationCode } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error("Usuario no encontrado");
    }

    if (String(user.verificationCode) !== String(verificationCode)) {
        res.status(400);
        throw new Error("Código incorrecto");
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res.status(200).json({ 
        message: "Verificado con éxito", 
        verifiedUser: { id: user._id, name: user.name, email: user.email, isVerified: true } 
    });
});

// --- REENVÍO DE CÓDIGO ---
export const resendVerificationCode = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error("Usuario no encontrado");
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = newCode;
    await user.save();

    await sendEmail({ 
        email: user.email, 
        subject: 'Nuevo código de verificación', 
        message: `<p>Tu nuevo código es: <b>${newCode}</b></p>` 
    });

    res.status(200).json({ message: "Nuevo código enviado" });
});

// --- ACTUALIZAR PERFIL ---
export const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.profilePicture = req.body.profilePicture || user.profilePicture;
        user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
        user.specialty = req.body.specialty !== undefined ? req.body.specialty : user.specialty;
        user.website = req.body.website !== undefined ? req.body.website : user.website;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            profilePicture: updatedUser.profilePicture,
            bio: updatedUser.bio,
            specialty: updatedUser.specialty,
            website: updatedUser.website,
            role: updatedUser.role,
            token: req.headers.authorization.split(' ')[1] 
        });
    } else {
        res.status(404);
        throw new Error('Usuario no encontrado');
    }
});