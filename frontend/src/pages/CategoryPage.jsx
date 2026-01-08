import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { 
    StarIcon, 
    UsersIcon, 
    PlusIcon, 
    ShoppingCartIcon, 
    FireIcon, 
    SparklesIcon, 
    AdjustmentsHorizontalIcon, 
    XMarkIcon,
    ClockIcon,
    AcademicCapIcon
} from '@heroicons/react/24/solid';

import { AuthContext } from '../context/AuthContext';

export const CategoryPage = ({ PRIMARY_COLOR = "#2563eb" }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { categorySlug } = useParams();
    const { user } = useContext(AuthContext);

    // --- ESTADOS ---
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('populares');
    const [showFilters, setShowFilters] = useState(true);
    const [filters, setFilters] = useState({ sort: '', rating: 0, level: '', price: '' });
    
    const handleCourseClick = (id) => navigate(`/curso/${id}`);

    // 1. Carga de datos
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/api/courses`);
                setCourses(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error:", error);
                setLoading(false);
            }
        };
        fetchCourses();
    }, [categorySlug]);

    // 2. Lógica de filtrado
    useEffect(() => {
        let result = [...courses];

        if (user?.purchasedCourses) {
            result = result.filter(course => 
                !user.purchasedCourses.some(pc => (pc.courseId?._id || pc.courseId) === course._id)
            );
        }

        if (filters.rating) {
            result = result.filter(c => (c.rating || 4.0) >= filters.rating);
        }

        if (filters.level) {
            result = result.filter(c => c.level === filters.level);
        }

        if (filters.sort === 'popular') {
            result.sort((a, b) => (b.studentsCount || 0) - (a.studentsCount || 0));
        } else if (filters.sort === 'rating') {
            result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }

        setFilteredCourses(result);
    }, [filters, courses, user]);

    const handleClearFilters = () => setFilters({ sort: '', rating: 0, level: '', price: '' });
    
    const onAddToCart = (e, course) => {
        e.stopPropagation();
        addToCart(course);
        toast.success(`${course.title} agregado`);
    };

    const categoryName = categorySlug ? categorySlug.replace(/-/g, ' ') : "Cursos";

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center italic text-gray-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                Cargando tu catálogo...
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            
            {/* SECCIÓN 1: HERO */}
            <section className="bg-gray-100 py-16 px-4 md:px-12 border-b">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-5xl font-black capitalize mb-4 tracking-tight">{categoryName}</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mb-8 leading-relaxed">
                        Domina {categoryName} con expertos del mundo real y avanza en tu carrera profesional.
                    </p>
                    <div className="flex flex-wrap items-center gap-8 mb-10">
                        <div className="flex items-center text-gray-800 font-bold">
                            <UsersIcon className="h-6 w-6 mr-2 text-gray-500" />
                            <span>{courses.reduce((acc, c) => acc + (c.studentsCount || 0), 0).toLocaleString()} alumnos aprendiendo</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN 2: PAQUETE ESPECIAL */}
            <section className="max-w-7xl mx-auto px-4 md:px-12 py-16">
                <div className="bg-blue-50/40 border-2 border-dashed border-blue-200 rounded-3xl p-10 flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1 text-center lg:text-left">
                        <span className="bg-blue-600 text-white px-4 py-1 rounded-lg text-xs font-black uppercase tracking-widest">¡Oferta Estrella!</span>
                        <h2 className="text-4xl font-black mt-6 mb-4 leading-tight">Paquete Maestro en {categoryName}</h2>
                        <div className="flex items-center justify-center lg:justify-start gap-6 mb-8">
                            <div className="flex flex-col">
                                <span className="text-4xl font-black text-gray-900">$299.00</span>
                                <span className="text-lg text-gray-400 line-through">$540.00</span>
                            </div>
                            <div className="bg-green-100 text-green-700 font-black px-4 py-2 rounded-xl text-sm">AHORRA 45%</div>
                        </div>
                        <button className="w-full md:w-auto bg-gray-900 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl">
                            <ShoppingCartIcon className="h-6 w-6" /> Comprar Paquete
                        </button>
                    </div>
                    <div className="flex items-center gap-4 md:gap-8">
                        {courses.slice(0, 2).map((c, i) => (
                            <React.Fragment key={c._id}>
                                <div className="w-40 md:w-56 bg-white p-3 rounded-2xl shadow-xl border border-gray-100">
                                    <img src={`http://localhost:5000${c.thumbnail}`} className="rounded-xl h-24 md:h-32 w-full object-cover mb-3" alt="" />
                                    <p className="text-xs font-black line-clamp-1">{c.title}</p>
                                </div>
                                {i === 0 && <PlusIcon className="h-10 w-10 text-blue-400 stroke-2" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECCIÓN 3: PESTAÑAS POPULARES */}
            <section className="max-w-7xl mx-auto px-4 md:px-12 py-16">
                <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
                    <button 
                        onClick={() => setActiveTab('populares')}
                        className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black whitespace-nowrap transition-all ${activeTab === 'populares' ? 'bg-gray-900 text-white shadow-xl' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        <FireIcon className="h-5 w-5" /> Más populares
                    </button>
                    <button 
                        onClick={() => setActiveTab('favoritos')}
                        className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black whitespace-nowrap transition-all ${activeTab === 'favoritos' ? 'bg-gray-900 text-white shadow-xl' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        <SparklesIcon className="h-5 w-5" /> Recomendados
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {(activeTab === 'populares' ? courses.slice(0,4) : courses.slice().reverse().slice(0,4)).map(course => (
                        <div key={course._id} onClick={() => handleCourseClick(course._id)} className="group cursor-pointer">
                            <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 shadow-sm border">
                                <img src={`http://localhost:5000${course.thumbnail}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                            </div>
                            <h4 className="font-bold text-gray-900 line-clamp-2 group-hover:underline">{course.title}</h4>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs font-black text-orange-600">{course.rating || '4.8'}</span>
                                <StarIcon className="h-3 w-3 text-orange-400" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECCIÓN 4: EXPLORACIÓN COMPLETA Y FILTROS */}
            <main className="max-w-7xl mx-auto px-4 md:px-12 py-20 border-t">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-3 px-8 py-4 border-2 border-gray-900 font-black rounded-xl hover:bg-gray-50 transition-all active:scale-95"
                        >
                            <AdjustmentsHorizontalIcon className="h-6 w-6" /> {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                        </button>
                        <select 
                            value={filters.sort}
                            onChange={(e) => setFilters({...filters, sort: e.target.value})}
                            className="bg-white border-2 border-gray-900 px-8 py-4 font-black rounded-xl focus:outline-none cursor-pointer"
                        >
                            <option value="">Ordenar por</option>
                            <option value="popular">Más populares</option>
                            <option value="rating">Mejor valorados</option>
                        </select>
                    </div>
                    {Object.values(filters).some(v => v !== '' && v !== 0) && (
                        <button onClick={handleClearFilters} className="text-red-600 font-black flex items-center gap-2 hover:underline">
                            <XMarkIcon className="h-5 w-5" /> Borrar filtros
                        </button>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* ASIDE DE FILTROS */}
                    {showFilters && (
                        <aside className="w-full lg:w-72 space-y-10">
                            <div>
                                <h4 className="font-black text-xl mb-6">Valoración</h4>
                                {[4.5, 4, 3].map(stars => (
                                    <label key={stars} className="flex items-center gap-3 mb-4 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="rating" 
                                            checked={filters.rating === stars}
                                            onChange={() => setFilters({...filters, rating: stars})} 
                                            className="w-5 h-5 accent-gray-900" 
                                        />
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon key={i} className={`h-4 w-4 ${i < Math.floor(stars) ? 'text-yellow-400' : 'text-gray-200'}`} />
                                            ))}
                                        </div>
                                        <span className="text-sm font-bold text-gray-600">{stars} o más</span>
                                    </label>
                                ))}
                            </div>
                            <div>
                                <h4 className="font-black text-xl mb-6 border-t pt-6">Nivel</h4>
                                {['Básico', 'Intermedio', 'Avanzado'].map(lvl => (
                                    <label key={lvl} className="flex items-center gap-3 mb-4 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={filters.level === lvl} 
                                            onChange={() => setFilters({...filters, level: filters.level === lvl ? '' : lvl})} 
                                            className="w-5 h-5 accent-gray-900 rounded" 
                                        />
                                        <span className="font-bold text-gray-700">{lvl}</span>
                                    </label>
                                ))}
                            </div>
                        </aside>
                    )}

                    {/* GRILLA PRINCIPAL */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                            {filteredCourses.length > 0 ? filteredCourses.map(course => (
                                <div 
                                    key={course._id} 
                                    onClick={() => handleCourseClick(course._id)}
                                    className="group flex flex-col h-full bg-white border border-transparent hover:border-gray-200 hover:shadow-2xl p-4 rounded-[2rem] transition-all duration-500 cursor-pointer"
                                >
                                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-5">
                                        <img src={`http://localhost:5000${course.thumbnail}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                            {course.level || 'Todos los niveles'}
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-black text-gray-900 mb-2 leading-tight flex-1 group-hover:text-blue-600 transition-colors">
                                        {course.title}
                                    </h3>

                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-sm font-black text-orange-700">{course.rating || '4.5'}</span>
                                        <div className="flex text-orange-400">
                                            {[...Array(5)].map((_, i) => <StarIcon key={i} className="h-3 w-3" />)}
                                        </div>
                                        <span className="text-xs text-gray-400">({(course.studentsCount || 0).toLocaleString()})</span>
                                    </div>

                                    <div className="flex items-center gap-4 text-gray-500 text-xs font-bold mb-6">
                                        <span className="flex items-center gap-1"><ClockIcon className="h-4 w-4" /> 15h 30m</span>
                                        <span className="flex items-center gap-1"><AcademicCapIcon className="h-4 w-4" /> {course.lessons?.length || 10} lecciones</span>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <span className="text-2xl font-black text-gray-900">${course.price}</span>
                                        <button 
                                            onClick={(e) => onAddToCart(e, course)}
                                            className="p-3 bg-gray-100 rounded-xl hover:bg-gray-900 hover:text-white transition-all active:scale-90"
                                        >
                                            <PlusIcon className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full py-32 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                    <p className="text-2xl font-bold text-gray-400">No hay cursos con estos filtros.</p>
                                    <button onClick={handleClearFilters} className="mt-4 text-blue-600 font-black hover:underline">Ver todos los cursos</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};