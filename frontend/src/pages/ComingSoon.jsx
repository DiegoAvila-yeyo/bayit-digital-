import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hammer, ArrowLeft, Sparkles } from 'lucide-react';

const ComingSoon = ({ PRIMARY_COLOR = "#F7A823" }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-4 overflow-hidden relative">
      {/* Efectos de fondo decorativos */}
      <div 
        className="absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-[120px] opacity-10"
        style={{ backgroundColor: PRIMARY_COLOR }}
      ></div>
      
      <div className="max-w-2xl w-full text-center z-10">
        {/* Icono Animado */}
        <div className="relative inline-block mb-8">
          <div 
            className="absolute inset-0 rounded-full blur-2xl opacity-20 animate-pulse"
            style={{ backgroundColor: PRIMARY_COLOR }}
          ></div>
          <div 
            className="relative bg-[#1A1A1A] border border-white/10 p-6 rounded-3xl shadow-2xl"
          >
            <Hammer size={48} color={PRIMARY_COLOR} className="animate-bounce" />
          </div>
        </div>

        {/* Mensaje Principal */}
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
          Estamos <span style={{ color: PRIMARY_COLOR }}>preparando</span> algo grande
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl mb-12 leading-relaxed">
          Senda <span className="font-bold text-white">PRO</span> está en su fase final de construcción. 
          Muy pronto tendrás acceso a certificaciones, mentorías y recursos exclusivos 
          para llevar tu llamado al siguiente nivel.
        </p>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white border border-white/10 hover:bg-white/5 transition-all"
          >
            <ArrowLeft size={20} />
            Volver atrás
          </button>
          
          <button
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-black text-black transition-all transform hover:scale-105 active:scale-95 shadow-xl"
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            <Sparkles size={20} />
            Notificarme al lanzar
          </button>
        </div>

        {/* Cita Inspiracional */}
        <div className="mt-20 pt-8 border-t border-white/5">
          <p className="text-sm italic text-gray-500">
            "Porque yo sé muy bien los planes que tengo para ustedes —afirma el Señor—..." <br />
            Jeremías 29:11
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;