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

        if (!req.user) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        // Procesamiento de archivos (Multer)
        let thumbnailPath = req.files?.['thumbnail'] 
            ? `/${req.files['thumbnail'][0].path.replace(/\\/g, '/')}` 
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
                        videoUrl: `/${videoFiles[videoIdx].path.replace(/\\/g, '/')}`,
                        section: sec.title,
                        duration: les.duration || "5:00",
                        order: videoIdx
                    });
                    videoIdx++;
                }
            });
        });

        // CREACIÓN DEL CURSO
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
            thumbnail: thumbnailPath,
            lessons: finalLessons,
            teacher: req.user._id,
            published: true // <-- IMPORTANTE: Forzamos true para que aparezca en los filtros
        });

        console.log("🚀 Intentando guardar curso en MongoDB...");
        const savedCourse = await course.save();
        console.log("✅ Curso guardado y publicado con éxito");
        
        return res.status(201).json(savedCourse);

    } catch (error) {
        console.error("❌ Error detallado:", error);
        return res.status(400).json({ 
            message: 'Error al procesar el curso', 
            error: error.message 
        });
    }
};
// ... (getCourses y getCourseById se mantienen igual)
export const getCourses = async (req, res) => {
    try {
        const { 
            category, search, level, rating, 
            duration, topic, subcategory, 
            language, priceRange,
            section // 'featured', 'all', o 'bundle'
        } = req.query; 

        let query = { published: true }; // Solo mostrar cursos publicados

        // --- LÓGICA DE SECCIÓN 2 (DESTACADOS) ---
        // Si la petición viene de la sección de destacados, 
        // devolvemos una lista fija (por rating o fecha) y saltamos los filtros.
        if (section === 'featured') {
            const featuredCourses = await Course.find({ published: true })
                .populate('teacher', 'name profilePicture')
                .populate('category', 'name')
                .sort({ rating: -1, createdAt: -1 }) // Los mejor puntuados primero
                .limit(4);
            return res.json(featuredCourses);
        }

        // --- LÓGICA DE SECCIÓN 3 (BÚSQUEDA SELECTIVA CON FILTROS) ---
        
        // 1. Filtro de búsqueda por texto
        if (search && search.trim() !== '') {
            query.title = { $regex: search, $options: 'i' };
        }

        // 2. Filtros de selección única (evitamos 'Todos' o 'Todas')
        if (level && level !== 'Todos') query.level = level;
        if (language && language !== 'Todos') query.language = language;
        
        // 3. Filtro de Rating (Mayor o igual a...)
        if (rating && rating !== '0') {
            query.rating = { $gte: Number(rating) };
        }

        // 4. Filtro de Categoría (Soporta Slug o ID)
        if (category && category !== 'Todas' && category !== 'all') {
            const isObjectId = category.match(/^[0-9a-fA-F]{24}$/);
            if (isObjectId) {
                query.category = category;
            } else {
                const foundCategory = await Category.findOne({ slug: category });
                if (foundCategory) query.category = foundCategory._id;
            }
        }

        // 5. Filtros de Subcategoría y Tema
        // IMPORTANTE: Asegúrate de que desde el front envíes el ID o el string exacto
        if (subcategory && subcategory !== 'General' && subcategory !== 'Todas') {
            query.subcategory = subcategory;
        }
        if (topic && topic !== 'Espiritualidad' && topic !== 'Todos') {
            query.topic = topic;
        }

        // 6. Rango de Duración (en horas)
        if (duration) {
            if (duration === 'short') query.durationHours = { $lte: 2 };
            if (duration === 'medium') query.durationHours = { $gt: 2, $lte: 6 };
            if (duration === 'long') query.durationHours = { $gt: 6, $lte: 16 };
            if (duration === 'extra') query.durationHours = { $gt: 16 };
        }

        // 7. Rango de Precio
        if (priceRange) {
            if (priceRange === 'free') query.price = 0;
            if (priceRange === 'premium') query.price = { $gte: 1, $lte: 50 };
            if (priceRange === 'elite') query.price = { $gt: 50 };
        }

        // Ejecución de la consulta final
        const courses = await Course.find(query)
            .populate('teacher', 'name email profilePicture')
            .populate('category', 'name slug')
            .sort({ createdAt: -1 });
            
        return res.json(courses);

    } catch (error) {
        console.error("Error en getCourses:", error);
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