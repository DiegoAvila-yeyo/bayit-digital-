import User from '../models/User.js';

// Helper para devolver al usuario con los cursos poblados siempre
const getPopulatedUser = async (id) => {
    return await User.findById(id)
        .select('-password')
        .populate('cart')
        .populate({
            path: 'purchasedCourses.courseId',
            populate: { path: 'category', select: 'name' } 
        });
};

// En userController.js
export const getMe = async (req, res) => {
    try {
        // req.user viene del middleware de protección (authMiddleware)
        const user = await getPopulatedUser(req.user._id); 
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener perfil" });
    }
};

export const updateProgress = async (req, res) => {
    try {
        // 1. CAMBIO CLAVE: Obtenemos el ID del token decodificado (req.user)
        const userId = req.user._id; 
        const { courseId, lessonId } = req.body;

        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        // 2. LÓGICA DE RACHA (STREAK)
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const lastActive = new Date(user.lastActivity || 0);
        lastActive.setHours(0, 0, 0, 0);
        const diffTime = today - lastActive;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays === 1) {
            user.streak += 1;
        } else if (diffDays > 1) {
            user.streak = 1;
        } else if (user.streak === 0) {
            user.streak = 1;
        }
        user.lastActivity = new Date(); 

        // 3. LÓGICA DE PROGRESO
        const courseIndex = user.purchasedCourses.findIndex(
            (pc) => pc.courseId.toString() === courseId
        );

        if (courseIndex !== -1) {
            if (!user.purchasedCourses[courseIndex].completedLessons.includes(lessonId)) {
                user.purchasedCourses[courseIndex].completedLessons.push(lessonId);
                user.purchasedCourses[courseIndex].lastViewed = new Date();
            }
        }

        await user.save();
        
        // 4. RESPUESTA POBLADA: Sincronización total
        const updatedUser = await getPopulatedUser(userId);
        
        res.status(200).json({ 
            message: "Progreso y racha actualizados", 
            // Enviamos el usuario completo para facilitar la actualización del Contexto en el Frontend
            user: updatedUser 
        });

    } catch (error) {
        console.error("Error al actualizar progreso:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const simulatePurchase = async (req, res) => {
    try {
        // 1. Usamos el ID que viene del token (req.user), NO del body. 
        // Esto es mucho más seguro porque nadie puede "comprarle" un curso a otro cambiando el ID.
        const userId = req.user._id; 
        const { courseId } = req.body;

        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        // 2. Verificación de propiedad (Ya la tenías bien, pero aseguramos coherencia)
        const alreadyOwns = user.purchasedCourses.some(
            c => c.courseId && c.courseId.toString() === courseId
        );
        
        if (alreadyOwns) {
            return res.status(400).json({ message: "Ya posees este curso en tu biblioteca." });
        }

        // 3. Agregamos el curso
        user.purchasedCourses.push({
            courseId: courseId,
            completedLessons: [],
            enrolledAt: new Date()
        });

        console.log("ID del usuario intentando comprar:", user._id);
        console.log("Cursos antes de guardar:", user.purchasedCourses);
        await user.save();

        // 4. Devolvemos el usuario poblado para que el Frontend se actualice al instante
        const updatedUser = await getPopulatedUser(userId);

        res.status(200).json({ 
            message: "¡Curso adquirido con éxito!", 
            user: updatedUser // Enviamos el objeto user completo para actualizar el AuthContext
        });
    } catch (error) {
        console.error("Error en simulatePurchase:", error);
        res.status(500).json({ message: "Error en el servidor al procesar la compra" });
    }
};
export const updateCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { cart } = req.body; // Recibe array de IDs

        const user = await User.findByIdAndUpdate(
            userId, 
            { cart: cart }, 
            { new: true }
        ).populate('cart');

        res.status(200).json({ message: "Carrito actualizado", cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar carrito" });
    }
};