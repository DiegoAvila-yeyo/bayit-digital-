import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { 
    ChevronDownIcon, 
    PlayCircleIcon, 
    CheckBadgeIcon,
    ClockIcon,
    DevicePhoneMobileIcon,
    TrophyIcon
} from '@heroicons/react/24/solid';

export const CourseDetail = ({ PRIMARY_COLOR }) => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeVideo, setActiveVideo] = useState('');
    const [openSection, setOpenSection] = useState(0);
    const { addToCart } = useCart(); 

    useEffect(() => {
        const fetchCourseDetail = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/courses/${id}`);
                setCourse(res.data);
                // Seleccionar el primer video por defecto si existe
                if (res.data.lessons?.length > 0) {
                    setActiveVideo(res.data.lessons[0].videoUrl);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener detalle:", error);
                setLoading(false);
            }
        };
        fetchCourseDetail();
    }, [id]);

    if (loading) return <div className="p-20 text-center font-medium">Cargando el plan de estudio...</div>;
    if (!course) return <div className="p-20 text-center text-2xl font-bold">Curso no encontrado.</div>;

    // --- LÓGICA DE AGRUPACIÓN POR SECCIONES ---
    const sectionOrder = [];
    const sections = {};

    if (course.lessons && course.lessons.length > 0) {
        course.lessons.forEach((lesson) => {
            const sectionName = lesson.section || 'General';
            if (!sections[sectionName]) {
                sections[sectionName] = [];
                sectionOrder.push(sectionName);
            }
            sections[sectionName].push(lesson);
        });
    }

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* CABECERA ESTILO UDEMY */}
            <div className="bg-[#1c1d1f] text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:w-2/3">
                        <nav className="text-sm font-bold text-blue-400 mb-4 flex gap-2">
                            <span>{course.category?.name || 'Curso'}</span>
                            <span className="text-gray-500">›</span>
                            <span className="text-gray-300">Detalle</span>
                        </nav>
                        <h1 className="text-4xl font-extrabold mb-4">{course.title}</h1>
                        <p className="text-xl text-gray-300 mb-6">{course.description?.substring(0, 160)}...</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                            <span className="bg-[#eceb98] text-[#3d3c0a] px-2 py-1 font-bold rounded text-xs uppercase text-center">Bestseller</span>
                            <div className="flex items-center gap-1 text-yellow-500 font-bold">
                                4.9 ★★★★★ <span className="text-gray-400 font-normal">(1,200 alumnos)</span>
                            </div>
                            <span>Por <span className="text-blue-400 underline">{course.teacher?.name || 'Instructor Bayit'}</span></span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
                    
                    {/* COLUMNA IZQUIERDA: CONTENIDO PRINCIPAL */}
                    <div className="lg:col-span-2 space-y-10">
                        
                        {/* REPRODUCTOR DE VIDEO */}
                        <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                            {activeVideo ? (
                                <video 
                                    key={activeVideo} 
                                    controls 
                                    className="w-full h-full"
                                    src={`http://localhost:5000${activeVideo}`}
                                    controlsList="nodownload"
                                ></video>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 italic">
                                    No hay video disponible para esta lección
                                </div>
                            )}
                        </div>

                        {/* DESCRIPCIÓN DETALLADA */}
                        <div className="border border-gray-200 p-8 rounded-xl bg-white">
                            <h2 className="text-2xl font-bold mb-4">Lo que aprenderás</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {course.description}
                            </p>
                        </div>

                        {/* ACORDEÓN DE SECCIONES (DEBAJO DEL VIDEO) */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold">Contenido del curso</h2>
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>{sectionOrder.length} secciones • {course.lessons?.length} lecciones</span>
                            </div>

                            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                {sectionOrder.length > 0 ? (
                                    sectionOrder.map((sectionName, idx) => (
                                        <div key={idx} className="border-b last:border-b-0 border-gray-200">
                                            <button 
                                                onClick={() => setOpenSection(openSection === idx ? -1 : idx)}
                                                className="w-full p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <ChevronDownIcon className={`h-4 w-4 transition-transform duration-300 ${openSection === idx ? 'rotate-180' : ''}`} />
                                                    <span className="font-bold text-gray-800 text-left">{sectionName}</span>
                                                </div>
                                                <span className="text-sm text-gray-500 whitespace-nowrap">
                                                    {sections[sectionName].length} clases
                                                </span>
                                            </button>
                                            
                                            {openSection === idx && (
                                                <div className="bg-white">
                                                    {sections[sectionName].map((lesson, lIdx) => (
                                                        <div 
                                                            key={lIdx}
                                                            onClick={() => setActiveVideo(lesson.videoUrl)}
                                                            className={`w-full p-4 flex items-center gap-4 cursor-pointer hover:bg-blue-50/50 border-t border-gray-100 transition-all ${activeVideo === lesson.videoUrl ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
                                                        >
                                                            <PlayCircleIcon className={`h-5 w-5 flex-shrink-0 ${activeVideo === lesson.videoUrl ? 'text-blue-600' : 'text-gray-400'}`} />
                                                            <div className="flex-1">
                                                                <p className={`text-sm ${activeVideo === lesson.videoUrl ? 'text-blue-700 font-bold' : 'text-gray-700'}`}>
                                                                    {lesson.title}
                                                                </p>
                                                            </div>
                                                            <span className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 uppercase">Vista previa</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500">Este curso no tiene lecciones aún.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: TARJETA FLOTANTE (STICKY) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 sticky top-8 overflow-hidden z-20 -mt-40 lg:-mt-72">
                            <img 
                                src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600'} 
                                alt={course.title} 
                                className="w-full h-48 object-cover border-b border-gray-200"
                            />
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="text-3xl font-bold">${course.price} USD</span>
                                    <span className="text-gray-400 line-through text-lg">$94.99</span>
                                </div>
                                
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => addToCart(course)}
                                        className="w-full py-3.5 px-4 rounded font-bold text-white transition-transform active:scale-95 shadow-lg"
                                        style={{ backgroundColor: PRIMARY_COLOR }}
                                    >
                                        Añadir al carrito
                                    </button>
                                    <button className="w-full py-3.5 px-4 rounded border border-gray-900 font-bold hover:bg-gray-50 transition-colors">
                                        Comprar ahora
                                    </button>
                                </div>

                                <p className="text-center text-xs text-gray-400 mt-4">Garantía de satisfacción de 30 días</p>

                                <div className="mt-8 space-y-4">
                                    <p className="font-bold text-sm text-gray-800">Este curso incluye:</p>
                                    <div className="space-y-3 text-sm text-gray-600">
                                        <div className="flex items-center gap-3"><ClockIcon className="h-5 w-5 text-gray-400" /> Acceso de por vida</div>
                                        <div className="flex items-center gap-3"><DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" /> Acceso en móviles y TV</div>
                                        <div className="flex items-center gap-3"><CheckBadgeIcon className="h-5 w-5 text-gray-400" /> Tareas calificadas</div>
                                        <div className="flex items-center gap-3"><TrophyIcon className="h-5 w-5 text-gray-400" /> Certificado de finalización</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};