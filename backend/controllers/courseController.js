import Course from '../models/Course.js';
import Category from '../models/Category.js';

export const createCourse = async (req, res) => {
    try {
        const { title, name, price, category, description, sectionsLayout } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: 'Usuario no identificado.' });
        }

        // 1. Obtener la ruta de la imagen de portada
        let thumbnailPath = '';
        if (req.files && req.files['thumbnail']) {
            thumbnailPath = `/${req.files['thumbnail'][0].path}`;
        }

        // 2. Parsear el diseño de secciones
        let parsedSectionsLayout = [];
        if (sectionsLayout) {
            parsedSectionsLayout = JSON.parse(sectionsLayout);
        }

        // 3. Procesar los videos
        const videoFiles = req.files['videos'] || [];
        let finalLessons = [];
        let globalVideoCounter = 0;

        parsedSectionsLayout.forEach((sectionFromClient) => {
            sectionFromClient.lessons.forEach((lessonFromClient) => {
                if (videoFiles[globalVideoCounter]) {
                    finalLessons.push({
                        title: lessonFromClient.title || `Lección ${globalVideoCounter + 1}`,
                        videoUrl: `/${videoFiles[globalVideoCounter].path}`,
                        section: sectionFromClient.title,
                        order: globalVideoCounter
                    });
                    globalVideoCounter++;
                }
            });
        });

        // 4. Crear el curso con la portada (thumbnail)
        const course = new Course({
            title: title || name,
            description: description || 'Sin descripción',
            price: Number(price),
            category: category,
            thumbnail: thumbnailPath, // <--- Guardamos la ruta de la imagen
            lessons: finalLessons,
            teacher: req.user._id 
        });

        const savedCourse = await course.save();
        console.log("✅ Curso creado con imagen y secciones:", savedCourse.title);
        res.status(201).json(savedCourse);

    } catch (error) {
        console.error("❌ Error en createCourse:", error);
        res.status(500).json({ 
            message: 'Error al procesar el curso', 
            error: error.message 
        });
    }
};

// Obtener todos los cursos
export const getCourses = async (req, res) => {
    try {
        const { category, search } = req.query; 
        let query = {};

        if (search) {
            query.title = { $regex: search, $options: 'i' }; // 'i' es para case-insensitive
        }

        // LÓGICA DE CATEGORÍA (Se mantiene la que ya teníamos)
        if (category) {
            const foundCategory = await Category.findOne({ 
                $or: [
                    { slug: category },
                    { name: new RegExp(category, 'i') }
                ]
            });

            if (foundCategory) {
                query.category = foundCategory._id;
            } else if (!search) { 
                // Si no hay categoría Y no hay búsqueda, devolvemos vacío
                return res.json([]);
            }
        }

        const courses = await Course.find(query)
            .populate('teacher', 'name email profilePicture')
            .populate('category', 'name slug');
            
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener detalle de un curso por ID
export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('teacher', 'name')
            .populate('category', 'name');

        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Curso no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener el curso', 
            error: error.message 
        });
    }
};