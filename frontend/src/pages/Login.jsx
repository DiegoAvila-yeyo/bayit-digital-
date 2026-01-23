import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'; 
import { auth } from '../firebase'; 
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast'; // IMPORTAMOS TOAST

const Login = ({ PRIMARY_COLOR }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // VALIDACIÓN ESTÉTICA
        if (!email || !password) {
            return toast.error('Por favor, completa todos los campos');
        }

        try {
            const res = await api.post('/auth/login', { email, password });
            const success = await login(res.data); 

            if (success) {
                toast.success(`¡Bienvenido de nuevo!`);
                navigate('/');
            }  
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al iniciar sesión');
        }
    };

const handleGoogleLogin = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        
        // 1. OBTENEMOS EL ID TOKEN (El "pasaporte" de seguridad)
        const idToken = await result.user.getIdToken();

        // 2. ENVIAMOS LA PETICIÓN CON EL TOKEN EN EL HEADER
        // Nota: Enviamos el body vacío {} porque el backend sacará los datos del token
        const res = await api.post('/auth/social-login', {}, {
            headers: {
                'Authorization': `Bearer ${idToken}`
            }
        });

        // 3. MANEJO DE LA RESPUESTA
        // Usamos res.data directamente porque login() se encarga de procesarlo
        if (res.data) {
            await login(res.data); 
            toast.success('¡Sesión iniciada con Google!');
            navigate('/');
        }
    } catch (err) {
        console.error("Error en Google Login:", err);
        toast.error(err.response?.data?.message || 'Error al conectar con Google');
    }
};

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg">
                <h3 className="text-2xl font-bold text-center">Inicia Sesión en Bayit Digital</h3>
                <form onSubmit={handleSubmit} className="mt-4" noValidate> {/* noValidate quita globos nativos */}
                    <div>
                        <label className="block" htmlFor="email">Email</label>
                        <input
                            type="email"
                            placeholder="Tu email"
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block" htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            placeholder="Tu contraseña"
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-baseline justify-between mt-6">
                        <button
                            type="submit"
                            className="px-6 py-2 text-white rounded-lg transition-all active:scale-95"
                            style={{ backgroundColor: PRIMARY_COLOR }}
                        >
                            Iniciar Sesión
                        </button>
                        <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600 mb-4">O inicia sesión con:</p>
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-base font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                        >
                            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google logo" className="h-5 w-5 mr-2" />
                            Google
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;