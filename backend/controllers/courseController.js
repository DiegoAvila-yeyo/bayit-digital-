import Course from '../models/Course.js';

export const createCourse = async (req, res) => {
    try {
        const { title, description, price, category, videoUrl } = req.body;

        const course = new Course({
            title,
            description,
            price,
            category,
            videoUrl,
            teacher: req.user._id // Obtenemos el ID del usuario del token
        });

        const savedCourse = await course.save();
        res.status(201).json(savedCourse);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear el curso', error: error.message });
    }
};

export const getCourses = async (req, res) => {
    try {
        // .populate trae la info del maestro y la categoría, no solo el ID
        const courses = await Course.find()
            .populate('teacher', 'name email')
            .populate('category', 'name');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Agrega esto al final de courseController.js
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
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};