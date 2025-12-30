export const Hero = ({ PRIMARY_COLOR }) => {
  return (
    <section className={`relative bg-${PRIMARY_COLOR}-700 py-16 sm:py-24 lg:py-32 overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between">
        
        {/* Contenedor de Texto */}
        <div className="max-w-xl text-white z-10 lg:pr-12 mb-10 lg:mb-0 bg-white p-8 rounded-xl shadow-2xl text-gray-900">
          <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold leading-tight mb-4 text-gray-900">
            Crece en Fe y Habilidad
          </h1>
          <p className="text-lg sm:text-xl font-light mb-8 text-gray-700">
            Descubre cursos bíblicos, teológicos y de liderazgo para potenciar tu vida espiritual y tu servicio.
          </p>
          <div className="flex space-x-4">
            <button className={`px-6 py-3 bg-${PRIMARY_COLOR}-700 text-white font-bold rounded-lg hover:bg-${PRIMARY_COLOR}-800 transition duration-150 shadow-lg`}>
              Empezar
            </button>
            <button className={`px-6 py-3 border-2 border-${PRIMARY_COLOR}-700 text-${PRIMARY_COLOR}-700 font-bold rounded-lg hover:bg-${PRIMARY_COLOR}-100 transition duration-150`}>
              Ver Cursos
            </button>
          </div>
        </div>

        {/* Contenedor de Imagen */}
        <div className="relative lg:w-1/2 flex justify-center z-10">
          <img 
            src="/imagenes/trabajadores-empresriales.jpg" 
            alt="Ilustración de estudio bíblico" 
            className="w-full max-w-md h-auto rounded-xl shadow-2xl"
          />
        </div>

        {/* Capa de Gradiente de Fondo */}
        <div className={`absolute inset-0 bg-gradient-to-r from-${PRIMARY_COLOR}-800 to-${PRIMARY_COLOR}-600 opacity-90 z-0`}></div>
      </div>
    </section>
  );
};