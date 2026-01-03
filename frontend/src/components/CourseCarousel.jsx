import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const CourseCarousel = ({ PRIMARY_COLOR }) => {
    const scrollRef = useRef(null);
    const [courses, setCourses] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [cardsPerPage, setCardsPerPage] = useState(3);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/courses');
                setCourses(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error cargando cursos en el carrusel:", error);
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

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
        const gap = 16; 
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
        <div className="py-20 text-center animate-pulse text-gray-500 font-medium">
            Conectando con la biblioteca espiritual...
        </div>
    );

    return (
        <section className="py-16 sm:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row justify-between lg:space-x-12 lg:items-start"> 
                    
                    <div className="lg:w-1/3 mb-8 lg:mb-0 lg:pr-8 flex-shrink-0">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                            Encuentra tu próximo <br /> desafío espiritual
                        </h2>
                        <p className="text-gray-700 text-lg mb-6"> 
                            Explora nuestra biblioteca dinámica. Cursos reales, maestros reales, ahora en la nube.
                        </p>
                        <div className="hidden lg:flex space-x-3">
                            <button 
                                onClick={() => handleScroll('prev')}
                                disabled={currentPage === 0}
                                className={`p-3 border rounded-full transition ${currentPage === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                                style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </button>
                            <button 
                                onClick={() => handleScroll('next')}
                                disabled={currentPage === totalPages - 1}
                                className={`p-3 border rounded-full transition ${currentPage === totalPages - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                                style={{ backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR, color: 'white' }}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </button>
                        </div>
                    </div>
                    
                    <div className="lg:w-2/3 relative flex flex-col items-center">
                        <div 
                            ref={scrollRef} 
                            className="flex overflow-x-hidden space-x-4 pb-6 w-full"
                            style={{ scrollSnapType: 'x mandatory' }} 
                        > 
                            {courses.map((curso) => (
                                <Link 
                                    key={curso._id}
                                    to={`/curso/${curso._id}`} 
                                    className="flex-shrink-0 w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-10.66px)] h-80 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-all duration-300 relative group"
                                    style={{ scrollSnapAlign: 'start', zIndex: 10 }}
                                >
                                    <div className="h-full w-full">
                                        <img 
                                            src={curso.thumbnail || curso.image || 'https://via.placeholder.com/400x225'} 
                                            alt={curso.title} 
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 text-white p-5"> 
                                        <span 
                                            className="inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider mb-2"
                                            style={{ backgroundColor: PRIMARY_COLOR }}
                                        >
                                            {/* Aquí usamos el nombre de la categoría del objeto */}
                                            {curso.category?.name || 'Curso'}
                                        </span>
                                        <h3 className="text-xl font-bold line-clamp-2 mb-2 leading-tight">
                                            {curso.title}
                                        </h3>
                                        <div className="flex justify-between items-center mt-4 border-t border-white/20 pt-3"> 
                                            <span className="text-xs font-medium text-gray-300 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                {curso.level || 'General'}
                                            </span>
                                            <span className="font-bold text-xl">${curso.price}</span>
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