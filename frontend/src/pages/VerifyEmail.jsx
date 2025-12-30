import React, { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const VerifyEmail = ({ PRIMARY_COLOR }) => {
    const [code, setCode] = useState(new Array(6).fill('')); 
    const inputRefs = useRef([]); 
    const navigate = useNavigate();
    
    // Importante: Extraemos 'setUser' y 'login' del contexto
    const { user, setUser, login } = useContext(AuthContext); 

    useEffect(() => {
        // Si no hay usuario en el contexto, buscamos en el storage por si hubo un refresh
        if (!user) {
            const savedUser = localStorage.getItem('userInfo');
            if (!savedUser) {
                navigate('/login');
            }
        } else if (user.isVerified) {
            navigate('/'); 
        }
    }, [user, navigate]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;
        
        const newCode = [...code];
        newCode[index] = element.value;
        setCode(newCode);

        // Mover foco al siguiente
        if (element.value !== '' && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
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

        const emailToVerify = user?.email;

        if (!emailToVerify) {
            return toast.error('Sesión expirada. Por favor, intenta registrarte de nuevo.');
        }

        try {
            const res = await axios.post('http://localhost:5000/api/auth/verify-email', {
                email: emailToVerify,
                verificationCode: fullCode
            });

            // Si el backend responde con verifiedUser (como vimos en tu authController)
            if (res.data.verifiedUser) {
                // Sincronizamos el estado global
                setUser(res.data.verifiedUser);
                
                // Si el backend te enviara un token aquí, usaríamos login(), 
                // pero como el registro ya lo guardó, solo actualizamos el objeto
                const currentUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                localStorage.setItem('userInfo', JSON.stringify({ ...currentUserInfo, ...res.data.verifiedUser, isVerified: true }));
                
                toast.success('¡Cuenta verificada con éxito!');
                navigate('/');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Código incorrecto o expirado');
        }
    };

    const handleResendCode = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/resend-verification-code', {
                email: user.email
            });
            toast.success('Nuevo código enviado a tu correo.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al reenviar el código.');
        }
    };

    // Evitamos parpadeos visuales si no hay usuario
    if (!user) return null;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="px-8 py-8 bg-white shadow-2xl rounded-2xl max-w-md w-full border border-gray-100">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002 0V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Verifica tu identidad</h3>
                    <p className="text-gray-500 mt-2">
                        Introduce el código enviado a <br/>
                        <span className="font-semibold text-gray-800">{user.email}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between mb-8">
                        {code.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                className="w-12 h-14 text-center text-2xl font-extrabold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                style={{ 
                                    "--tw-ring-color": `${PRIMARY_COLOR}33`,
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
                        className="w-full py-4 text-white rounded-xl font-bold shadow-lg transition-all active:scale-[0.98] hover:opacity-90"
                        style={{ backgroundColor: PRIMARY_COLOR }}
                    >
                        Confirmar Código
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            ¿No recibiste nada?{' '}
                            <button
                                type="button"
                                onClick={handleResendCode}
                                className="font-bold hover:underline"
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