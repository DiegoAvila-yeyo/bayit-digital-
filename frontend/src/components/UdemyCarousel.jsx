import React, { useState, useEffect, useContext } from 'react';
import { CourseCardHover } from './CourseCardHover';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export const UdemyCarousel = ({ PRIMARY_COLOR = "#F7A823" }) => {
  const { user } = useContext(AuthContext); 
  const [courses, setCourses] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    const fetchTrendingCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get('/courses');
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
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar tendencias:", error);
        setLoading(false);
      }
    };
    fetchTrendingCourses();
  }, [user]);

  useEffect(() => {
    const updateItems = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else setItemsPerPage(4);
    };
    updateItems();
    window.addEventListener('resize', updateItems);
    return () => window.removeEventListener('resize', updateItems);
  }, []);

  // --- VARIABLES DE NAVEGACIÓN ---
  const totalPages = Math.ceil(courses.length / itemsPerPage);
  const maxIndex = Math.max(0, courses.length - itemsPerPage);

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

  if (loading) return (
    <div className="py-20 text-center animate-pulse font-bold" style={{ color: PRIMARY_COLOR }}>
        Cargando lo nuevo de la comunidad...
    </div>
  );

  if (courses.length === 0) return null;

  return (
    <section className="py-12 sm:py-20 bg-white overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <div className="h-1.5 w-16 mb-4 rounded-full bg-orange-400 mx-auto md:mx-0" style={{ backgroundColor: PRIMARY_COLOR }}></div>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Lo que el Espíritu <span style={{ color: PRIMARY_COLOR }}>está inspirando</span>
            </h2>
          </div>

          <div className="hidden sm:flex space-x-2">
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
        
        <div className="relative group">
          <div className="overflow-x-auto sm:overflow-hidden py-4"> 
            <div 
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] gap-4 sm:gap-6"
              style={{ 
                transform: window.innerWidth >= 640 ? `translateX(-${(currentIndex * (100 / itemsPerPage))}%)` : 'none'
              }}
            >
              {courses.map((curso, index) => (
                <div key={curso._id || index} className="w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] flex-shrink-0">
                  <CourseCardHover curso={curso} PRIMARY_COLOR={PRIMARY_COLOR} />
                </div>
              ))}
            </div>
          </div>

          {/* Botones de navegación (Desktop) */}
          {currentIndex > 0 && (
            <button 
                onClick={prevSlide} 
                className="hidden sm:flex absolute -left-6 top-1/2 -translate-y-1/2 bg-white border border-gray-100 rounded-2xl w-14 h-14 items-center justify-center shadow-2xl z-50 transition-all hover:scale-110"
            >
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
            </button>
          )}

          {currentIndex < maxIndex && (
            <button 
                onClick={nextSlide} 
                className="hidden sm:flex absolute -right-6 top-1/2 -translate-y-1/2 rounded-2xl w-14 h-14 items-center justify-center shadow-2xl z-50 transition-all hover:scale-110 text-white"
                style={{ backgroundColor: PRIMARY_COLOR }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};