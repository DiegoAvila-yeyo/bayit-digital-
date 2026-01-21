import React from 'react';
import { Link } from 'react-router-dom'; // <--- Importamos Link

export const SendaPro = ({ PRIMARY_COLOR = "#F7A823" }) => {
  const beneficiosPro = [
    { icon: 'book', text: 'Acceso a bibliotecas teológicas exclusivas' },
    { icon: 'certificate', text: 'Certificaciones con validez eclesiástica' },
    { icon: 'users', text: 'Mentoría personalizada con pastores y teólogos' },
    { icon: 'globe', text: 'Red global de liderazgo cristiano' }
  ];

  const SECONDARY_DARK = "#1A1A1A";

  return (
    <section className="py-16 sm:py-24" style={{ backgroundColor: '#0F0F0F' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="p-8 sm:p-12 lg:p-16 rounded-3xl shadow-2xl flex flex-col lg:flex-row items-center justify-between border border-white/5"
          style={{ backgroundColor: SECONDARY_DARK }}
        >
          {/* Contenido de la Izquierda */}
          <div className="lg:w-1/2 text-white mb-10 lg:mb-0 lg:pr-12">
            <h2 className="text-4xl lg:text-5xl font-black leading-tight mb-6">
              Senda <span style={{ color: PRIMARY_COLOR }}>PRO</span>: <br />
              Profundiza tu Ministerio
            </h2>
            <p className="text-lg text-gray-400 mb-10 leading-relaxed">
              Da el siguiente paso en tu vocación. Accede a un catálogo exclusivo de estudios profundos, diplomados y recursos para un liderazgo transformador. 
            </p>
            
            <div className="space-y-6 mb-10">
              {beneficiosPro.map((beneficio, index) => (
                <div key={index} className="flex items-center group">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center mr-4 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${PRIMARY_COLOR}20` }} 
                  >
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke={PRIMARY_COLOR} viewBox="0 0 24 24">
                      {beneficio.icon === 'book' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.49 9.352 5.092 8 5.059 6.648 5.025 5.168 5.423 4 6.253v13M12 6.253h-1.5m1.5 0h1.5m0 0V2.257A3.993 3.993 0 0012 2c-.512 0-1.011.054-1.492.158m-1.492.158V2.257A3.993 3.993 0 008 2c-.512 0-1.011.054-1.492.158M8 2.257A3.993 3.993 0 0112 2c.512 0 1.011.054 1.492.158m0 0V6.253M12 6.253h-1.5m1.5 0h1.5m0 0V2.257A3.993 3.993 0 0012 2c-.512 0-1.011.054-1.492.158"></path>}
                      {beneficio.icon === 'certificate' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>}
                      {beneficio.icon === 'users' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>}
                      {beneficio.icon === 'globe' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>}
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-gray-200">{beneficio.text}</p>
                </div>
              ))}
            </div>
            
            {/* CAMBIO: Envolvemos el botón con Link */}
            <Link to="/senda-pro-info">
              <button 
                className="px-10 py-4 text-white font-black rounded-xl transition duration-300 shadow-xl transform hover:-translate-y-1 active:scale-95 text-lg w-full sm:w-auto"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                Más Información sobre Senda PRO
              </button>
            </Link>
          </div>
          
          {/* Imagen de la Derecha */}
          <div className="lg:w-1/2 flex justify-center relative">
            <div className="relative">
              <div 
                className="absolute -inset-2 rounded-2xl opacity-30 blur-sm"
                style={{ backgroundColor: PRIMARY_COLOR }}
              ></div>
              <img 
                src="/imagenes/teologia-hombre.jpg" 
                alt="Liderazgo y estudio profundo" 
                className="relative w-full max-w-md h-auto rounded-2xl shadow-2xl transition duration-500 hover:rotate-1"
              />
              <div 
                className="absolute -top-6 -right-6 p-4 rounded-full shadow-2xl animate-bounce"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};