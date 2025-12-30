import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const CourseCardHover = ({ curso, PRIMARY_COLOR, isLastInRow }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    /* CAMBIO CLAVE 1: Usamos curso.slug para la URL dinámica */
    <Link
      to={`/curso/${curso.slug}`} 
      className="relative w-full"
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ zIndex: isHovered ? 100 : 10 }}
      >
    
      {/* 1. Tarjeta Base */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
        
        <div className="relative h-36 w-full overflow-hidden">
          <img 
            src={curso.image} 
            alt={curso.title}
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-105 brightness-90' : 'scale-100'}`} 
          />
        </div>
        
        <div className={`
          p-3 transition-colors duration-300
          ${isHovered ? 'bg-gray-50' : 'bg-white'}
        `}>
          <h3 className="font-bold text-sm leading-tight text-gray-900 line-clamp-2 mb-1 text-left">
            {curso.title}
          </h3>
          <p className="text-[11px] text-gray-600 truncate mb-1 text-left">{curso.instructor}</p>
          
          <div className="flex items-center gap-1 mb-1">
            <span className="text-sm font-bold text-[#b4690e]">{curso.rating}</span>
            <div className="flex text-[#b4690e] text-[10px]">★★★★★</div>
            <span className="text-[11px] text-gray-500">({curso.reviews})</span>
          </div>
          
          <div className="flex items-center gap-2 text-left">
            <span className="text-sm font-bold text-gray-900">{curso.price} MX$</span>
            {curso.oldPrice && (
              <span className="text-xs text-gray-500 line-through">{curso.oldPrice} MX$</span>
            )}
          </div>

          {curso.isBestseller && (
            <div className="mt-1 inline-block bg-[#eceb98] text-[#3d3c0a] text-[10px] font-bold px-2 py-0.5 rounded-sm">
              Lo más vendido
            </div>
          )}
        </div>
      </div>

      {/* 2. Popover (Tarjeta Flotante) */}
      <div className={`
        absolute top-[-20px] w-[330px] bg-white border border-gray-200 shadow-[0_4px_16px_rgba(0,0,0,0.2)] p-5 hidden lg:block rounded-md
        transition-all duration-200 z-[200]
        ${isLastInRow ? 'right-[105%]' : 'left-[105%]'} 
        ${isHovered ? 'opacity-100 translate-x-0 visible' : 'opacity-0 translate-x-2 invisible'}
      `}>
        <div className={`
          absolute top-12 w-3 h-3 bg-white border-gray-200 transform rotate-45 
          ${isLastInRow ? 'right-[-7px] border-r border-t' : 'left-[-7px] border-l border-b'}
        `} />
        
        <div className="text-left">
          <h2 className="text-[17px] font-bold text-gray-900 mb-1 leading-tight">
            {curso.title}
          </h2>
          
          <div className="flex items-center gap-2 mb-2">
            {curso.isBestseller && (
              <span className="bg-[#eceb98] text-[#3d3c0a] text-[11px] font-bold px-2 py-0.5">Lo más vendido</span>
            )}
            <span className="text-[#1e3a34] text-[11px] font-bold">
              Actualizado <span className="text-[#1e3a34]">{curso.updatedDate}</span>
            </span>
          </div>

          <p className="text-[12px] text-gray-500 mb-3">
            {curso.totalHours} horas en total • {curso.level} • Subtítulos
          </p>
          
          <p className="text-[13px] text-gray-700 mb-4 leading-normal">
            {curso.description}
          </p>
          
          <ul className="space-y-2 mb-6">
            {/* CAMBIO CLAVE 2: Aseguramos que objetivos exista antes de hacer .map */}
            {curso.objectives && curso.objectives.slice(0, 3).map((obj, i) => (
              <li key={i} className="flex items-start text-[13px] text-gray-800">
                <span className="mr-3 text-gray-500 mt-1">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </span>
                {obj}
              </li>
            ))}
          </ul>

          <div className="flex gap-2">
            <button 
              onClick={(e) => {
                e.preventDefault(); // Evita que el Link se active si solo queremos añadir al carrito
                console.log("Añadido al carrito:", curso.title);
              }}
              className="flex-1 py-3 text-white font-bold text-sm transition-colors"
              style={{ backgroundColor: PRIMARY_COLOR || '#a435f0' }}
            >
              Añadir a la cesta
            </button>
            <button 
              onClick={(e) => e.preventDefault()}
              className="p-3 border border-gray-900 rounded-full hover:bg-gray-50 transition-colors"
            >
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
          </div>
        </div>
      </div>
      </div>
    </Link>
  );
};