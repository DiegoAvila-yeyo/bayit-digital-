import React from 'react';

export const Footer = ({ PRIMARY_COLOR = "#F7A823" }) => {
  return (
    <footer className="text-white py-16" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-12">
          
          {/* Columna 1: Identidad BAYIT */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-3xl font-black mb-4 tracking-tighter" style={{ color: PRIMARY_COLOR }}>
              BAYIT
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Crecimiento constante, fe profunda. Un hogar para el estudio y la transformación ministerial.
            </p>
            
            {/* Íconos de Redes Sociales con Hover Dorado */}
            <div className="flex space-x-5">
              {['facebook', 'twitter', 'instagram'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="text-gray-600 transition-colors duration-300"
                  onMouseEnter={(e) => e.target.style.color = PRIMARY_COLOR}
                  onMouseLeave={(e) => e.target.style.color = '#4B5563'}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    {social === 'facebook' && <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />}
                    {social === 'twitter' && <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />}
                    {social === 'instagram' && <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm10.5 2h-11A3.5 3.5 0 003 7.5v11A3.5 3.5 0 006.5 22h11a3.5 3.5 0 003.5-3.5v-11A3.5 3.5 0 0017.5 4zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm5-2a1 1 0 110 2 1 1 0 010-2z" />}
                  </svg>
                </a>
              ))}
            </div>
          </div>
          
          {/* Columna 2: Cursos */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6">Explorar</h4>
            <ul className="space-y-4 text-sm font-medium text-gray-500">
              <li><a href="#" className="hover:text-white transition-colors duration-300">Hermenéutica Bíblica</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Teología Sistemática</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Liderazgo Pastoral</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Misiones Modernas</a></li>
            </ul>
          </div>
          
          {/* Columna 3: Compañía */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6">Compañía</h4>
            <ul className="space-y-4 text-sm font-medium text-gray-500">
              <li><a href="#" className="hover:text-white transition-colors duration-300">Nuestra Visión</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Mentores</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Soporte</a></li>
            </ul>
          </div>

          {/* Columna 4: Legal */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6">Legal</h4>
            <ul className="space-y-4 text-sm font-medium text-gray-500">
              <li><a href="#" className="hover:text-white transition-colors duration-300">Términos de Uso</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Privacidad</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Cookies</a></li>
            </ul>
          </div>

          {/* Columna 5: Acción */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6">Únete a la Misión</h4>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              ¿Tienes un mensaje que el mundo necesita escuchar?
            </p>
            <button 
              className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 active:scale-95 shadow-lg shadow-orange-900/10"
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              Enseña en Bayit
            </button>
          </div>

        </div>

        {/* Línea final y créditos */}
        <div className="mt-20 border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center text-[11px] font-bold text-gray-600 uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} BAYIT ACADEMY. Todos los derechos reservados.</p>
          <p className="mt-4 md:mt-0 flex items-center">
            Diseñado con 
            <span className="mx-2" style={{ color: PRIMARY_COLOR }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
            </span> 
            para el Reino
          </p>
        </div>
      </div>
    </footer>
  );
};