import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getCategories } from '../services/categoryService';
import { 
  ShoppingBagIcon, 
  AcademicCapIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  ListBulletIcon,
  PlusCircleIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const Navbar = ({ PRIMARY_COLOR }) => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error al cargar categorías");
            }
        };
        fetchCategories();
    }, []);

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
                
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-xl md:text-2xl font-bold tracking-tighter shrink-0" style={{ color: PRIMARY_COLOR }}>
                        BAYIT<span className="text-gray-900 hidden xs:inline"> DIGITAL</span>
                    </Link>

                    {/* MENÚ DE CATEGORÍAS DINÁMICO */}
                    <div className="hidden lg:block relative group py-4">
                        <button className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 transition gap-1 outline-none">
                            <ListBulletIcon className="h-5 w-5" />
                            Categorías
                        </button>
                        
                        <div className="absolute top-full left-0 w-64 bg-white shadow-2xl rounded-xl border border-gray-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[101]">
                            <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Explorar temas</span>
                            </div>
                            {categories.map((cat) => (
                                <Link 
                                    key={cat._id} 
                                        // Usamos backticks `` para insertar el slug dinámicamente
                                    to={`/cursos/${cat.slug || cat.name.toLowerCase().replace(/ /g, '-')}`}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition font-medium"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 max-w-2xl relative group">
                    <input 
                        type="text" 
                        placeholder="Buscar cursos, maestros..."
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
                                        <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-[100]">
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
                                                {(user.role === 'admin' || user.role === 'teacher') && (
                                                    <>
                                                        <Link 
                                                            to="/admin/subir-curso" 
                                                            className="flex items-center px-4 py-2 hover:bg-blue-50 text-sm font-bold transition-colors"
                                                            style={{ color: PRIMARY_COLOR }}
                                                            onClick={() => setIsMenuOpen(false)}
                                                        >
                                                            <PlusCircleIcon className="h-5 w-5 mr-2" />
                                                            Subir Cursos
                                                        </Link>
                                                        <hr className="my-2 border-gray-100" />
                                                    </>
                                                )}

                                                <Link to="/mi-aprendizaje" className="block px-4 py-2 hover:bg-gray-50 text-sm text-gray-700" onClick={() => setIsMenuOpen(false)}>Mi aprendizaje</Link>
                                                <Link to="/editar-perfil" className="block px-4 py-2 hover:bg-gray-50 text-sm text-gray-700" onClick={() => setIsMenuOpen(false)}>Configuración de perfil</Link>
                                                <hr className="my-2 border-gray-100" />
                                                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold transition-colors">Cerrar sesión</button>
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