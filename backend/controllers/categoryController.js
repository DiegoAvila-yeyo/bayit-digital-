import Category from '../models/Category.js';
import slugify from 'slugify'; // Necesitas instalarlo: npm install slugify

// @desc    Crear una nueva categoría (Solo para Admin)
export const createCategory = async (req, res) => {
    try {
        const { name, description, icon } = req.body;
        
        const category = new Category({
            name,
            description,
            icon
            // No uses req.user._id aquí por ahora
        });

        const createdCategory = await category.save();
        res.status(201).json(createdCategory);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear la categoría', error: error.message });
    }
};

// @desc    Obtener todas las categorías
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener categorías' });
    }
};