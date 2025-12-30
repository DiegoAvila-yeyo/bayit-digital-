import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'clave_temporal', { expiresIn: '30d' });
};

// REGISTRO MANUAL
export const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "El usuario ya existe" });

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User({ name, email, password, verificationCode });
        await user.save();

        // Si falla el envío de mail, capturamos el error para que no caiga el servidor
        try {
            const message = `<h1>Bienvenido</h1><p>Tu código es: <b>${verificationCode}</b></p>`;
            await sendEmail({ email: user.email, subject: 'Verifica tu cuenta', message });
        } catch (mailError) {
            console.error("Error enviando email:", mailError);
            // No detenemos el proceso, pero avisamos en consola
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

// LOGIN CON GOOGLE (VINCULACIÓN AUTOMÁTICA)
export const socialLogin = async (req, res) => {
    const { email, name, profilePicture, uid } = req.body;
    try {
        let user = await User.findOne({ email });

        if (user) {
            // Si el usuario existe, nos aseguramos de que tenga el ID de Google
            if (!user.googleId) {
                user.googleId = uid;
                user.isVerified = true; 
                await user.save();
            }
        } else {
            // Si no existe, creamos uno nuevo
            user = new User({
                name,
                email,
                profilePicture,
                googleId: uid,
                isVerified: true,
                // Le damos una contraseña aleatoria larga por si el modelo la pide
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
        // ESTO ES CLAVE: Imprime el error real en la terminal del servidor
        console.error("DETALLE DEL ERROR EN SOCIAL LOGIN:", error); 
        res.status(500).json({ message: "Error en login social", error: error.message });
    }
};;

// VERIFICACIÓN DE CÓDIGO
export const verifyEmail = async (req, res) => {
    const { email, verificationCode } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        // Comparación segura convirtiendo a String
        if (String(user.verificationCode) !== String(verificationCode)) {
            return res.status(400).json({ message: "Código incorrecto" });
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        
        // Al salvar, el middleware modificado arriba detectará 
        // que la contraseña NO cambió y no dará error.
        await user.save();

        res.status(200).json({ 
            message: "Verificado con éxito", 
            verifiedUser: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                isVerified: true 
            } 
        });
    } catch (error) {
        console.error("Error en verifyEmail:", error); // Esto ahora te dará detalles limpios en la terminal
        res.status(500).json({ message: "Error interno en el servidor" });
    }
};
// LOGIN MANUAL
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error en login' });
    }
};

// REENVÍO DE CÓDIGO
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

export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            // Solo actualizamos si el campo viene en la petición
            user.name = req.body.name || user.name;
            user.profilePicture = req.body.profilePicture || user.profilePicture;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                profilePicture: updatedUser.profilePicture,
                isVerified: updatedUser.isVerified,
                // Mantenemos el token para que no tenga que re-loguearse
                token: req.headers.authorization.split(' ')[1], 
            });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        res.status(500).json({ message: 'Error al actualizar el perfil' });
    }
};