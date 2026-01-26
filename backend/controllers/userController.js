import User from '../models/User.js';

// --- HELPER: Obtener usuario poblado ---
// Centralizamos esto para asegurar que siempre devolvemos la misma estructura
const getPopulatedUser = async (id) => {
    return await User.findById(id)
        .select('-password')
        .populate('cart') // Pobla los detalles de los cursos en el carrito
        .populate({
            path: 'purchasedCourses.courseId',
            populate: { path: 'category', select: 'name' }
        });
};

// --- CONTROLADORES ---

export const getMe = async (req, res) => {
    try {
        const user = await getPopulatedUser(req.user._id);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        
        res.json(user);
    } catch (error) {
        console.error("Error en getMe:", error);
        res.status(500).json({ message: "Error al obtener perfil" });
    }
};

// NUEVA FUNCIÓN: Añadir al carrito (Uno por uno)
export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({ message: "El ID del curso es obligatorio" });
        }

        // Usamos $addToSet: Solo añade el ID si NO existe ya en el array.
        // Esto evita duplicados automáticamente en la base de datos.
        await User.findByIdAndUpdate(userId, {
            $addToSet: { cart: courseId }
        });

        // Devolvemos el usuario completo y poblado para actualizar el Contexto
        const user = await getPopulatedUser(userId);

        res.status(200).json({ 
            message: "Curso añadido al carrito", 
            user: user 
        });

    } catch (error) {
        console.error("Error en addToCart:", error);
        res.status(500).json({ message: "Error al añadir curso al carrito" });
    }
};

// REFACTORIZADO: Actualizar carrito completo (Sincronización)
export const updateCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { cart } = req.body; // Array de IDs

        // Actualizamos el array del carrito
        await User.findByIdAndUpdate(userId, { cart: cart });

        // Devolvemos el usuario completo (antes solo devolvías el carrito)
        const user = await getPopulatedUser(userId);

        res.status(200).json({ 
            message: "Carrito sincronizado", 
            user: user 
        });
    } catch (error) {
        console.error("Error en updateCart:", error);
        res.status(500).json({ message: "Error al actualizar carrito" });
    }
};

export const updateProgress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { courseId, lessonId } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        // Lógica de Racha
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

        // Lógica de Progreso
        const courseIndex = user.purchasedCourses.findIndex(
            (pc) => pc.courseId && pc.courseId.toString() === courseId
        );

        if (courseIndex !== -1) {
            if (!user.purchasedCourses[courseIndex].completedLessons.includes(lessonId)) {
                user.purchasedCourses[courseIndex].completedLessons.push(lessonId);
                user.purchasedCourses[courseIndex].lastViewed = new Date();
            }
        }

        await user.save();
        
        const updatedUser = await getPopulatedUser(userId);
        res.status(200).json({ message: "Progreso guardado", user: updatedUser });

    } catch (error) {
        console.error("Error al actualizar progreso:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const simulatePurchase = async (req, res) => {
    try {
        const userId = req.user._id;
        const { courseId } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        const alreadyOwns = user.purchasedCourses.some(
            c => c.courseId && c.courseId.toString() === courseId
        );
        
        if (alreadyOwns) {
            return res.status(400).json({ message: "Ya posees este curso." });
        }

        user.purchasedCourses.push({
            courseId: courseId,
            completedLessons: [],
            enrolledAt: new Date()
        });

        // Opcional: Si lo compras directo, quítalo del carrito si estaba ahí
        user.cart = user.cart.filter(id => id.toString() !== courseId);

        await user.save();

        const updatedUser = await getPopulatedUser(userId);
        res.status(200).json({ message: "¡Compra exitosa!", user: updatedUser });

    } catch (error) {
        console.error("Error en simulatePurchase:", error);
        res.status(500).json({ message: "Error al procesar la compra" });
    }
};

export const checkoutCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { cartItems } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: "La cesta está vacía" });
        }

        const coursesToBuy = cartItems.flatMap(item => 
            item.itemType === 'bundle' ? item.courses : item._id
        );

        const onlyNewCourses = coursesToBuy.filter(courseId => 
            !user.purchasedCourses.some(pc => pc.courseId && pc.courseId.toString() === courseId.toString())
        );

        if (onlyNewCourses.length > 0) {
            onlyNewCourses.forEach(id => {
                user.purchasedCourses.push({
                    courseId: id,
                    completedLessons: [],
                    enrolledAt: new Date()
                });
            });
            user.lastActivity = new Date();
        }

        // Vaciar carrito
        user.cart = [];
        await user.save();

        const updatedUser = await getPopulatedUser(userId);
        res.status(200).json({ message: "¡Compra finalizada!", user: updatedUser });

    } catch (error) {
        console.error("Error en checkoutCart:", error);
        res.status(500).json({ message: "Error al procesar la cesta" });
    }
};