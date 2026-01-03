import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';

// Helper para generar tokens
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'clave_temporal', { expiresIn: '30d' });
};

// --- REGISTRO MANUAL ---
export const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "El usuario ya existe" });

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User({ name, email, password, verificationCode });
        await user.save();

        try {
            const message = `<h1>Bienvenido</h1><p>Tu código es: <b>${verificationCode}</b></p>`;
            await sendEmail({ email: user.email, subject: 'Verifica tu cuenta', message });
        } catch (mailError) {
            console.error("Error enviando email:", mailError);
        }

        res.status(201).json({ 
            message: "Código enviado", 
            user: { id: user._id, email: user.email, isVerified: false } 
        });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
};

// --- LOGIN CON GOOGLE ---
export const socialLogin = async (req, res) => {
    const { email, name, profilePicture, uid } = req.body;
    try {
        let user = await User.findOne({ email });

        if (user) {
            if (!user.googleId) {
                user.googleId = uid;
                user.isVerified = true; 
                await user.save();
            }
        } else {
            user = new User({
                name,
                email,
                profilePicture,
                googleId: uid,
                isVerified: true,
                password: Math.random().toString(36).slice(-10) + "Aa1!" 
            });
            await user.save();
        }

        const token = generateToken(user._id);
        res.status(200).json({
            token,
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                isVerified: user.isVerified,
                profilePicture: user.profilePicture 
            }
        });
    } catch (error) {
        console.error("DETALLE DEL ERROR EN SOCIAL LOGIN:", error); 
        res.status(500).json({ message: "Error en login social", error: error.message });
    }
};

// --- VERIFICACIÓN DE CÓDIGO ---
export const verifyEmail = async (req, res) => {
    const { email, verificationCode } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        if (String(user.verificationCode) !== String(verificationCode)) {
            return res.status(400).json({ message: "Código incorrecto" });
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        await user.save();

        res.status(200).json({ 
            message: "Verificado con éxito", 
            verifiedUser: { id: user._id, name: user.name, email: user.email, isVerified: true } 
        });
    } catch (error) {
        console.error("Error en verifyEmail:", error);
        res.status(500).json({ message: "Error interno en el servidor" });
    }
};

// --- LOGIN MANUAL (CORREGIDO) ---
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id), // Generamos el token aquí
            });
        } else {
            res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }
    } catch (error) {
        console.error("Error en loginUser:", error);
        res.status(500).json({ message: "Error en el inicio de sesión" });
    }
};

// --- REENVÍO DE CÓDIGO ---
export const resendVerificationCode = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationCode = newCode;
        await user.save();

        await sendEmail({ 
            email: user.email, 
            subject: 'Nuevo código de verificación', 
            message: `<p>Tu nuevo código es: <b>${newCode}</b></p>` 
        });

        res.status(200).json({ message: "Nuevo código enviado" });
    } catch (error) {
        res.status(500).json({ message: "Error al reenviar" });
    }
};

// --- ACTUALIZAR PERFIL ---
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.profilePicture = req.body.profilePicture || user.profilePicture;
            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                profilePicture: updatedUser.profilePicture,
                isVerified: updatedUser.isVerified,
                token: generateToken(updatedUser._id) // Nuevo token actualizado
            });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        res.status(500).json({ message: 'Error al actualizar el perfil' });
    }
};