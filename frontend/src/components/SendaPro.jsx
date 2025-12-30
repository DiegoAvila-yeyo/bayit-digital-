export const SendaPro = ({ PRIMARY_COLOR }) => {
  // Definimos los beneficios aquí mismo para que el componente sea independiente
  const beneficiosPro = [
    { icon: 'book', text: 'Acceso a bibliotecas teológicas exclusivas' },
    { icon: 'certificate', text: 'Certificaciones con validez eclesiástica' },
    { icon: 'users', text: 'Mentoría personalizada con pastores y teólogos' },
    { icon: 'globe', text: 'Red global de liderazgo cristiano' }
  ];

  return (
    <section className="py-16 sm:py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 p-8 sm:p-12 lg:p-16 rounded-xl shadow-2xl flex flex-col lg:flex-row items-center justify-between">
          
          {/* Contenido de la Izquierda */}
          <div className="lg:w-1/2 text-white mb-10 lg:mb-0 lg:pr-12">
            <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
              Senda <span className={`text-${PRIMARY_COLOR}-400`}>PRO</span>: Profundiza tu Ministerio
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Da el siguiente paso en tu vocación. Accede a un catálogo exclusivo de estudios profundos, diplomados y recursos para un liderazgo transformador. 
            </p>
            
            {/* Lista de Beneficios */}
            <div className="space-y-4 mb-10">
              {beneficiosPro.map((beneficio, index) => (
                <div key={index} className="flex items-start">
                  <svg className={`w-6 h-6 mr-3 mt-1 text-${PRIMARY_COLOR}-400 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {beneficio.icon === 'book' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.49 9.352 5.092 8 5.059 6.648 5.025 5.168 5.423 4 6.253v13M12 6.253h-1.5m1.5 0h1.5m0 0V2.257A3.993 3.993 0 0012 2c-.512 0-1.011.054-1.492.158m-1.492.158V2.257A3.993 3.993 0 008 2c-.512 0-1.011.054-1.492.158M8 2.257A3.993 3.993 0 0112 2c.512 0 1.011.054 1.492.158m0 0V6.253M12 6.253h-1.5m1.5 0h1.5m0 0V2.257A3.993 3.993 0 0012 2c-.512 0-1.011.054-1.492.158"></path>}
                    {beneficio.icon === 'certificate' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>}
                    {beneficio.icon === 'users' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>}
                    {beneficio.icon === 'globe' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>}
                  </svg>
                  <p className="text-base text-gray-200">{beneficio.text}</p>
                </div>
              ))}
            </div>
            
            <button className={`px-8 py-3 bg-${PRIMARY_COLOR}-500 text-white font-bold rounded-lg hover:bg-${PRIMARY_COLOR}-600 transition duration-150 shadow-lg text-lg`}>
              Más Información sobre Senda PRO
            </button>
          </div>
          
          {/* Imagen de la Derecha */}
          <div className="lg:w-1/2 flex justify-center relative">
            <img 
              src="/imagenes/teologia-hombre.jpg" 
              alt="Liderazgo y estudio profundo" 
              className="w-full max-w-md h-auto rounded-xl shadow-2xl transform transition duration-500 hover:scale-[1.02]"
            />
            {/* Elemento decorativo */}
            <div className={`absolute -top-6 -right-6 p-4 bg-${PRIMARY_COLOR}-600 rounded-full shadow-xl hidden sm:block`}>
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};