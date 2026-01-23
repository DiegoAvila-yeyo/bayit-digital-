import React, { createContext, useState, useEffect, useContext } from 'react'; 
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 🛡️ ESTADO INICIAL BLINDADO: Evita la pantalla blanca
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('userInfo');
            // Validamos que exista y que no sea la cadena de texto "undefined" o "null"
            if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
                return JSON.parse(savedUser);
            }
            return null;
        } catch (error) {
            console.error("Error al parsear userInfo desde localStorage:", error);
            localStorage.removeItem('userInfo'); // Limpiamos basura
            return null;
        }
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/users/me');
                    setUser({ ...res.data }); 
                    localStorage.setItem('userInfo', JSON.stringify(res.data));
                } catch (error) {
                    console.error("Sesión expirada o servidor inaccesible");
                    logout(); 
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();

            const res = await api.post('/auth/social-login', {}, {
                headers: { Authorization: `Bearer ${idToken}` }
            });

            const userData = res.data.user; // Ahora esto SI existirá
            const token = res.data.token;

            localStorage.setItem('token', token);
            localStorage.setItem('userInfo', JSON.stringify(userData));
            
            setUser(userData);
            toast.success(`¡Bienvenido, ${userData.name}!`);
            return true;
        } catch (error) {
            console.error("Error en Google Login:", error);
            // Si el backend falla con el error de "getter", entrará aquí
            toast.error(error.response?.data?.message || "Error al conectar con el servidor");
            return false;
        }
    };

    const login = async (userData) => {
        const token = userData.token;
        if (token) {
            localStorage.setItem('token', token);
            try {
                const res = await api.get('/users/me');
                const datosCompletos = res.data;
                localStorage.setItem('userInfo', JSON.stringify(datosCompletos));
                setUser(datosCompletos);
                return true;
            } catch (error) {
                console.error("Error al obtener datos tras login", error);
                return false;
            }
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('cart');
        setUser(null);
        toast("Sesión cerrada", { icon: '👋' });
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, loginWithGoogle, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    return context;
};