import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
    FireIcon, 
    BookOpenIcon, 
    ArrowRightIcon,
    StarIcon,
    AdjustmentsHorizontalIcon,
    PlayCircleIcon, // Importado una sola vez
    AcademicCapIcon,
    ArrowDownTrayIcon 
} from '@heroicons/react/24/solid';

const MyLearning = ({ PRIMARY_COLOR = "#2563eb" }) => {
    const { user, loading, setUser } = useContext(AuthContext); 
    const [activeTab, setActiveTab] = useState('in-progress');
    const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{ borderColor: PRIMARY_COLOR }}></div>
                <p className="text-gray-500 font-medium">Sincronizando tu progreso...</p>
            </div>
        );
    }

    // --- LÓGICA DE CERTIFICADOS ---
    const downloadCertificate = (courseTitle) => {
        alert(`Generando certificado oficial para: ${courseTitle}\n¡Felicidades ${user?.name}!`);
    };

    // --- CONFIGURACIÓN DE RACHA (STREAK) ---
    const getStreakConfig = (streak) => {
        if (!streak || streak === 0) return { bg: 'bg-gray-100', border: 'border-gray-200', iconBg: 'bg-gray-400', text: 'text-gray-400', label: 'text-gray-400', animate: '', shadow: '' };
        if (streak >= 10) return { bg: 'bg-orange-100', border: 'border-orange-200', iconBg: 'bg-orange-600', text: 'text-orange-700', label: 'text-orange-400', animate: 'animate-pulse', shadow: 'shadow-[0_0_15px_rgba(234,88,12,0.3)]' };
        return { bg: 'bg-orange-50', border: 'border-orange-100', iconBg: 'bg-orange-500', text: 'text-orange-600', label: 'text-orange-400', animate: '', shadow: '' };
    };

    const streakCount = user?.streak || 0;
    const s = getStreakConfig(streakCount);
    const purchasedCourses = user?.purchasedCourses || [];

    // --- FILTRADO DE CURSOS ---
    const filteredCourses = purchasedCourses.filter(item => {
        const totalLessons = item.courseId?.lessons?.length || 0;
        const completedCount = item.completedLessons?.length || 0;
        const isFinished = totalLessons > 0 && completedCount >= totalLessons;

        return activeTab === 'completed' ? isFinished : !isFinished;
    });

    const handleStreakTest = (e) => {
        const value = parseInt(e.target.value);
        setUser({ ...user, streak: value });
    };

    return (
        <div className="min-h-screen bg-[#f8f9fb] pb-20 relative overflow-x-hidden">
            
            {/* PANEL DE CONTROL ADMIN (Simulador de Racha) */}
            {user?.role === 'admin' && (
                <div className={`fixed right-0 top-1/3 z-[100] transition-transform duration-300 ${isAdminPanelOpen ? 'translate-x-0' : 'translate-x-[220px]'}`}>
                    <div className="flex items-start">
                        <button onClick={() => setIsAdminPanelOpen(!isAdminPanelOpen)} className="bg-gray-800 text-white p-3 rounded-l-2xl shadow-xl hover:bg-black transition-colors">
                            <AdjustmentsHorizontalIcon className="h-6 w-6" />
                        </button>
                        <div className="bg-white p-6 w-[220px] shadow-2xl border-l border-y border-gray-200 rounded-bl-2xl">
                            <p className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">Simulador de Racha</p>
                            <input type="range" min="0" max="120" value={streakCount} onChange={handleStreakTest} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER DE BIENVENIDA */}
            <div className="bg-white border-b border-gray-200 pt-12 pb-8 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                <img src={user?.profilePicture || 'https://via.placeholder.com/150'} className="w-24 h-24 rounded-2xl object-cover shadow-lg border-4 border-white" alt="Perfil" />
                                <div className="absolute -bottom-2 -right-2 bg-yellow-400 p-1.5 rounded-lg shadow-md">
                                    <StarIcon className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mi Aprendizaje</h1>
                                <p className="text-gray-500 font-medium mt-1 text-lg">
                                    ¡Es un gran día para aprender, <span style={{ color: PRIMARY_COLOR }}>{user?.name?.split(' ')[0]}</span>!
                                </p>
                            </div>
                        </div>

                        {/* WIDGET DE RACHA */}
                        <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all duration-500 ${s.bg} ${s.border} ${s.shadow}`}>
                            <div className={`p-2 rounded-xl transition-all duration-500 ${s.iconBg}`}>
                                <FireIcon className={`h-7 w-7 text-white ${s.animate}`} />
                            </div>
                            <div>
                                <p className={`text-2xl font-black leading-none ${s.text}`}>{streakCount}</p>
                                <p className={`text-[11px] font-bold uppercase tracking-wider ${s.label}`}>Días de racha</p>
                            </div>
                        </div>
                    </div>

                    {/* SELECTOR DE PESTAÑAS */}
                    <div className="flex space-x-8 mt-12 border-b border-gray-100">
                        {[
                            { id: 'in-progress', label: 'En curso' },
                            { id: 'completed', label: 'Completados' }
                        ].map((tab) => (
                            <button 
                                key={tab.id} 
                                onClick={() => setActiveTab(tab.id)} 
                                className={`pb-4 text-sm font-bold transition-all relative uppercase tracking-widest ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 w-full h-1 rounded-full animate-in fade-in duration-300" style={{ backgroundColor: PRIMARY_COLOR }}></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* LISTADO DE CURSOS */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
                {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map((item) => {
                            const courseData = item.courseId;
                            if (!courseData) return null;

                            const total = courseData.lessons?.length || 0;
                            const done = item.completedLessons?.length || 0;
                            const progress = total > 0 ? Math.round((done / total) * 100) : 0;
                            const isFullyCompleted = progress === 100;
                            
                            const imgUrl = courseData.thumbnail?.startsWith('http') 
                                ? courseData.thumbnail 
                                : `http://localhost:5000${courseData.thumbnail}`;

                            return (
                                <div key={item._id} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col group relative">
                                    
                                    {/* ICONO DE ÉXITO */}
                                    {isFullyCompleted && (
                                        <div className="absolute top-4 right-4 z-10 bg-green-500 text-white p-2 rounded-xl shadow-lg">
                                            <AcademicCapIcon className="h-5 w-5" />
                                        </div>
                                    )}

                                    <div className="relative h-48 overflow-hidden">
                                        <img src={imgUrl} className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${isFullyCompleted ? 'sepia-[0.2]' : ''}`} alt={courseData.title} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                            <PlayCircleIcon className="h-5 w-5 text-white/80" />
                                            <span className="text-white text-[10px] font-bold uppercase tracking-wider">{total} Lecciones</span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="font-extrabold text-lg mb-4 text-gray-800 leading-tight h-14 line-clamp-2">{courseData.title}</h3>
                                        
                                        <div className="mt-auto space-y-5">
                                            {/* BARRA DE PROGRESO */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                                                    <span className="text-gray-400">Progreso</span>
                                                    <span style={{ color: isFullyCompleted ? '#10b981' : PRIMARY_COLOR }}>{progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                                    <div className="h-full transition-all duration-1000 ease-out" style={{ width: `${progress}%`, backgroundColor: isFullyCompleted ? '#10b981' : PRIMARY_COLOR }}></div>
                                                </div>
                                            </div>

                                            {/* ACCIONES */}
                                            <div className="flex flex-col gap-2">
                                                <Link 
                                                    to={`/curso/${courseData._id}`} 
                                                    className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-xs text-white transition-all transform active:scale-95 shadow-lg hover:brightness-110" 
                                                    style={{ backgroundColor: isFullyCompleted ? '#10b981' : PRIMARY_COLOR }}
                                                >
                                                    {isFullyCompleted ? 'REPASAR CURSO' : 'CONTINUAR APRENDIENDO'} <ArrowRightIcon className="h-4 w-4" />
                                                </Link>

                                                {isFullyCompleted && (
                                                    <button 
                                                        onClick={() => downloadCertificate(courseData.title)}
                                                        className="flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-xs border-2 transition-all transform active:scale-95 bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                                                    >
                                                        <ArrowDownTrayIcon className="h-4 w-4" /> OBTENER CERTIFICADO
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BookOpenIcon className="h-10 w-10 text-gray-200" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Aún no tienes cursos en esta sección</h2>
                        <p className="text-gray-500 mt-2 mb-6">Explora nuestro catálogo y comienza a construir tu futuro.</p>
                        <Link to="/" className="px-8 py-3 rounded-xl font-bold text-white transition-all hover:shadow-lg" style={{ backgroundColor: PRIMARY_COLOR }}>Ver Cursos Disponibles</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyLearning;