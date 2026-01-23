import Course from '../models/Course.js';
import Category from '../models/Category.js';

// --- FUNCIÓN DE UTILIDAD (Definida antes de usarse) ---
const parseDurationToHours = (lessons) => {
    let totalSeconds = 0;
    lessons.forEach(lesson => {
        const time = lesson.duration || "5:00"; // Fallback por si falta
        const [minutes, seconds] = time.split(':').map(Number);
        totalSeconds += (minutes * 60) + (seconds || 0);
    });
    // Convierte segundos totales a horas con 2 decimales
    return parseFloat((totalSeconds / 3600).toFixed(2));
};

export const createCourse = async (req, res) => {
    try {
        const { 
            title, price, category, description, 
            sectionsLayout, level, goal, subcategory, 
            topic, language 
        } = req.body;

        if (!req.user) return res.status(401).json({ message: 'No autorizado' });

        // --- CAMBIO AQUÍ: La URL ya viene lista de Cloudinary ---
        let thumbnailPath = req.files?.['thumbnail'] 
            ? req.files['thumbnail'][0].path 
            : '';

        const parsedSections = sectionsLayout ? JSON.parse(sectionsLayout) : [];
        const videoFiles = req.files?.['videos'] || [];
        let finalLessons = [];
        let videoIdx = 0;

        parsedSections.forEach((sec) => {
            sec.lessons.forEach((les) => {
                if (videoFiles[videoIdx]) {
                    finalLessons.push({
                        title: les.title || 'Lección sin título',
                        // --- CAMBIO AQUÍ: Usamos la URL directa de Cloudinary ---
                        videoUrl: videoFiles[videoIdx].path, 
                        section: sec.title,
                        duration: les.duration || "5:00",
                        order: videoIdx
                    });
                    videoIdx++;
                }
            });
        });

        const course = new Course({
            title,
            description,
            price: Number(price),
            category, 
            subcategory: subcategory || 'General',
            topic: topic || 'Espiritualidad',
            language: language || 'es',
            level,
            goal,
            durationHours: parseDurationToHours(finalLessons),
            thumbnail: thumbnailPath, // Se guarda la URL: https://res.cloudinary.com/...
            lessons: finalLessons,
            teacher: req.user._id,
            published: true
        });

        const savedCourse = await course.save();
        return res.status(201).json(savedCourse);

    } catch (error) {
        console.error("❌ Error detallado:", error);
        return res.status(400).json({ message: 'Error al procesar el curso', error: error.message });
    }
};
// ... (getCourses y getCourseById se mantienen igual)
export const getCourses = async (req, res) => {
    try {
        const { 
            category, search, level, rating, 
            duration, topic, subcategory, 
            language, priceRange,
            section 
        } = req.query; 

        let query = { published: true };

        // 1. SECCIÓN DE DESTACADOS
        if (section === 'featured') {
            const featuredCourses = await Course.find({ published: true })
                .populate('teacher', 'name profilePicture')
                .populate('category', 'name')
                .sort({ rating: -1, createdAt: -1 })
                .limit(4);
            return res.json(featuredCourses);
        }

        // 2. BÚSQUEDA POR TEXTO
        if (search && search.trim() !== '') {
            query.title = { $regex: search, $options: 'i' };
        }

        // 3. FILTROS BÁSICOS
        if (level && level !== 'Todos') query.level = level;
        if (language && language !== 'Todos') query.language = language;
        
        if (rating && rating !== '0') {
            query.rating = { $gte: Number(rating) };
        }

        // 4. LÓGICA DE CATEGORÍA (Corregida)
        if (category && category !== 'Todas' && category !== 'all') {
            const isObjectId = category.match(/^[0-9a-fA-F]{24}$/);
    
            if (isObjectId) {
                query.category = category;
            } else {
                const foundCategory = await Category.findOne({ slug: category });
                if (foundCategory) {
                    query.category = foundCategory._id;
                } else {
                    return res.json([]); 
                }
            }
        } // <--- Aquí se cierra correctamente la lógica de categoría

        // 5. SUBCATEGORÍA Y TEMA (Fuera del bloque de categoría para que siempre filtren)
        if (subcategory && subcategory !== 'General' && subcategory !== 'Todas') {
            query.subcategory = { $regex: new RegExp(`^${subcategory}$`, 'i') };
        }
        
        if (topic && topic !== 'Espiritualidad' && topic !== 'Todos') {
            query.topic = { $regex: new RegExp(`^${topic}$`, 'i') };
        }

        // 6. RANGO DE DURACIÓN
        if (duration) {
            if (duration === 'short') query.durationHours = { $lte: 2 };
            else if (duration === 'medium') query.durationHours = { $gt: 2, $lte: 6 };
            else if (duration === 'long') query.durationHours = { $gt: 6, $lte: 16 };
            else if (duration === 'extra') query.durationHours = { $gt: 16 };
        }

        // 7. RANGO DE PRECIO
        if (priceRange) {
            if (priceRange === 'free') query.price = 0;
            else if (priceRange === 'premium') query.price = { $gte: 1, $lte: 50 };
            else if (priceRange === 'elite') query.price = { $gt: 50 };
        }

        // 8. EJECUCIÓN
        const courses = await Course.find(query)
            .populate('teacher', 'name email profilePicture')
            .populate('category', 'name slug')
            .sort({ createdAt: -1 });
            
        return res.json(courses);

    } catch (error) {
        console.error("❌ Error en getCourses:", error);
        res.status(500).json({ 
            message: "Error al obtener los cursos", 
            error: error.message 
        });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('teacher', 'name')
            .populate('category', 'name');
        if (course) res.json(course);
        else res.status(404).json({ message: 'Curso no encontrado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el curso', error: error.message });
    }
};