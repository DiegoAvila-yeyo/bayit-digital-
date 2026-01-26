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

    const purchasedData = user?.purchasedCourses?.find(item => (item.courseId?._id || item.courseId) === id);
    const isPurchased = !!purchasedData;
    const isInCart = user?.cart?.some(item => (item._id || item) === id);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchCourseDetail = async () => {
            try {
                const res = await api.get(`/courses/${id}`);
                setCourse(res.data);
                if (isPurchased && res.data.lessons?.length > 0) {
                    const lastLesson = res.data.lessons.find(l => !purchasedData?.completedLessons?.includes(l._id)) || res.data.lessons[0];
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
        if (!user) return navigate('/login');
        try {
            const res = await api.post('/users/cart/add', { courseId: id });
            setUser(res.data.user);
            localStorage.setItem('userInfo', JSON.stringify(res.data.user));
            toast.success("Añadido al carrito ministerial");
        } catch (error) { toast.error("Error al añadir"); }
    };

    if (loading) return <div className="h-screen flex justify-center items-center bg-white"><div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: PRIMARY_COLOR }}></div></div>;

    if (!course) return <div className="p-20 text-center font-black text-gray-400">CURSO NO ENCONTRADO</div>;

    const sections = course.lessons.reduce((acc, lesson) => {
        const sectionName = lesson.section || "Contenido Principal";
        if (!acc[sectionName]) acc[sectionName] = [];
        acc[sectionName].push(lesson);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-white">
            {/* 1. SECCIÓN DE VIDEO / HERO */}
            <div className="bg-black w-full">
                <div className="max-w-[1400px] mx-auto aspect-video w-full lg:h-[650px] lg:rounded-b-3xl overflow-hidden shadow-2xl">
                    {isPurchased ? (
                        <video 
                            key={activeVideo}
                            controls 
                            className="w-full h-full object-contain"
                            src={activeVideo?.startsWith('http') ? activeVideo : `${api.defaults.baseURL.replace('/api', '')}${activeVideo}`}
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white p-6 text-center bg-gradient-to-b from-zinc-900 to-black">
                            <LockClosedIcon className="h-12 w-12 text-zinc-600 mb-4" />
                            <h2 className="text-2xl md:text-4xl font-black mb-2 uppercase italic">Contenido Premium</h2>
                            <p className="text-zinc-400 max-w-md text-sm md:text-base mb-8">Únete a este curso para desbloquear todas las lecciones y recursos.</p>
                            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm sm:max-w-none justify-center">
                                <button onClick={handleAddToCart} className="w-full sm:w-auto px-10 py-4 rounded-xl font-black uppercase tracking-widest transition-transform active:scale-95 shadow-lg" style={{ backgroundColor: PRIMARY_COLOR, color: 'white' }}>
                                    Inscribirme por ${course.price}
                                </button>
                                {!isInCart && (
                                    <button onClick={handleAddToCart} className="w-full sm:w-auto px-6 py-4 rounded-xl font-black uppercase tracking-widest border-2 transition-colors hover:bg-white/10" style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}>
                                        <ShoppingCartIcon className="h-5 w-5 inline mr-2" /> Carrito
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. CONTENIDO */}
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
                
                {/* INFO DEL CURSO */}
                <div className="lg:col-span-8 order-2 lg:order-1">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-200 flex items-center gap-1">
                            <AcademicCapIcon className="h-3 w-3" /> {course.level || 'General'}
                        </span>
                        <div className="flex items-center gap-1 text-orange-500 text-sm font-black">
                            <StarIcon className="h-4 w-4" /> 4.9 (Valoración)
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tighter">
                        {course.title}
                    </h1>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-8 max-w-fit">
                        <div className="h-12 w-12 rounded-full bg-gray-300 overflow-hidden">
                            <img src="https://via.placeholder.com/100" alt="Teacher" className="object-cover" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase">Instructor</p>
                            <p className="font-bold text-gray-800">{course.teacher?.name || 'Mentor Bayit'}</p>
                        </div>
                    </div>

                    <div className="prose prose-zinc prose-sm md:prose-lg max-w-none text-gray-600 border-l-4 pl-6 italic mb-10" style={{ borderColor: PRIMARY_COLOR }}>
                        {course.description}
                    </div>
                </div>

                {/* TEMARIO (Sticky en Desktop) */}
                <div className="lg:col-span-4 order-1 lg:order-2">
                    <div className="lg:sticky lg:top-28 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b bg-gray-50/50">
                            <h2 className="font-black text-lg flex items-center justify-between">
                                CONTENIDO
                                <span className="text-[10px] bg-white px-2 py-1 rounded border text-gray-400">
                                    {course.lessons?.length} LECCIONES
                                </span>
                            </h2>
                        </div>
                        
                        <div className="max-h-[50vh] lg:max-h-[60vh] overflow-y-auto">
                            {Object.keys(sections).map((sectionName, idx) => (
                                <div key={idx} className="border-b last:border-0">
                                    <button onClick={() => setOpenSection(openSection === idx ? -1 : idx)} className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-gray-50 transition-colors">
                                        <span className="uppercase text-[11px] font-black tracking-widest text-gray-700">{sectionName}</span>
                                        <ChevronDownIcon className={`h-4 w-4 transition-transform ${openSection === idx ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    {openSection === idx && (
                                        <div className="bg-gray-50/30 p-2 space-y-1">
                                            {sections[sectionName].map((lesson) => {
                                                const isDone = purchasedData?.completedLessons?.includes(lesson._id);
                                                const isActive = activeLessonId === lesson._id;
                                                return (
                                                    <button
                                                        key={lesson._id}
                                                        disabled={!isPurchased}
                                                        onClick={() => { setActiveVideo(lesson.videoUrl); setActiveLessonId(lesson._id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${!isPurchased ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:bg-white'} ${isActive ? 'bg-white shadow-sm ring-1 ring-black/5' : ''}`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {isDone ? <CheckCircleIcon className="h-5 w-5 text-green-500" /> : <PlayCircleIcon className={`h-5 w-5 ${isActive ? 'text-black' : 'text-gray-300'}`} />}
                                                            <span className={`text-xs font-bold text-left ${isActive ? 'text-black' : 'text-gray-500'}`}>{lesson.title}</span>
                                                        </div>
                                                        {!isPurchased && <LockClosedIcon className="h-3 w-3 text-gray-300" />}
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