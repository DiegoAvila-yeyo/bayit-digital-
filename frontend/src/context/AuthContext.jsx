import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { signInWithPopup } from 'firebase/auth'; // NUEVO
import { auth, googleProvider } from '../firebase'; // NUEVO

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const res = await axios.get('http://localhost:5000/api/auth/profile', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(res.data);
                }
            } catch (error) {
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };
        checkUserLoggedIn();
    }, []);

    // --- NUEVA FUNCIÓN DE GOOGLE ---
    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const { displayName, email, photoURL, uid } = result.user;

            // Enviamos los datos al endpoint socialLogin de tu backend
            const res = await axios.post('http://localhost:5000/api/auth/social-login', {
                name: displayName,
                email: email,
                profilePicture: photoURL,
                uid: uid
            });

            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            toast.success(`¡Bienvenido, ${res.data.user.name}!`);
            return true;
        } catch (error) {
            console.error("Error en Google Login:", error);
            toast.error("Error al conectar con Google");
            return false;
        }
    };

    const login = (userData) => {
    // Si el backend devuelve { token, user: { ... } }
    const token = userData.token;
    const infoUsuario = userData.user || userData; 

    if (token) {
        localStorage.setItem('token', token);
        setUser(infoUsuario);
        return true;
    }
    // Caso especial para registro (donde no hay token aún porque falta verificar)
    if (infoUsuario) {
        setUser(infoUsuario);
        return true;
    }
    return false;
};
    

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        toast("Sesión cerrada", { icon: '👋' });
    };


    return (
        <AuthContext.Provider value={{ user, setUser, login, loginWithGoogle, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};