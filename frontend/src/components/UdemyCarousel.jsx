import React, { useState, useEffect, useContext } from 'react';
import { CourseCardHover } from './CourseCardHover';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export const UdemyCarousel = ({ PRIMARY_COLOR = "#F7A823" }) => {
  const { user } = useContext(AuthContext); 
  const [courses, setCourses] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Configuración de visualización
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchTrendingCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/courses');
        
        let finalCourses = response.data;

        // FILTRAR CURSOS YA COMPRADOS
        if (user && user.purchasedCourses) {
            finalCourses = finalCourses.filter(course => 
                !user.purchasedCourses.some(pc => {
                    const purchasedId = pc.courseId?._id || pc.courseId;
                    return purchasedId === course._id;
                })
            );
        }
        
        setCourses(finalCourses);
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
  const totalPages = Math.ceil(courses.length / itemsPerPage);
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
        <div 
          className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          style={{ color: PRIMARY_COLOR }}
        ></div>
        <p className="mt-4 text-gray-500 italic font-medium">Buscando las mejores enseñanzas para tu crecimiento...</p>
      </div>
    );
  }

  if (courses.length === 0) return null;

  return (
    <section className="py-20 bg-white overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ENCABEZADO CON IDENTIDAD BAYIT */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="mb-6 md:mb-0">
            <div 
              className="h-1.5 w-16 mb-4 rounded-full" 
              style={{ backgroundColor: PRIMARY_COLOR }}
            ></div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight sm:text-4xl">
              Lo que el Espíritu <span style={{ color: PRIMARY_COLOR }}>está inspirando</span>
            </h2>
            <p className="mt-3 text-gray-500 text-lg max-w-xl">
              Explora las enseñanzas más buscadas por nuestra comunidad y profundiza en tu llamado.
            </p>
          </div>

          {/* INDICADOR DE PÁGINAS DINÁMICO */}
          <div className="flex space-x-2 mb-2">
             {Array.from({ length: totalPages }).map((_, i) => (
               <div 
                key={i}
                className="h-1.5 rounded-full transition-all duration-500"
                style={{ 
                  width: Math.floor(currentIndex / itemsPerPage) === i ? '32px' : '8px',
                  backgroundColor: Math.floor(currentIndex / itemsPerPage) === i ? PRIMARY_COLOR : '#E5E7EB'
                }}
               />
             ))}
          </div>
        </div>
        
        <div className="relative group/carousel">
          {/* CONTENEDOR DEL CARRUSEL */}
          <div className="overflow-hidden py-4 -mx-2 px-2"> 
            <div 
              className="flex transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] gap-6"
              style={{ 
                transform: `translateX(-${(currentIndex * (100 / itemsPerPage))}%)` 
              }}
            >
              {courses.map((curso, index) => {
                // Lógica para el despliegue del tooltip
                const relativeIndex = index - currentIndex;
                const isLastInVisibleRow = relativeIndex >= (itemsPerPage - 2); 

                return (
                  <div key={curso._id || index} className="w-[calc(25%-18px)] flex-shrink-0 transition-all duration-500">
                    <CourseCardHover 
                      curso={curso} 
                      PRIMARY_COLOR={PRIMARY_COLOR}
                      isLastInRow={isLastInVisibleRow} 
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* BOTÓN ANTERIOR (ESTILO MODERNO) */}
          {currentIndex > 0 && (
            <button 
                onClick={prevSlide} 
                className="absolute -left-6 top-1/2 -translate-y-1/2 bg-white border border-gray-100 rounded-2xl w-14 h-14 flex items-center justify-center shadow-2xl z-50 transition-all hover:scale-110 active:scale-95 group/btn"
                aria-label="Anterior"
            >
              <svg className="w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
          )}

          {/* BOTÓN SIGUIENTE (ESTILO BAYIT) */}
          {currentIndex < maxIndex && (
            <button 
                onClick={nextSlide} 
                className="absolute -right-6 top-1/2 -translate-y-1/2 rounded-2xl w-14 h-14 flex items-center justify-center shadow-2xl z-50 transition-all hover:scale-110 active:scale-95 group/btn text-white"
                style={{ backgroundColor: PRIMARY_COLOR }}
                aria-label="Siguiente"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};