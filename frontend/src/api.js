import axios from 'axios';

// Creamos una instancia configurada con la URL de tu backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const getCourses = () => api.get('/courses');
export const getCourseBySlug = (slug) => api.get(`/courses/${slug}`);

export default api;