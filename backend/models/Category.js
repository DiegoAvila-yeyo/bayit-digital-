import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    icon: {
        type: String,
        default: 'book'
    },
    slug: {
        type: String,
        unique: true
    }
}, { timestamps: true });

// --- MIDDLEWARE MODERNO (Sin el parámetro next) ---
categorySchema.pre('save', async function() {
    if (this.isModified('name')) {
        // Generamos el slug de forma limpia
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    // No llamamos a next(), Mongoose lo maneja automáticamente al ser async
});

const Category = mongoose.model('Category', categorySchema);
export default Category;