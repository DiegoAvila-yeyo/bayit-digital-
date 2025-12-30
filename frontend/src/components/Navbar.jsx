import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // NUEVO
import { 
  ShoppingBagIcon, 
  BellIcon, 
  AcademicCapIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  HeartIcon 
} from '@heroicons/react/24/outline';

const Navbar = ({ PRIMARY_COLOR }) => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useCart(); // NUEVO: Obtener items del carrito
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const getInitials = (name) => {
        if (!name) return 'BD';
        const parts = name.trim().split(' ');
        return parts.length > 1 
            ? (parts[0][0] + parts[1][0]).toUpperCase() 
            : parts[0].substring(0, 2).toUpperCase();
    };

    return (
        <nav className="bg-white shadow-sm py-2 px-4 md:px-8 sticky top-0 z-50 w-full border-b border-gray-100">
            <div className="w-full flex items-center justify-between gap-4 md:gap-8">
                
                <Link to="/" className="text-xl md:text-2xl font-bold tracking-tighter shrink-0" style={{ color: PRIMARY_COLOR }}>
                    BAYIT<span className="text-gray-900 hidden xs:inline"> DIGITAL</span>
                </Link>

                <div className="flex-1 max-w-2xl relative group transition-all duration-300">
                    <input 
                        type="text" 
                        placeholder="Buscar cualquier cosa..."
                        className="w-full bg-gray-100 border-none focus:bg-white focus:ring-1 rounded-full py-2.5 pl-10 pr-4 text-sm outline-none transition-all shadow-sm"
                    />
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3.5 top-2.5" />
                </div>

                <div className="flex items-center space-x-4 md:space-x-6 shrink-0">
                    
                    <Link to="/donate" className="flex items-center text-gray-600 hover:text-red-500 transition text-sm font-medium">
                        <HeartIcon className="h-5 w-5 text-red-400 mr-1" />
                        <span className="hidden sm:inline">Donar</span>
                    </Link>

                    {user ? (
                        <>
                            <Link to="/mi-aprendizaje" className="flex items-center text-gray-600 hover:text-gray-900 text-sm font-medium transition">
                                <AcademicCapIcon className="h-6 w-6 mr-1" />
                                <span className="hidden md:inline">Mi aprendizaje</span>
                            </Link>

                            <Link to="/cart" className="relative text-gray-600 hover:text-gray-900 p-1">
                                <ShoppingBagIcon className="h-6 w-6" />
                                {/* CONTADOR ACTUALIZADO */}
                                {cartItems.length > 0 && (
                                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                                      {cartItems.length}
                                  </span>
                                )}
                            </Link>

                            <div className="relative">
                                <button 
                                    onClick={() => setIsMenuOpen(!isMenuOpen)} 
                                    className="flex items-center focus:outline-none hover:opacity-90 transition p-0.5 rounded-full border-2 border-transparent hover:border-gray-200"
                                >
                                    {user.profilePicture ? (
                                        <img src={user.profilePicture} alt="Perfil" className="h-9 w-9 rounded-full object-cover shadow-sm" />
                                    ) : (
                                        <div className="h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md" style={{ backgroundColor: PRIMARY_COLOR }}>
                                            {getInitials(user?.name)}
                                        </div>
                                    )}
                                    <ChevronDownIcon className="h-3 w-3 ml-1 text-gray-400" />
                                </button>

                                {isMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-[-1]" onClick={() => setIsMenuOpen(false)}></div>
                                        <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="px-4 py-3 border-b border-gray-100 flex items-center space-x-3">
                                                <div className="shrink-0">
                                                    <img src={user.profilePicture || "https://via.placeholder.com/150"} className="h-10 w-10 rounded-full object-cover" alt="Avatar" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-bold truncate">{user?.name}</p>
                                                    <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                                                </div>
                                            </div>
                                            <div className="py-2">
                                                <Link to="/mi-aprendizaje" className="block px-4 py-2 hover:bg-gray-50 text-sm text-gray-700" onClick={() => setIsMenuOpen(false)}>Mi aprendizaje</Link>
                                                <Link to="/editar-perfil" className="block px-4 py-2 hover:bg-gray-50 text-sm text-gray-700" onClick={() => setIsMenuOpen(false)}>Configuración de perfil</Link>
                                                <hr className="my-2 border-gray-100" />
                                                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold">Cerrar sesión</button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition">Iniciar sesión</Link>
                            <Link to="/register" className="text-white px-5 py-2 rounded-lg text-sm font-bold hover:shadow-md transition shadow-sm" style={{ backgroundColor: PRIMARY_COLOR }}>Únete gratis</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;