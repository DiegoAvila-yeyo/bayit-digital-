import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const CourseCardHover = ({ curso, PRIMARY_COLOR, isLastInRow }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Formatear la fecha de actualización
  const formattedDate = curso.updatedAt 
    ? new Date(curso.updatedAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    : 'Recientemente';

  return (
    <Link to={`/curso/${curso._id}`} className="relative w-full">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ zIndex: isHovered ? 100 : 10 }}
      >
        {/* 1. Tarjeta Base */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
          <div className="relative h-36 w-full overflow-hidden">
            <img 
              src={curso.thumbnail || curso.image || 'https://via.placeholder.com/400x225'} 
              alt={curso.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-105 brightness-90' : 'scale-100'}`} 
            />
          </div>
          
          <div className={`p-3 transition-colors duration-300 ${isHovered ? 'bg-gray-50' : 'bg-white'}`}>
            <h3 className="font-bold text-sm leading-tight text-gray-900 line-clamp-2 mb-1 text-left">
              {curso.title}
            </h3>
            {/* CORRECCIÓN: Accedemos al nombre del maestro */}
            <p className="text-[11px] text-gray-600 truncate mb-1 text-left">
              {curso.teacher?.name || 'Instructor de Bayit'}
            </p>
            
            <div className="flex items-center gap-1 mb-1">
              <span className="text-sm font-bold text-[#b4690e]">{curso.rating || '5.0'}</span>
              <div className="flex text-[#b4690e] text-[10px]">★★★★★</div>
              <span className="text-[11px] text-gray-500">({curso.reviews || '0'})</span>
            </div>
            
            <div className="flex items-center gap-2 text-left">
              <span className="text-sm font-bold text-gray-900">${curso.price} MX$</span>
            </div>
          </div>
        </div>

        {/* 2. Popover (Tarjeta Flotante) */}
        <div className={`
          absolute top-[-20px] w-[330px] bg-white border border-gray-200 shadow-[0_4px_16px_rgba(0,0,0,0.2)] p-5 hidden lg:block rounded-md
          transition-all duration-200 z-[200]
          ${isLastInRow ? 'right-[105%]' : 'left-[105%]'} 
          ${isHovered ? 'opacity-100 translate-x-0 visible' : 'opacity-0 translate-x-2 invisible'}
        `}>
          <div className="text-left">
            <h2 className="text-[17px] font-bold text-gray-900 mb-1 leading-tight">{curso.title}</h2>
            
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#1e3a34] text-[11px] font-bold">
                Actualizado <span className="capitalize">{formattedDate}</span>
              </span>
            </div>

            <p className="text-[12px] text-gray-500 mb-3">
              {curso.duration || 'Contenido Premium'} • {curso.level} • Subtítulos
            </p>
            
            <p className="text-[13px] text-gray-700 mb-4 leading-normal line-clamp-3">
              {curso.description}
            </p>
            
            <div className="flex gap-2">
              <button 
                onClick={(e) => { e.preventDefault(); console.log("Añadido:", curso.title); }}
                className="flex-1 py-3 text-white font-bold text-sm transition-colors"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                Añadir a la cesta
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};