import React, { useRef, useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios'; // 🎙️ CAMBIO 1: Usamos tu instancia configurada con interceptores
import { AuthContext } from '../context/AuthContext';

export const CourseCarousel = ({ PRIMARY_COLOR = "#F7A823" }) => {
    const { user } = useContext(AuthContext); 
    const scrollRef = useRef(null);
    const [courses, setCourses] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [cardsPerPage, setCardsPerPage] = useState(3);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // 🎙️ CAMBIO 2: Usamos 'api' y la ruta relativa. 
                // Esto asegura que si cambias el dominio en axios.js, todo siga funcionando.
                const response = await api.get('/courses');
                let allCourses = response.data;

                // 🎙️ CAMBIO 3: Lógica de filtrado más segura.
                // Filtramos para que no aparezcan en la Home cursos que el usuario YA compró.
                if (user && user.purchasedCourses) {
                    allCourses = allCourses.filter(course => 
                        !user.purchasedCourses.some(pc => {
                            const purchasedId = pc.courseId?._id || pc.courseId;
                            return purchasedId === course._id;
                        })
                    );
                }
                
                setCourses(allCourses);
                setLoading(false);
            } catch (error) {
                console.error("Error cargando cursos:", error);
                setLoading(false);
            }
        };
        fetchCourses();
    }, [user]); // 🎙️ Se recarga si el usuario inicia sesión o compra algo

    // ... (Lógica de responsive y scroll se mantiene igual porque está excelente)
    useEffect(() => {
        const updateCardsPerPage = () => {
            if (window.innerWidth < 640) setCardsPerPage(1);
            else if (window.innerWidth < 1024) setCardsPerPage(2);
            else setCardsPerPage(3);
        };
        updateCardsPerPage();
        window.addEventListener('resize', updateCardsPerPage);
        return () => window.removeEventListener('resize', updateCardsPerPage);
    }, []);

    const totalPages = Math.ceil(courses.length / cardsPerPage);

    const handleScroll = (direction) => {
        if (!scrollRef.current) return;
        const firstCard = scrollRef.current.querySelector('a'); 
        if (!firstCard) return;

        const cardWidth = firstCard.offsetWidth;
        const gap = 24; 
        const scrollDistance = (cardWidth * cardsPerPage) + (gap * (cardsPerPage - 1));
        
        if (direction === 'next' && currentPage < totalPages - 1) {
            scrollRef.current.scrollBy({ left: scrollDistance, behavior: 'smooth' });
            setCurrentPage(prev => prev + 1);
        } else if (direction === 'prev' && currentPage > 0) {
            scrollRef.current.scrollBy({ left: -scrollDistance, behavior: 'smooth' });
            setCurrentPage(prev => prev - 1);
        }
    };

    if (loading) return (
        <div className="py-20 text-center animate-pulse font-bold" style={{ color: PRIMARY_COLOR }}>
            Abriendo los rollos de la biblioteca...
        </div>
    );

    if (courses.length === 0) return null; 

    return (
        <section className="py-16 sm:py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row justify-between lg:space-x-12 lg:items-center"> 
                    
                    {/* Panel de Control Izquierdo */}
                    <div className="lg:w-1/3 mb-12 lg:mb-0 lg:pr-8 flex-shrink-0">
                        <div className="inline-block px-4 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">
                            Cursos Destacados
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
                            Tu próximo <br /> 
                            <span style={{ color: PRIMARY_COLOR }}>desafío espiritual</span>
                        </h2>
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed"> 
                            Inicia hoy una formación que trasciende lo académico para tocar lo eterno.
                        </p>
                        
                        {totalPages > 1 && (
                            <div className="hidden lg:flex space-x-4">
                                <button 
                                    onClick={() => handleScroll('prev')}
                                    className={`p-4 border-2 rounded-full transition-all duration-300 ${currentPage === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-gray-50 hover:shadow-md active:scale-90'}`}
                                    style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </button>
                                <button 
                                    onClick={() => handleScroll('next')}
                                    className={`p-4 border-2 rounded-full transition-all duration-300 ${currentPage === totalPages - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:shadow-lg active:scale-90'}`}
                                    style={{ backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR, color: 'white' }}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {/* Carrusel */}
                    <div className="lg:w-2/3 relative">
                        <div 
                            ref={scrollRef} 
                            className="flex overflow-x-hidden space-x-6 pb-8 w-full"
                            style={{ scrollSnapType: 'x mandatory' }} 
                        > 
                            {courses.map((curso) => (
                                <Link 
                                    key={curso._id}
                                    to={`/curso/${curso._id}`} 
                                    className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] h-[440px] bg-black rounded-3xl shadow-2xl overflow-hidden group relative transition-all duration-500 hover:-translate-y-3"
                                    style={{ scrollSnapAlign: 'start' }}
                                >
                                    <div className="h-full w-full relative">
                                        <img 
                                            src={curso.thumbnail?.startsWith('http') ? curso.thumbnail : `http://localhost:5000${curso.thumbnail}`} 
                                            alt={curso.title} 
                                            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-90" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 p-6 backdrop-blur-[1px]"> 
                                        <div 
                                            className="inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-3 text-white shadow-lg"
                                            style={{ backgroundColor: PRIMARY_COLOR }}
                                        >
                                            {curso.category?.name || 'Teología'}
                                        </div>
                                        
                                        <h3 className="text-xl font-bold text-white line-clamp-2 mb-4 leading-snug min-h-[3.5rem]">
                                            {curso.title}
                                        </h3>
                                        
                                        <div className="flex justify-between items-center border-t border-white/20 pt-4"> 
                                            <div className="flex items-center">
                                                <div className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: PRIMARY_COLOR }}></div>
                                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                                    {curso.level || 'General'}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-[10px] text-gray-400 font-bold uppercase">Inversión</span>
                                                <span className="font-black text-2xl text-white">
                                                    ${curso.price}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div> 
                    </div>
                </div>
            </div>
        </section>
    );
};