import axios from 'axios';

// URL de tu backend
const API_URL = 'http://localhost:5000/api/categories';

export const getCategories = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data; // Aquí vienen tus categorías de MongoDB
    } catch (error) {
        console.error("Error al traer categorías:", error);
        throw error;
    }
};