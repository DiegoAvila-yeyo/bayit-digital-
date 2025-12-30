import Course from '../models/Course.js';

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener cursos", error: error.message });
  }
};

export const getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) return res.status(404).json({ message: "Curso no encontrado" });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el curso", error: error.message });
  }
};