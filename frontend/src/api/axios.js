import axios from 'axios';

const api = axios.create({
    // Prioriza la variable de entorno, si no existe, cae en localhost
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// El Interceptor: Se mantiene igual, es perfecto
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

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Si el token ya no vale, limpiamos y redirigimos
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
export default api;