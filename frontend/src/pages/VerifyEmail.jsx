import React, { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // 🎙️ Usamos tu instancia configurada
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const VerifyEmail = ({ PRIMARY_COLOR = "#F7A823" }) => {
    const [code, setCode] = useState(new Array(6).fill('')); 
    const inputRefs = useRef([]); 
    const navigate = useNavigate();
    
    // Extraemos las herramientas del contexto
    const { user, setUser } = useContext(AuthContext); 

    useEffect(() => {
        // 🎙️ Seguridad: Si no hay usuario en memoria ni en storage, fuera.
        const savedUser = localStorage.getItem('userInfo');
        if (!user && !savedUser) {
            navigate('/login');
            return;
        }

        // Si ya está verificado, no tiene sentido que esté aquí
        if (user?.isVerified) {
            navigate('/'); 
        }
    }, [user, navigate]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;
        
        const newCode = [...code];
        newCode[index] = element.value;
        setCode(newCode);

        // Mover foco al siguiente input automáticamente
        if (element.value !== '' && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Lógica para volver atrás con borrar
        if (e.key === "Backspace" && code[index] === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fullCode = code.join('');

        if (fullCode.length !== 6) {
            return toast.error('Ingresa los 6 dígitos');
        }

        const emailToVerify = user?.email || JSON.parse(localStorage.getItem('userInfo'))?.email;

        if (!emailToVerify) {
            return toast.error('Sesión expirada. Por favor, intenta registrarte de nuevo.');
        }

        try {
            // 🎙️ Ruta limpia para Vercel
            const res = await api.post('/auth/verify-email', {
                email: emailToVerify,
                verificationCode: fullCode
            });

            if (res.data.verifiedUser) {
                // Sincronizamos el estado global con el usuario verificado
                setUser(res.data.verifiedUser);
                
                // Actualizamos el storage para persistir el isVerified: true
                const currentUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                localStorage.setItem('userInfo', JSON.stringify({ 
                    ...currentUserInfo, 
                    ...res.data.verifiedUser, 
                    isVerified: true 
                }));
                
                toast.success('¡Cuenta verificada con éxito!');
                navigate('/');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Código incorrecto o expirado');
        }
    };

    const handleResendCode = async () => {
        const emailToVerify = user?.email || JSON.parse(localStorage.getItem('userInfo'))?.email;
        try {
            await api.post('/auth/resend-verification-code', {
                email: emailToVerify
            });
            toast.success('Nuevo código enviado a tu correo.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al reenviar el código.');
        }
    };

    // Evitamos parpadeos si aún no hay usuario cargado
    if (!user && !localStorage.getItem('userInfo')) return null;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="px-8 py-10 bg-white shadow-2xl rounded-3xl max-w-md w-full border border-gray-100">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-2xl mb-6 transform rotate-3">
                        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002 0V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">Casi listo...</h3>
                    <p className="text-gray-500 mt-3 text-sm">
                        Hemos enviado un código de 6 dígitos a <br/>
                        <span className="font-bold text-gray-800">{user?.email || "tu correo"}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex justify-between gap-2">
                        {code.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                className="w-full h-14 text-center text-2xl font-black border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                style={{ 
                                    borderColor: code[index] ? PRIMARY_COLOR : '#e5e7eb'
                                }}
                                value={data}
                                onChange={e => handleChange(e.target, index)}
                                onKeyDown={e => handleKeyDown(e, index)}
                                ref={el => inputRefs.current[index] = el}
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 text-white rounded-2xl font-black shadow-lg transition-all active:scale-[0.98] hover:brightness-110"
                        style={{ backgroundColor: PRIMARY_COLOR }}
                    >
                        CONFIRMAR Y EMPEZAR
                    </button>

                    <div className="text-center">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">
                            ¿No recibiste nada?{' '}
                            <button
                                type="button"
                                onClick={handleResendCode}
                                className="ml-1 hover:underline"
                                style={{ color: PRIMARY_COLOR }}
                            >
                                Reenviar código
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyEmail;