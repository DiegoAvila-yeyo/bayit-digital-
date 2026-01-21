import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Tu URL de backend
});

// El Interceptor: Actúa como un peaje antes de salir la petición
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;