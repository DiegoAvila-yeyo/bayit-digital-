import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios'; 
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
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const Navbar = ({ PRIMARY_COLOR = "#F7A823" }) => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    const searchRef = useRef(null);

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

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.trim().length > 1) {
                try {
                    const res = await api.get(`/courses?search=${searchTerm}`);
                    setSuggestions(res.data.slice(0, 6));
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Error buscando sugerencias", error);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' && searchTerm.trim() !== '') {
            navigate(`/buscar?q=${encodeURIComponent(searchTerm.trim())}`);
            setShowSuggestions(false);
            setIsMobileMenuOpen(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'BD';
        const parts = name.trim().split(' ');
        return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].substring(0, 2).toUpperCase();
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-[100] w-full border-b border-gray-100">
            <div className="max-w-[1920px] mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-2 md:gap-8">
                
                {/* IZQUIERDA: MOBILE MENU + LOGO */}
                <div className="flex items-center gap-2 md:gap-4">
                    <button 
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <Bars3Icon className="h-6 w-6 text-gray-700" />
                    </button>

                    <Link to="/" className="text-lg md:text-2xl font-black tracking-tighter shrink-0 flex items-center" style={{ color: PRIMARY_COLOR }}>
                        BAYIT<span className="text-gray-900 ml-1 hidden xs:inline">DIGITAL</span>
                    </Link>

                    {/* Categorías Desktop */}
                    <div className="hidden lg:block relative group ml-4">
                        <button className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 transition gap-1 py-4">
                            Categorías
                        </button>
                        <div className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-xl border border-gray-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            {categories.map((cat) => (
                                <Link key={cat._id} to={`/cursos/${cat.slug || cat.name.toLowerCase()}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium">
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CENTRO: BUSCADOR (Se oculta en móviles muy pequeños para dar espacio) */}
                <div className="flex-1 max-w-2xl relative group hidden sm:block" ref={searchRef}>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Buscar cursos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchSubmit}
                            className="w-full bg-gray-100 border-2 border-transparent focus:bg-white focus:border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm outline-none transition-all"
                        />
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                    {/* Sugerencias (Desktop) */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 w-full bg-white mt-2 shadow-2xl rounded-2xl border border-gray-100 overflow-hidden">
                            {suggestions.map((course) => (
                                <div key={course._id} onClick={() => { navigate(`/curso/${course._id}`); setShowSuggestions(false); }} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0">
                                    <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${course.thumbnail}`} className="w-10 h-7 object-cover rounded bg-gray-200" alt="" />
                                    <span className="text-sm font-bold text-gray-800 truncate">{course.title}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* DERECHA: ICONOS */}
                <div className="flex items-center gap-1 md:gap-4 shrink-0">
                    <Link to="/donate" className="p-2 text-gray-600 hover:text-red-500 transition hidden md:flex items-center gap-1">
                        <HeartIcon className="h-6 w-6 text-red-400" />
                        <span className="text-xs font-bold">Donar</span>
                    </Link>

                    {user ? (
                        <>
                            <Link to="/mi-aprendizaje" className="p-2 text-gray-600 hover:text-gray-900 transition hidden md:block">
                                <AcademicCapIcon className="h-6 w-6" />
                            </Link>

                            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-gray-900">
                                <ShoppingBagIcon className="h-6 w-6" />
                                {cartItems.length > 0 && (
                                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                                        {cartItems.length}
                                    </span>
                                )}
                            </Link>

                            <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-1 p-1 rounded-full border border-transparent hover:border-gray-200">
                                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm" style={{ backgroundColor: PRIMARY_COLOR }}>
                                    {getInitials(user?.name)}
                                </div>
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="text-sm font-bold text-gray-700 px-3 py-2 hidden xs:block">Entrar</Link>
                            <Link to="/register" className="text-white px-4 py-2 rounded-full text-xs md:text-sm font-black transition" style={{ backgroundColor: PRIMARY_COLOR }}>Registro</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MOBILE SIDEBAR OVERLAY --- */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[110] lg:hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="absolute top-0 left-0 w-3/4 max-w-sm h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
                        <div className="p-4 border-b flex justify-between items-center">
                            <span className="font-black text-gray-900">MENÚ</span>
                            <XMarkIcon className="h-6 w-6 text-gray-500" onClick={() => setIsMobileMenuOpen(false)} />
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {/* Buscador móvil */}
                            <div className="relative sm:hidden">
                                <input 
                                    type="text" 
                                    placeholder="Buscar..."
                                    className="w-full bg-gray-100 rounded-lg py-3 pl-10 pr-4 text-sm outline-none"
                                    onKeyDown={handleSearchSubmit}
                                />
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                            </div>
                            
                            <div className="space-y-4">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Navegación</p>
                                <Link to="/mi-aprendizaje" className="flex items-center gap-3 font-bold text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>
                                    <AcademicCapIcon className="h-5 w-5" /> Mi Aprendizaje
                                </Link>
                                <Link to="/donate" className="flex items-center gap-3 font-bold text-red-500" onClick={() => setIsMobileMenuOpen(false)}>
                                    <HeartIcon className="h-5 w-5" /> Donar a la causa
                                </Link>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Categorías</p>
                                {categories.map(cat => (
                                    <Link key={cat._id} to={`/cursos/${cat.slug || cat.name}`} className="block font-medium text-gray-600" onClick={() => setIsMobileMenuOpen(false)}>
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        {user && (
                            <div className="p-4 border-t bg-gray-50">
                                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold">Cerrar Sesión</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;