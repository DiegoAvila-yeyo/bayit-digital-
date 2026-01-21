import React from 'react';

export const Hero = ({ PRIMARY_COLOR = "#F7A823" }) => {
  // Definimos un color oscuro de contraste basado en tu logo
  const SECONDARY_DARK = "#1A1A1A"; 

  return (
    <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden bg-black">
      {/* Capa de Gradiente de Fondo: Ahora más profunda para que el texto resalte */}
      <div 
        className="absolute inset-0 opacity-80 z-0"
        style={{ 
          background: `linear-gradient(135deg, ${SECONDARY_DARK} 0%, #2D2D2D 100%)` 
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between relative z-10">
        
        {/* Contenedor de Texto */}
        <div className="max-w-xl bg-white p-8 md:p-12 rounded-2xl shadow-2xl text-left border-t-4" 
             style={{ borderTopColor: PRIMARY_COLOR }}>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 text-gray-900">
            Mismo Corazón, <br />
            <span style={{ color: PRIMARY_COLOR }}>Diferente Imagen.</span>
          </h1>
          
          <p className="text-lg sm:text-xl font-medium mb-8 text-gray-600 leading-relaxed">
            El amor del Padre está esperando por ti. Inicia hoy tu formación bíblica y de liderazgo con excelencia académica y fuego espiritual.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              className="px-8 py-4 text-white font-black rounded-xl transition duration-300 shadow-lg transform hover:-translate-y-1"
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              Empezar ahora
            </button>
            <button 
              className="px-8 py-4 border-2 font-black rounded-xl transition duration-300 hover:bg-gray-50"
              style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
            >
              Explorar Cursos
            </button>
          </div>
        </div>

        {/* Contenedor de Imagen (El León de Judá) */}
        <div className="relative lg:w-1/2 flex justify-center mt-12 lg:mt-0">
          <div className="relative group">
            {/* Aura decorativa detrás del logo */}
            <div 
              className="absolute -inset-4 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition duration-500"
              style={{ backgroundColor: PRIMARY_COLOR }}
            ></div>
            
            <img 
              src="/imagenes/bayit-logo.jpeg" 
              alt="BAYIT Centro Cristiano Bíblico" 
              className="relative w-full max-w-sm h-auto rounded-3xl shadow-2xl transform transition duration-500 hover:scale-105 border-4 border-white/10"
            />
          </div>
        </div>

      </div>

      {/* Elemento decorativo sutil en la esquina */}
      <div 
        className="absolute bottom-0 right-0 w-64 h-64 opacity-10 pointer-events-none"
        style={{ 
          background: `radial-gradient(circle, ${PRIMARY_COLOR} 0%, transparent 70%)` 
        }}
      ></div>
    </section>
  );
};