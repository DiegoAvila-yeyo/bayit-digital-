import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios'; 
import { AuthContext } from '../context/AuthContext';
import { 
    ChevronDownIcon, 
    PlayCircleIcon, 
    CheckCircleIcon,
    LockClosedIcon,
    StarIcon,
    ShoppingCartIcon,
    AcademicCapIcon
} from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';

export const CourseDetail = ({ PRIMARY_COLOR = "#F7A823" }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);
    
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeVideo, setActiveVideo] = useState('');
    const [activeLessonId, setActiveLessonId] = useState(null);
    const [openSection, setOpenSection] = useState(0);

    const purchasedData = user?.purchasedCourses?.find(item => 
        (item.courseId?._id || item.courseId) === id
    );
    const isPurchased = !!purchasedData;
    const isInCart = user?.cart?.some(item => (item._id || item) === id);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchCourseDetail = async () => {
            try {
                const res = await api.get(`/courses/${id}`);
                setCourse(res.data);
                
                if (isPurchased && res.data.lessons?.length > 0) {
                    // Buscamos la última lección no completada o la primera
                    const lastLesson = res.data.lessons.find(l => 
                        !purchasedData?.completedLessons?.includes(l._id)
                    ) || res.data.lessons[0];

                    setActiveVideo(lastLesson.videoUrl);
                    setActiveLessonId(lastLesson._id);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error cargando el curso:", error);
                setLoading(false);
            }
        };
        fetchCourseDetail();
    }, [id, isPurchased, user]);

    const handleAddToCart = async () => {
        if (!user) {
            toast.error("Inicia sesión para usar el carrito");
            return navigate('/login');
        }
        try {
            const res = await api.post('/users/cart/add', { courseId: id });
            setUser(res.data.user);
            localStorage.setItem('userInfo', JSON.stringify(res.data.user));
            toast.success("Añadido al carrito ministerial");
        } catch (error) {
            toast.error("Error al añadir al carrito");
        }
    };

    const handleSimulatedPurchase = async () => {
        if (!user) return navigate('/login');
        try {
            const res = await api.post('/users/simulate-purchase', { courseId: id });
            setUser(res.data.user);
            localStorage.setItem('userInfo', JSON.stringify(res.data.user));
            toast.success("¡Bienvenido a la cofradía de estudio!");
        } catch (error) {
            toast.error("Error en la adquisición.");
        }
    };

    const handleVideoEnd = async () => {
        if (!isPurchased || !activeLessonId || !user) return;
        try {
            const res = await api.post('/users/update-progress', { 
                courseId: id, 
                lessonId: activeLessonId 
            });
            const updatedUser = res.data.user;
            setUser(updatedUser);
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            toast.success("Progreso guardado", { icon: '📖' });
        } catch (error) {
            console.error("Error de progreso:", error);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4" style={{ borderColor: PRIMARY_COLOR }}></div>
        </div>
    );

    if (!course) return <div className="p-20 text-center font-black text-zinc-400">CURSO NO ENCONTRADO</div>;

    const sections = course.lessons.reduce((acc, lesson) => {
        const sectionName = lesson.section || "Fundamentos";
        if (!acc[sectionName]) acc[sectionName] = [];
        acc[sectionName].push(lesson);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            {/* 1. Reproductor de Video */}
            <div className="bg-[#0A0A0A] w-full relative">
                <div className="max-w-[1400px] mx-auto overflow-hidden lg:rounded-b-[3rem] shadow-2xl bg-black aspect-video lg:h-[600px]">
                    {isPurchased ? (
                        <video 
                            key={activeVideo}
                            controls 
                            onEnded={handleVideoEnd}
                            className="w-full h-full object-contain shadow-inner"
                            // Usamos el baseURL de nuestra instancia de API para que se adapte a Vercel automáticamente
                            src={activeVideo?.startsWith('http') 
                            ? activeVideo 
                            : `${api.defaults.baseURL.replace('/api', '')}${activeVideo}`}
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white p-8 text-center bg-gradient-to-t from-black via-zinc-900 to-black">
                            <div className="mb-6 p-5 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
                                <LockClosedIcon className="h-12 w-12 text-zinc-500" />
                            </div>
                            <h2 className="text-4xl font-black tracking-tighter mb-4 uppercase italic">Contenido Protegido</h2>
                            <p className="text-zinc-400 max-w-lg text-lg mb-10 font-medium">
                                Adquiere este conocimiento para desbloquear todas las lecciones y recursos descargables.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={handleSimulatedPurchase}
                                    className="px-12 py-4 rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl"
                                    style={{ backgroundColor: PRIMARY_COLOR, color: 'white' }}
                                >
                                    Inscribirme por ${course.price}
                                </button>
                                {!isInCart && (
                                    <button 
                                        onClick={handleAddToCart}
                                        className="px-8 py-4 rounded-2xl font-black uppercase tracking-widest border-2 transition-all hover:bg-white/10 flex items-center gap-2"
                                        style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
                                    >
                                        <ShoppingCartIcon className="h-5 w-5" />
                                        Carrito
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Cuerpo del Detalle */}
            <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
                
                <div className="lg:col-span-8">
                    <div className="flex items-center gap-4 mb-8">
                        <span className="flex items-center gap-2 bg-zinc-100 text-zinc-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-zinc-200">
                            <AcademicCapIcon className="h-4 w-4" />
                            {course.level || 'General'}
                        </span>
                        <div className="flex items-center gap-1.5 text-orange-500 font-black">
                            <StarIcon className="h-5 w-5" />
                            <span>4.9</span>
                        </div>
                    </div>

                    <h1 className="text-6xl font-black text-zinc-900 mb-8 leading-[0.9] tracking-tighter">
                        {course.title}
                    </h1>

                    <div className="flex items-center gap-4 p-6 bg-zinc-50 rounded-3xl border border-zinc-100 mb-10">
                        <div className="h-14 w-14 rounded-full bg-zinc-200 overflow-hidden border-2 border-white shadow-sm">
                            <img src="https://via.placeholder.com/100" alt="Maestro" className="object-cover h-full w-full" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Instructor Senior</p>
                            <p className="text-lg font-bold text-zinc-800">{course.teacher?.name || 'Mentor de Bayit'}</p>
                        </div>
                    </div>

                    <div className="prose prose-zinc prose-lg max-w-none text-zinc-600 font-medium leading-relaxed italic border-l-4 pl-8" style={{ borderColor: PRIMARY_COLOR }}>
                        {course.description}
                    </div>
                </div>

                {/* 3. Temario / Playlist */}
                <div className="lg:col-span-4">
                    <div className="sticky top-10 bg-white rounded-[2.5rem] shadow-2xl shadow-zinc-200/50 border border-zinc-100 p-8">
                        <h2 className="font-black text-xl mb-8 flex items-center justify-between">
                            TEMARIO DEL CURSO
                            <span className="text-[10px] bg-zinc-100 px-3 py-1 rounded-full text-zinc-400">
                                {course.lessons?.length} LECCIONES
                            </span>
                        </h2>
                        
                        <div className="space-y-4">
                            {Object.keys(sections).map((sectionName, idx) => (
                                <div key={idx} className="bg-zinc-50/50 rounded-2xl overflow-hidden border border-zinc-100">
                                    <button 
                                        onClick={() => setOpenSection(openSection === idx ? -1 : idx)}
                                        className="w-full flex justify-between items-center p-5 text-left font-black text-zinc-800 hover:bg-zinc-100/50 transition-colors"
                                    >
                                        <span className="uppercase text-[11px] tracking-[0.2em]">{sectionName}</span>
                                        <ChevronDownIcon className={`h-4 w-4 transition-transform duration-500 ${openSection === idx ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    {openSection === idx && (
                                        <div className="p-2 space-y-1 bg-white">
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
                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        }}
                                                        className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                                                            !isPurchased ? 'opacity-30 cursor-not-allowed' : 'hover:bg-zinc-50'
                                                        } ${isActive ? 'bg-zinc-100 shadow-inner' : ''}`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {isDone ? (
                                                                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                                            ) : (
                                                                <PlayCircleIcon className={`h-5 w-5 ${isActive ? 'text-zinc-900' : 'text-zinc-300'}`} />
                                                            )}
                                                            <span className={`text-xs font-bold text-left ${isActive ? 'text-zinc-900' : 'text-zinc-500'}`}>
                                                                {lesson.title}
                                                            </span>
                                                        </div>
                                                        {!isPurchased && <LockClosedIcon className="h-3 w-3 text-zinc-300" />}
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
        </div>
    );
};