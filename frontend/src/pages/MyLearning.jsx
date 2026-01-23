import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Añadido Link
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { 
    StarIcon,
    FireIcon,
    AcademicCapIcon,
    PlayCircleIcon,
    ArrowRightIcon,
    ArrowDownTrayIcon,
    BookOpenIcon,
    AdjustmentsHorizontalIcon
} from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';

const MyLearning = ({ PRIMARY_COLOR = "#F7A823" }) => {
    const { user, setUser } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('in-progress');
    const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
    const [streakCount, setStreakCount] = useState(user?.streak || 0);

    // 🎙️ 1. LÓGICA DE FILTRADO (La pieza que faltaba)
    const purchasedCourses = user?.purchasedCourses || [];

    const filteredCourses = purchasedCourses.filter(item => {
        const courseData = item.courseId;
        if (!courseData) return false;

        const total = courseData.lessons?.length || 0;
        const done = item.completedLessons?.length || 0;
        const isFinished = total > 0 && done === total;

        return activeTab === 'completed' ? isFinished : !isFinished;
    });

    // 🎙️ 2. ESTILOS DINÁMICOS PARA LA RACHA (Helper)
    const getStreakStyles = (count) => {
        if (count >= 30) return { bg: 'bg-orange-600', text: 'text-white', border: 'border-orange-400', shadow: 'shadow-orange-200', iconBg: 'bg-orange-400/30', label: 'text-orange-100', animate: 'animate-pulse' };
        return { bg: 'bg-white', text: 'text-gray-900', border: 'border-gray-200', shadow: 'shadow-sm', iconBg: 'bg-orange-100', label: 'text-gray-400', animate: '' };
    };

    const s = getStreakStyles(streakCount);

    // 🎙️ 3. MANEJADORES
    const handleStreakTest = (e) => setStreakCount(parseInt(e.target.value));

    const downloadCertificate = (courseTitle) => {
        toast.success(`Generando certificado para: ${courseTitle}`, { icon: '🎓' });
    };

    return (
        <div className="min-h-screen bg-[#f8f9fb] pb-20 relative overflow-x-hidden">
            
            {/* PANEL DE CONTROL ADMIN */}
            {user?.role === 'admin' && (
                <div className={`fixed right-0 top-1/3 z-[100] transition-transform duration-300 ${isAdminPanelOpen ? 'translate-x-0' : 'translate-x-[220px]'}`}>
                    <div className="flex items-start">
                        <button onClick={() => setIsAdminPanelOpen(!isAdminPanelOpen)} className="bg-gray-800 text-white p-3 rounded-l-2xl shadow-xl">
                            <AdjustmentsHorizontalIcon className="h-6 w-6" />
                        </button>
                        <div className="bg-white p-6 w-[220px] shadow-2xl border-l border-gray-200 rounded-bl-2xl">
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
                            <div className={`p-2 rounded-xl ${s.iconBg}`}>
                                <FireIcon className={`h-7 w-7 ${streakCount > 0 ? 'text-orange-500' : 'text-gray-300'} ${s.animate}`} />
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
                                    <div className="absolute bottom-0 left-0 w-full h-1 rounded-full" style={{ backgroundColor: PRIMARY_COLOR }}></div>
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
                            // 🎙️ Cálculo de progreso corregido
                            const total = courseData.lessons?.length || 0;
                            const done = item.completedLessons?.length || 0;
                            const progress = total > 0 ? Math.round((done / total) * 100) : 0;
                            const isFullyCompleted = progress === 100;
                            
                            const imgUrl = courseData.thumbnail?.startsWith('http') 
                                ? courseData.thumbnail 
                                : `${api.defaults.baseURL.replace('/api', '')}${courseData.thumbnail}`;;

                            return (
                                <div key={item._id} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col group relative">
                                    
                                    {isFullyCompleted && (
                                        <div className="absolute top-4 right-4 z-10 bg-green-500 text-white p-2 rounded-xl shadow-lg">
                                            <AcademicCapIcon className="h-5 w-5" />
                                        </div>
                                    )}

                                    <div className="relative h-48 overflow-hidden">
                                        <img src={imgUrl} className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110`} alt={courseData.title} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                            <PlayCircleIcon className="h-5 w-5 text-white/80" />
                                            <span className="text-white text-[10px] font-bold uppercase tracking-wider">{total} Lecciones</span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="font-extrabold text-lg mb-4 text-gray-800 leading-tight h-14 line-clamp-2">{courseData.title}</h3>
                                        
                                        <div className="mt-auto space-y-5">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                                                    <span className="text-gray-400">Progreso</span>
                                                    <span style={{ color: isFullyCompleted ? '#10b981' : PRIMARY_COLOR }}>{progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                                    <div 
                                                        className="h-full transition-all duration-1000 ease-out" 
                                                        style={{ 
                                                            width: `${progress}%`, 
                                                            backgroundColor: isFullyCompleted ? '#10b981' : PRIMARY_COLOR 
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <Link 
                                                    to={`/curso/${courseData._id}`} 
                                                    className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-xs text-white transition-all transform active:scale-95 shadow-lg" 
                                                    style={{ backgroundColor: isFullyCompleted ? '#10b981' : PRIMARY_COLOR }}
                                                >
                                                    {isFullyCompleted ? 'REPASAR CURSO' : 'CONTINUAR APRENDIENDO'} <ArrowRightIcon className="h-4 w-4" />
                                                </Link>

                                                {isFullyCompleted && (
                                                    <button 
                                                        onClick={() => downloadCertificate(courseData.title)}
                                                        className="flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-xs border-2 transition-all transform active:scale-95 bg-yellow-50 text-yellow-700 border-yellow-200"
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
                        <h2 className="text-xl font-bold text-gray-800">No hay cursos {activeTab === 'completed' ? 'completados' : 'en curso'}</h2>
                        <Link to="/" className="inline-block mt-4 px-8 py-3 rounded-xl font-bold text-white shadow-md" style={{ backgroundColor: PRIMARY_COLOR }}>Explorar Catálogo</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyLearning;