import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    price: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        default: 0
    },
    // Conexión con el Maestro (User)
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Conexión con la Categoría
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    videoUrl: {
        type: String,
        required: [true, 'https://www.youtube.com/watch?v=5d0P2ZVCWcg']
    },
    duration: {
        type: String, // Ejemplo: "12:45"
        default: "0:00"
    },
    level: {
        type: String,
        enum: ['Básico', 'Intermedio', 'Avanzado'],
        default: 'Básico'
    },
    thumbnail: {
        type: String, // Imagen de portada del curso
        default: 'https://via.placeholder.com/400x225'
    },
    published: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
export default Course;