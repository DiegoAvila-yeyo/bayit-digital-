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
        required: [true, 'El descripción es obligatoria']
    },
    price: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        default: 0
    },
    thumbnail: {
        type: String,
        default: '/uploads/default-course.jpg'
    },
    lessons: [lessonSchema], 
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Mantenemos Category como ObjectId porque viene de tu DB
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', 
        required: true
    },

    // --- CAMBIO CLAVE AQUÍ ---
    // Cambiamos ObjectId por String para que acepte "Liderazgo", "Meditación", etc.
    subcategory: { 
        type: String, 
        default: 'General' 
    },
    
    topic: { 
        type: String, 
        default: 'Espiritualidad' 
    },
    level: { 
        type: String, 
        enum: ['Iniciación', 'Intermedio', 'Avanzado', 'Masterclass'],
        default: 'Iniciación'
    },
    language: { 
        type: String, 
        default: 'es' 
    },
    rating: { 
        type: Number, 
        default: 5.0 
    },
    durationHours: { 
        type: Number, 
        default: 0 
    },
    goal: { 
        type: String,
        enum: ['Paz Interior', 'Conocimiento Intelectual', 'Impacto Social', 'Transformación', 'Propósito', 'Conocimiento'],
        default: 'Paz Interior'
    },
    isOffer: {
        type: Boolean,
        default: false
    },
    published: {
        type: Boolean,
        default: true // Lo ponemos en true por defecto para facilitar tus pruebas
    }
}, { timestamps: true });

// Middleware para generar el Slug
courseSchema.pre('save', async function() {
    if (this.isModified('title') || !this.slug) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    // Al ser una función async, Mongoose sabe cuándo terminar sin necesidad de next()
});

const Course = mongoose.model('Course', courseSchema);
export default Course;