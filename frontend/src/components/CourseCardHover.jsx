import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Usamos tu hook personalizado
import { ShoppingCart, Star } from 'lucide-react';

export const CourseCardHover = ({ curso, PRIMARY_COLOR = "#F7A823", isLastInRow }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart(); // Accedemos a tu función de añadir

  // Formateo de fecha para el popover
  const formattedDate = curso.updatedAt 
    ? new Date(curso.updatedAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    : 'Recientemente';

  const handleAction = (e) => {
    e.preventDefault(); // Evita que el Link principal redirija
    e.stopPropagation(); // Detiene la propagación del evento
    addToCart(curso); // Llama a tu función del CartContext
  };

  return (
    <div className="relative w-full">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative transition-all duration-300"
        style={{ zIndex: isHovered ? 100 : 10 }}
      >
        {/* TARJETA BASE */}
        <Link to={`/curso/${curso._id}`}>
          <div className={`bg-white border border-gray-100 rounded-xl overflow-hidden transition-all duration-500 shadow-sm ${isHovered ? 'shadow-2xl -translate-y-1' : ''}`}>
            <div className="relative h-40 w-full overflow-hidden">
              <img 
                src={curso.thumbnail || curso.image || 'https://via.placeholder.com/400x225'} 
                alt={curso.title}
                className={`w-full h-full object-cover transition-transform duration-1000 ${isHovered ? 'scale-110' : 'scale-100'}`} 
              />
            </div>
            
            <div className="p-4">
              <h3 className="font-extrabold text-sm leading-snug text-gray-900 line-clamp-2 mb-4">
                {curso.title}
              </h3>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-gray-900">${curso.price}</span>
                <div className="flex items-center gap-1 text-[10px] font-bold" style={{ color: PRIMARY_COLOR }}>
                  <Star size={12} fill={PRIMARY_COLOR} /> {curso.rating || '5.0'}
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* POPOVER (SÓLO BOTÓN DE COMPRA Y RESUMEN) */}
        <div className={`
          absolute top-[-10px] w-[320px] bg-white border border-gray-100 shadow-[0_25px_50px_rgba(0,0,0,0.2)] p-6 hidden lg:block rounded-2xl
          transition-all duration-300 ease-out z-[200] pointer-events-none
          ${isLastInRow ? 'right-[105%]' : 'left-[105%]'} 
          ${isHovered ? 'opacity-100 translate-x-0 visible' : 'opacity-0 translate-x-4 invisible'}
        `}>
          <div className="text-left pointer-events-auto">
            <h2 className="text-lg font-black text-gray-900 mb-3 leading-tight">
              {curso.title}
            </h2>
            
            <p className="text-[13px] text-gray-600 leading-relaxed mb-6 line-clamp-3 italic">
              "{curso.description || 'Una guía profunda para fortalecer tu ministerio y conocimiento de la Palabra.'}"
            </p>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleAction}
                className="w-full py-4 text-white font-black text-xs uppercase tracking-widest transition-all duration-300 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-95"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                <ShoppingCart size={16} />
                Añadir al Ministerio
              </button>
              
              <div className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">
                Última actualización: {formattedDate}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};