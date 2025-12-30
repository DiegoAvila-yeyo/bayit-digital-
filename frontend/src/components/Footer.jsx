
export const Footer = ({ PRIMARY_COLOR }) => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Columna 1: Logo y Eslogan */}
          <div className="col-span-2 md:col-span-1">
            <h3 className={`text-2xl font-bold text-${PRIMARY_COLOR}-400 mb-2`}>Senda Digital</h3>
            <p className="text-gray-400 text-sm">Crecimiento constante, fe profunda.</p>
            
            {/* Íconos de Redes Sociales */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className={`text-gray-400 hover:text-${PRIMARY_COLOR}-400 transition`} aria-label="Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14 12h-2v-2h2v2zm7-7v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2zM12 17c1.474 0 2.822-.27 4-.711V7.71C14.822 7.27 13.474 7 12 7c-1.474 0-2.822.27-4 .711v8.578c1.178.441 2.526.711 4 .711zM18 5H6v14h12V5z" fillRule="evenodd"></path></svg>
              </a>
              <a href="#" className={`text-gray-400 hover:text-${PRIMARY_COLOR}-400 transition`} aria-label="Twitter">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.7 5.09a.5.5 0 00-.7-.41L12 8.35 4.3 4.68a.5.5 0 00-.7.41V19a.5.5 0 00.5.5h15.4a.5.5 0 00.5-.5V5.09zM12 9.65l6.7-3.26V18.5H5.3V6.39L12 9.65z" fillRule="evenodd"></path></svg>
              </a>
              <a href="#" className={`text-gray-400 hover:text-${PRIMARY_COLOR}-400 transition`} aria-label="Instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2H6a4 4 0 00-4 4v12a4 4 0 004 4h12a4 4 0 004-4V6a4 4 0 00-4-4zm-8 4h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V8a2 2 0 012-2zm0 10h4a2 2 0 012 2v2a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2a2 2 0 012-2zM9 10a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2z" fillRule="evenodd"></path></svg>
              </a>
            </div>
          </div>
          
          {/* Columna 2: Cursos Populares */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Cursos</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">Hermenéutica Bíblica</a></li>
              <li><a href="#" className="hover:text-white transition">Teología Sistemática</a></li>
              <li><a href="#" className="hover:text-white transition">Liderazgo Pastoral</a></li>
              <li><a href="#" className="hover:text-white transition">Misiones Modernas</a></li>
            </ul>
          </div>
          
          {/* Columna 3: Sobre Senda Digital */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Compañía</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">Acerca de Nosotros</a></li>
              <li><a href="#" className="hover:text-white transition">Nuestro Equipo</a></li>
              <li><a href="#" className="hover:text-white transition">Contáctanos</a></li>
            </ul>
          </div>

          {/* Columna 4: Recursos */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Recursos</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">Centro de Ayuda</a></li>
              <li><a href="#" className="hover:text-white transition">Privacidad</a></li>
            </ul>
          </div>

          {/* Columna 5: Enseña */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-lg font-semibold text-white mb-4">Únete a la Misión</h4>
            <p className="text-sm text-gray-400 mb-4">Comparte tu conocimiento teológico con miles de estudiantes.</p>
            <button className={`px-6 py-2 bg-${PRIMARY_COLOR}-500 text-white font-bold rounded-lg hover:bg-${PRIMARY_COLOR}-600 transition text-sm w-full`}>
              Enseña con Nosotros
            </button>
          </div>

        </div>

        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Senda Digital. Todos los derechos reservados.</p>
          <p className="mt-4 md:mt-0">Hecho con <span className="text-red-500">❤</span> para el Crecimiento.</p>
        </div>
      </div>
    </footer>
  );
};