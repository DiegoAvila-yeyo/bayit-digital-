import React from 'react';

export const Hero = ({ PRIMARY_COLOR = "#F7A823" }) => {
  const SECONDARY_DARK = "#1A1A1A"; 

  return (
    <section className="relative min-h-[80vh] flex items-center py-16 lg:py-32 overflow-hidden bg-black">
      
      {/* --- RESPONSIVE BACKGROUND IMAGE (Mobile only) --- */}
      <div className="absolute inset-0 lg:hidden">
        <img 
          src="/imagenes/bayit-logo.jpeg" 
          alt="Background" 
          className="w-full h-full object-cover opacity-30 blur-md"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black"></div>
      </div>

      {/* Capa de Gradiente Estándar */}
      <div 
        className="absolute inset-0 opacity-80 z-0"
        style={{ 
          background: `linear-gradient(135deg, ${SECONDARY_DARK} 0%, #2D2D2D 100%)` 
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between relative z-10">
        
        {/* Contenedor de Texto */}
        <div className="w-full lg:max-w-xl bg-white/95 sm:bg-white p-8 md:p-12 rounded-2xl shadow-2xl text-left border-t-4 backdrop-blur-sm sm:backdrop-blur-none" 
             style={{ borderTopColor: PRIMARY_COLOR }}>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 text-gray-900">
            Mismo Corazón, <br />
            <span style={{ color: PRIMARY_COLOR }}>Diferente Imagen.</span>
          </h1>
          
          <p className="text-base sm:text-xl font-medium mb-8 text-gray-600 leading-relaxed">
            El amor del Padre está esperando por ti. Inicia hoy tu formación bíblica y de liderazgo con excelencia académica y fuego espiritual.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              className="w-full sm:w-auto px-8 py-4 text-white font-black rounded-xl transition duration-300 shadow-lg transform hover:-translate-y-1 active:scale-95"
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              Empezar ahora
            </button>
            <button 
              className="w-full sm:w-auto px-8 py-4 border-2 font-black rounded-xl transition duration-300 hover:bg-gray-50 active:scale-95"
              style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
            >
              Explorar Cursos
            </button>
          </div>
        </div>

        {/* Contenedor de Imagen (Visible solo en Desktop) */}
        <div className="hidden lg:flex relative lg:w-1/2 justify-center mt-12 lg:mt-0">
          <div className="relative group">
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
    </section>
  );
};