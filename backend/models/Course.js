import mongoose from 'mongoose';
import slugify from 'slugify';

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    section: { type: String, default: 'General' },
    duration: { type: String, default: "0:00" },
    order: { type: Number, default: 0 }
});

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true
    },
    slug: { 
        type: String, 
        unique: true 
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
    lessons: [lessonSchema], 
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    thumbnail: {
        type: String,
        default: '/uploads/default-course.jpg' // Ruta local por defecto
    },
    level: {
        type: String,
        enum: ['Básico', 'Intermedio', 'Avanzado'],
        default: 'Básico'
    },
    published: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// CORRECCIÓN AQUÍ: Quitamos el parámetro 'next' para evitar el TypeError
courseSchema.pre('save', async function() {
    if (!this.isModified('title')) return;
    this.slug = slugify(this.title, { lower: true, strict: true });
});

const Course = mongoose.model('Course', courseSchema);
export default Course;