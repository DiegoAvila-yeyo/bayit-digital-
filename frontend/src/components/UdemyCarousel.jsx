import React, { useState, useEffect } from 'react';
import { CourseCardHover } from './CourseCardHover';
import axios from 'axios'; // Usamos axios para la conexión directa

export const UdemyCarousel = ({ PRIMARY_COLOR }) => {
  const [courses, setCourses] = useState([]); // Ahora se llama courses para ser claros
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const itemsPerPage = 4;

  // 1. Efecto para traer los cursos en tendencia desde MongoDB
  useEffect(() => {
    const fetchTrendingCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar tendencias:", error);
        setLoading(false);
      }
    };
    fetchTrendingCourses();
  }, []);

  // Calculamos el índice máximo basado en los datos reales que lleguen
  const maxIndex = Math.max(0, courses.length - itemsPerPage);

  const nextSlide = () => setCurrentIndex((prev) => Math.min(prev + itemsPerPage, maxIndex));
  const prevSlide = () => setCurrentIndex((prev) => Math.max(prev - itemsPerPage, 0));

  if (loading) return <div className="py-16 text-center">Buscando las mejores enseñanzas...</div>;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Cursos en tendencia</h2>
        
        <div className="relative group/carousel">
          <div className="overflow-hidden py-10 -my-10"> 
            <div 
              className="flex transition-transform duration-700 ease-in-out gap-5"
              style={{ transform: `translateX(-${(currentIndex * 100) / itemsPerPage}%)` }}
            >
              {courses.map((curso, index) => {
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

          {/* Flechas */}
          {currentIndex > 0 && (
            <button onClick={prevSlide} className="absolute -left-5 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full w-12 h-12 flex items-center justify-center shadow-xl z-[150] hover:scale-110 transition-all">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
            </button>
          )}

          {currentIndex < maxIndex && (
            <button onClick={nextSlide} className="absolute -right-5 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full w-12 h-12 flex items-center justify-center shadow-xl z-[150] hover:scale-110 transition-all">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};