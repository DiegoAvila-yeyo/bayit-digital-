import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = ({ PRIMARY_COLOR }) => {
    // Extraemos login y loginWithGoogle del contexto para mantener la lógica centralizada
    const { login, loginWithGoogle } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const { name, email, password, confirmPassword } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Manejador para Google usando la función del Contexto
    const handleGoogleClick = async () => {
        try {
            const success = await loginWithGoogle();
            if (success) {
                // Si el login con Google es exitoso, el contexto ya guardó el token
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            toast.error('No se pudo completar el registro con Google');
        }
    };

    // Manejador para Registro Manual (Envío de código)
    const onSubmit = async (e) => {
        e.preventDefault();

        // Validaciones previas
        if (!name || !email || !password) return toast.error('Completa todos los campos');
        if (password !== confirmPassword) return toast.error('Las contraseñas no coinciden');
        if (password.length < 8) return toast.error('La contraseña debe tener al menos 8 caracteres');

        try {
            // Llamada a tu endpoint de registro manual
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                name, 
                email, 
                password
            });

            // Tu backend devuelve: { message: "Código enviado", user: { id, email, isVerified: false } }
            // Usamos la función login del contexto para guardar temporalmente al usuario
            if (response.data.user) {
                login(response.data.user); 
                toast.success('¡Código enviado a tu Gmail!');
                
                // Redirigimos a la pantalla de verificación enviando el email por estado si es necesario
                navigate('/verify-email', { state: { email: email } }); 
            }
            
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al registrar el usuario');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Únete a Bayit Digital</h2>
                    <p className="mt-2 text-sm text-gray-600">Comienza tu camino hoy mismo</p>
                </div>
                
                {/* Botón de Google mejorado */}
                <button 
                    onClick={handleGoogleClick}
                    type="button"
                    className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
                >
                    <img className="h-5 w-5 mr-3" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                    Registrarse con Google
                </button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-300"></span></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">O con tu correo</span></div>
                </div>

                <form className="mt-4 space-y-4" onSubmit={onSubmit} noValidate>
                    <div className="space-y-4">
                        <div>
                            <input 
                                name="name" 
                                type="text" 
                                placeholder="Nombre completo" 
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 transition-all" 
                                style={{"--tw-ring-color": PRIMARY_COLOR}} 
                                value={name} 
                                onChange={onChange} 
                            />
                        </div>
                        <div>
                            <input 
                                name="email" 
                                type="email" 
                                placeholder="Email (ej: usuario@gmail.com)" 
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 transition-all" 
                                style={{"--tw-ring-color": PRIMARY_COLOR}} 
                                value={email} 
                                onChange={onChange} 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input 
                                name="password" 
                                type="password" 
                                placeholder="Contraseña" 
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 transition-all" 
                                style={{"--tw-ring-color": PRIMARY_COLOR}} 
                                value={password} 
                                onChange={onChange} 
                            />
                            <input 
                                name="confirmPassword" 
                                type="password" 
                                placeholder="Confirmar" 
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 transition-all" 
                                style={{"--tw-ring-color": PRIMARY_COLOR}} 
                                value={confirmPassword} 
                                onChange={onChange} 
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full flex justify-center py-3.5 px-4 text-sm font-bold rounded-xl text-white shadow-lg transition-all active:scale-95" 
                        style={{ backgroundColor: PRIMARY_COLOR }}
                    >
                        Crear cuenta gratuita
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    ¿Ya tienes cuenta? <span onClick={() => navigate('/login')} className="text-blue-600 cursor-pointer hover:underline">Inicia sesión</span>
                </p>
            </div>
        </div>
    );
};

export default Register;