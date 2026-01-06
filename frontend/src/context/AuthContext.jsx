import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 1. Inicializamos el estado buscando en localStorage para que no se pierda al refrescar
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('userInfo');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token && !user) {
                try {
                    const res = await axios.get('http://localhost:5000/api/auth/profile', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(res.data);
                    localStorage.setItem('userInfo', JSON.stringify(res.data));
                } catch (error) {
                    logout(); // Si el token expiró, limpiamos todo
                }
            }
            setLoading(false);
        };
        checkUserLoggedIn();
    }, [user]);

    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const { displayName, email, photoURL, uid } = result.user;

            const res = await axios.post('http://localhost:5000/api/auth/social-login', {
                name: displayName,
                email: email,
                profilePicture: photoURL,
                uid: uid
            });

            const userData = res.data.user;
            const token = res.data.token;

            localStorage.setItem('token', token);
            localStorage.setItem('userInfo', JSON.stringify(userData));
            
            setUser(userData);
            toast.success(`¡Bienvenido, ${userData.name}!`);
            return true;
        } catch (error) {
            console.error("Error en Google Login:", error);
            toast.error("Error al conectar con Google");
            return false;
        }
    };

    const login = (userData) => {
        const token = userData.token;
        const infoUsuario = userData.user || userData;

        if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('userInfo', JSON.stringify(infoUsuario));
            setUser(infoUsuario);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        setUser(null);
        toast("Sesión cerrada", { icon: '👋' });
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, loginWithGoogle, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};