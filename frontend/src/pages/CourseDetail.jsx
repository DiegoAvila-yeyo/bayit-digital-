import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
    ChevronDownIcon, 
    PlayCircleIcon, 
    CheckCircleIcon,
    LockClosedIcon,
    StarIcon
} from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';

export const CourseDetail = ({ PRIMARY_COLOR = "#2563eb" }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);
    
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeVideo, setActiveVideo] = useState('');
    const [activeLessonId, setActiveLessonId] = useState(null);
    const [openSection, setOpenSection] = useState(0);

    // 1. Verificamos si el usuario posee el curso (Sincronizado con el estado global)
    const purchasedData = user?.purchasedCourses?.find(item => {
        const courseIdInUser = item.courseId?._id || item.courseId;
        return courseIdInUser === id;
    });
    const isPurchased = !!purchasedData;

    useEffect(() => {
    window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
    const fetchCourseDetail = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/courses/${id}`);
            setCourse(res.data);
            
            if (isPurchased && res.data.lessons?.length > 0) {
                // BUSCAMOS LA ÚLTIMA LECCIÓN NO COMPLETADA
                const lastLesson = res.data.lessons.find(l => 
                    !purchasedData?.completedLessons?.includes(l._id)
                ) || res.data.lessons[0]; // Si todas están completas, vamos a la primera

                setActiveVideo(lastLesson.videoUrl);
                setActiveLessonId(lastLesson._id);
                const lessonIndex = res.data.lessons.findIndex(l => l._id === lastLesson._id);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error al obtener detalle del curso:", error);
            setLoading(false);
        }
    };
    fetchCourseDetail();
}, [id, isPurchased, user]); // Añadimos user para re-calcular si el progreso cambia

    // 2. FUNCIÓN DE COMPRA: Actualiza contexto y storage instantáneamente
    const handleSimulatedPurchase = async () => {
        if (!user) {
            toast.error("Debes iniciar sesión para adquirir este curso");
            return navigate('/login');
        }

        const token = localStorage.getItem('token');

        try {
            const res = await axios.post('http://localhost:5000/api/users/simulate-purchase', 
                { courseId: id }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            const updatedUser = res.data.user;
            
            // CRÍTICO: Forzamos la reactividad con una copia nueva del objeto
            setUser({ ...updatedUser });
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            
            toast.success("¡Curso añadido a tu biblioteca!");
        } catch (error) {
            console.error("Error en la compra:", error);
            toast.error(error.response?.data?.message || "Error al procesar la adquisición.");
        }
    };

    // 3. ACTUALIZACIÓN DE PROGRESO: Sincroniza lecciones completadas
    const handleVideoEnd = async () => {
        if (!isPurchased || !activeLessonId || !user) return;
        
        const token = localStorage.getItem('token');

        try {
            const res = await axios.post(
                'http://localhost:5000/api/users/update-progress', 
                { courseId: id, lessonId: activeLessonId }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Actualizamos el usuario global para que los checks verdes aparezcan sin F5
            const updatedUser = res.data.user || { ...user, purchasedCourses: res.data.purchasedCourses, streak: res.data.streak };
            setUser({ ...updatedUser });
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));

            toast.success("¡Lección completada!", { icon: '✅' });
        } catch (error) {
            console.error("Error al guardar progreso:", error);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: PRIMARY_COLOR }}></div>
        </div>
    );

    if (!course) return <div className="p-10 text-center font-bold text-red-500">Curso no encontrado</div>;

    const sections = course.lessons.reduce((acc, lesson) => {
        const sectionName = lesson.section || "General";
        if (!acc[sectionName]) acc[sectionName] = [];
        acc[sectionName].push(lesson);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Video Player Section */}
            <div className="bg-black w-full aspect-video lg:h-[550px] relative shadow-2xl">
                {isPurchased ? (
                    <video 
                        key={activeVideo}
                        controls 
                        onEnded={handleVideoEnd}
                        className="w-full h-full object-contain"
                        src={`http://localhost:5000${activeVideo}`}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white p-6 text-center bg-gradient-to-br from-gray-900 to-black">
                        <div className="bg-white/10 p-6 rounded-full mb-6 backdrop-blur-sm">
                            <LockClosedIcon className="h-16 w-16 text-gray-400" />
                        </div>
                        <h2 className="text-3xl font-black italic tracking-tighter">CONTENIDO PREMIUM</h2>
                        <p className="mt-2 text-gray-400 max-w-md font-medium">Únete a los estudiantes que ya están transformando su carrera con este curso.</p>
                        <button 
                            onClick={handleSimulatedPurchase}
                            className="mt-8 px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-105 hover:brightness-110 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                            style={{ backgroundColor: PRIMARY_COLOR }}
                        >
                            Comprar ahora por ${course.price}
                        </button>
                    </div>
                )}
            </div>

            {/* Course Information */}
            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider">
                            {course.category?.name}
                        </span>
                        <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-3 py-1 rounded-xl">
                            <StarIcon className="h-4 w-4" />
                            <span className="font-bold text-yellow-700 text-sm">4.9</span>
                        </div>
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 mb-6 leading-tight tracking-tight">{course.title}</h1>
                    <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed text-lg">
                        {course.description}
                    </div>
                </div>

                {/* Sidebar: Curriculum */}
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 h-fit sticky top-8">
                    <h2 className="font-black text-2xl mb-8 flex items-center gap-3 italic">
                        <PlayCircleIcon className="h-8 w-8" style={{ color: PRIMARY_COLOR }} /> 
                        TEMARIO
                    </h2>
                    
                    <div className="space-y-6">
                        {Object.keys(sections).map((sectionName, idx) => (
                            <div key={idx} className="group">
                                <button 
                                    onClick={() => setOpenSection(openSection === idx ? -1 : idx)}
                                    className="w-full flex justify-between items-center py-2 text-left font-black text-gray-800 group-hover:text-blue-600 transition-colors"
                                >
                                    <span className="uppercase text-sm tracking-widest">{sectionName}</span>
                                    <ChevronDownIcon className={`h-5 w-5 transition-transform duration-300 ${openSection === idx ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {openSection === idx && (
                                    <div className="mt-4 space-y-2 animate-in slide-in-from-top-2 duration-300">
                                        {sections[sectionName].map((lesson) => {
                                            const isDone = purchasedData?.completedLessons?.includes(lesson._id);
                                            const isActive = activeLessonId === lesson._id;

                                            return (
                                                <button
                                                    key={lesson._id}
                                                    disabled={!isPurchased}
                                                    onClick={() => {
                                                        setActiveVideo(lesson.videoUrl);
                                                        setActiveLessonId(lesson._id);
                                                    }}
                                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                                                        !isPurchased ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50 active:scale-[0.98]'
                                                    } ${isActive ? 'bg-blue-50/50 ring-1 ring-blue-100' : ''}`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        {isDone ? (
                                                            <div className="bg-green-100 p-1 rounded-full">
                                                                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                                            </div>
                                                        ) : (
                                                            <PlayCircleIcon className={`h-6 w-6 ${isActive ? 'text-blue-600' : 'text-gray-300'}`} />
                                                        )}
                                                        <span className={`text-sm font-bold text-left ${isActive ? 'text-blue-900' : 'text-gray-600'}`}>
                                                            {lesson.title}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};