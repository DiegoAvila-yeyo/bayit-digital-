import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export const CourseDetail = ({ PRIMARY_COLOR }) => {
    const { id } = useParams(); 
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseDetail = async () => {
            try {
                // Consultamos al backend usando el ID que viene en la URL
                const res = await axios.get(`http://localhost:5000/api/courses/${id}`);
                setCourse(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error al traer el detalle del curso:", error);
                setLoading(false);
            }
        };
        fetchCourseDetail();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center font-medium text-gray-500">
            Abriendo los archivos de sabiduría...
        </div>
    );

    if (!course) return (
        <div className="min-h-screen flex items-center justify-center text-xl font-bold">
            No encontramos el curso solicitado.
        </div>
    );

    // Función para convertir links normales de YT a formato embed
    const getEmbedUrl = (url) => {
        if (!url) return "";
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Cabecera del Curso */}
            <div className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:w-2/3">
                        <h1 className="text-4xl font-extrabold mb-4">{course.title}</h1>
                        <p className="text-xl text-gray-300 mb-6">{course.description?.substring(0, 160)}...</p>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="bg-yellow-400 text-black px-2 py-1 font-bold rounded">Bestseller</span>
                            <span className="text-blue-400 font-bold">{course.category?.name}</span>
                            <span>Creado por <span className="underline">{course.teacher?.name || 'Maestro Bayit'}</span></span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* VIDEO Y CONTENIDO */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                            <iframe 
                                className="w-full h-full"
                                src={getEmbedUrl(course.videoUrl)} 
                                title={course.title}
                                allowFullScreen
                            ></iframe>
                        </div>
                        
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold mb-4">Lo que aprenderás</h2>
                            <p className="text-gray-700 leading-relaxed">{course.description}</p>
                        </div>
                    </div>

                    {/* TARJETA DE COMPRA */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100 sticky top-8">
                            <img src={course.thumbnail || course.image} alt={course.title} className="w-full h-44 object-cover rounded-lg mb-4" />
                            <div className="text-3xl font-bold mb-4">${course.price} MX$</div>
                            <button 
                                className="w-full py-4 rounded-lg text-white font-bold text-lg transition-transform hover:scale-[1.02]"
                                style={{ backgroundColor: PRIMARY_COLOR }}
                            >
                                Añadir al carrito
                            </button>
                            <div className="mt-6 text-sm text-gray-600 space-y-3">
                                <p className="flex items-center gap-2">✔ Acceso de por vida</p>
                                <p className="flex items-center gap-2">✔ Certificado de finalización</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};