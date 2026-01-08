import React, { useState, useEffect, useContext } from 'react';
import { CourseCardHover } from './CourseCardHover';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export const UdemyCarousel = ({ PRIMARY_COLOR }) => {
  const { user } = useContext(AuthContext); 
  const [courses, setCourses] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchTrendingCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/courses');
        
        // --- FILTRAR CURSOS YA COMPRADOS ---
        let finalCourses = response.data;
        if (user && user.purchasedCourses) {
            finalCourses = finalCourses.filter(course => 
                !user.purchasedCourses.some(pc => {
                    const purchasedId = pc.courseId?._id || pc.courseId;
                    return purchasedId === course._id;
                })
            );
        }
        
        setCourses(finalCourses);
        // Resetear el índice si al filtrar nos quedamos en una página que ya no existe
        setCurrentIndex(0); 
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar tendencias:", error);
        setLoading(false);
      }
    };
    fetchTrendingCourses();
  }, [user]);

  // Cálculos de navegación
  const maxIndex = courses.length > 0 ? Math.max(0, courses.length - itemsPerPage) : 0;

  const nextSlide = () => {
    setCurrentIndex((prev) => {
        const nextValue = prev + itemsPerPage;
        return nextValue > maxIndex ? maxIndex : nextValue;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
        const prevValue = prev - itemsPerPage;
        return prevValue < 0 ? 0 : prevValue;
    });
  };

  if (loading) {
    return (
      <div className="py-20 text-center animate-pulse">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-gray-400 motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-gray-500 italic">Buscando las mejores enseñanzas...</p>
      </div>
    );
  }

  // Si después de filtrar no hay cursos, ocultamos la sección para no mostrar un carrusel vacío
  if (courses.length === 0) return null;

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Cursos en tendencia</h2>
        
        <div className="relative group/carousel">
          {/* Contenedor del carrusel */}
          <div className="overflow-hidden py-4"> 
            <div 
              className="flex transition-transform duration-700 ease-in-out gap-5"
              style={{ 
                transform: `translateX(-${(currentIndex * (100 / itemsPerPage))}%)` 
              }}
            >
              {courses.map((curso, index) => {
                // Lógica para que el tooltip de CourseCardHover no se corte en los bordes
                const relativeIndex = index - currentIndex;
                const shouldOpenLeft = relativeIndex >= 2; 

                return (
                  <div key={curso._id || index} className="w-[calc(25%-15px)] flex-shrink-0">
                    <CourseCardHover 
                      curso={curso} 
                      PRIMARY_COLOR={PRIMARY_COLOR}
                      isLastInRow={shouldOpenLeft} 
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Botón Anterior */}
          {currentIndex > 0 && (
            <button 
                onClick={prevSlide} 
                className="absolute -left-5 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full w-12 h-12 flex items-center justify-center shadow-xl z-50 hover:bg-gray-50 transition-all hover:scale-110"
                aria-label="Anterior"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
          )}

          {/* Botón Siguiente */}
          {currentIndex < maxIndex && (
            <button 
                onClick={nextSlide} 
                className="absolute -right-5 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full w-12 h-12 flex items-center justify-center shadow-xl z-50 hover:bg-gray-50 transition-all hover:scale-110"
                aria-label="Siguiente"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};