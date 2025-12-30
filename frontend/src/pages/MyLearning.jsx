import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { categoriasCursos } from '../data'; 
import { Link } from 'react-router-dom';

const MyLearning = ({ PRIMARY_COLOR }) => {
    const { user, loading } = useContext(AuthContext);

    // Si el AuthContext está cargando, mostramos un estado de espera
    if (loading) {
        return <div className="flex justify-center items-center h-screen">Cargando tu aprendizaje...</div>;
    }

    // Simulamos cursos inscritos (puedes ajustar esto luego)
    const enrolledCourses = categoriasCursos?.slice(0, 2) || [];

    // Obtenemos el primer nombre de forma segura
    const firstName = user?.name ? user.name.split(' ')[0] : 'Estudiante';

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white border-b border-gray-200 pt-10 pb-10">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center space-x-4">
                        <div 
                            className="w-16 h-16 rounded-full overflow-hidden border-2 flex items-center justify-center bg-gray-100"
                            style={{ borderColor: PRIMARY_COLOR }}
                        >
                            {user?.profilePicture ? (
                                <img src={user.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xl font-bold" style={{ color: PRIMARY_COLOR }}>
                                    {user?.name?.substring(0, 1) || 'B'}
                                </span>
                            )}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Mi Aprendizaje</h1>
                            <p className="text-gray-500">¡Qué bueno verte de nuevo, {firstName}!</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {enrolledCourses.map((curso) => (
                        <div key={curso.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                            <img src={curso.imagen} alt={curso.titulo} className="w-full h-48 object-cover" />
                            <div className="p-6">
                                <h3 className="font-bold text-lg mb-2 text-gray-800">{curso.titulo}</h3>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                    <div className="h-2 rounded-full" style={{ width: '45%', backgroundColor: PRIMARY_COLOR }}></div>
                                </div>
                                <Link 
                                    to={`/curso/${curso.id}`} 
                                    className="block text-center py-2.5 rounded-xl font-bold text-white"
                                    style={{ backgroundColor: PRIMARY_COLOR }}
                                >
                                    Continuar aprendiendo
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyLearning;