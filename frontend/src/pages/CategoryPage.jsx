import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
    StarIcon, 
    UsersIcon, 
    PlusIcon, 
    ShoppingCartIcon, 
    FireIcon, 
    SparklesIcon, 
    AdjustmentsHorizontalIcon, 
    XMarkIcon, 
    ChevronDownIcon,
    CheckBadgeIcon
} from '@heroicons/react/24/solid';

export const CategoryPage = ({ PRIMARY_COLOR }) => {
    const { categorySlug } = useParams();
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // ESTADOS DE UI
    const [activeTab, setActiveTab] = useState('populares');
    const [showFilters, setShowFilters] = useState(false);
    
    // ESTADOS DE FILTROS
    const [filters, setFilters] = useState({
        sort: '',
        rating: 0,
        level: '',
        price: '',
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                // Llamada al backend filtrando por el slug de la categoría
                const res = await axios.get(`http://localhost:5000/api/courses?category=${categorySlug}`);
                setCourses(res.data);
                setFilteredCourses(res.data);
            } catch (error) {
                console.error("Error al obtener cursos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [categorySlug]);

    // LÓGICA DE FILTRADO DINÁMICO
    useEffect(() => {
        let result = [...courses];

        if (filters.rating) result = result.filter(c => (c.rating || 4.5) >= filters.rating);
        if (filters.level) result = result.filter(c => c.level === filters.level);
        if (filters.price === 'gratis') result = result.filter(c => c.price === 0);
        if (filters.price === 'pago') result = result.filter(c => c.price > 0);

        if (filters.sort === 'recent') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (filters.sort === 'popular') result.sort((a, b) => (b.students || 0) - (a.students || 0));
        if (filters.sort === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));

        setFilteredCourses(result);
    }, [filters, courses]);

    const handleClearFilters = () => {
        setFilters({ sort: '', rating: 0, level: '', price: '' });
    };

    const isFiltering = Object.values(filters).some(v => v !== '' && v !== 0);
    const categoryName = categorySlug.replace(/-/g, ' ');

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Cargando experiencia de aprendizaje...</div>;

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            
            {/* SECCIÓN 1: HEADER / HERO */}
            <section className="bg-gray-100 py-16 px-4 md:px-12 border-b border-gray-200">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-5xl font-black capitalize mb-4 tracking-tight">{categoryName}</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mb-8 leading-relaxed">
                        Domina {categoryName} con cursos de expertos experimentados del mundo real. 
                        Aprende habilidades prácticas y avanza en tu carrera profesional.
                    </p>
                    <div className="flex flex-wrap items-center gap-8 mb-10">
                        <div className="flex items-center text-gray-800 font-bold">
                            <UsersIcon className="h-6 w-6 mr-2 text-gray-500" />
                            <span>24,890 alumnos aprendiendo</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-black text-yellow-600 text-lg">4.9</span>
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => <StarIcon key={i} className="h-5 w-5" />)}
                            </div>
                            <span className="text-gray-500 font-medium">(4,120 reseñas)</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="font-black text-xs uppercase text-gray-400 tracking-widest">Temas relacionados:</span>
                        <div className="flex flex-wrap gap-2">
                            {['Avanzado', 'Certificaciones', 'Nuevos', 'Populares'].map(btn => (
                                <button key={btn} className="px-5 py-2 bg-white border border-gray-300 rounded-full text-sm font-bold hover:shadow-md transition-all">{btn}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN 2: PAQUETE (BUNDLE) ESPECIAL */}
            <section className="max-w-7xl mx-auto px-4 md:px-12 py-16">
                <div className="bg-blue-50/40 border-2 border-dashed border-blue-200 rounded-3xl p-10 flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1 text-center lg:text-left">
                        <span className="bg-blue-600 text-white px-4 py-1 rounded-lg text-xs font-black uppercase tracking-widest">¡Tu mejor opción!</span>
                        <h2 className="text-4xl font-black mt-6 mb-4 leading-tight">Paquete Maestro en {categoryName}</h2>
                        <p className="text-gray-600 text-lg mb-8 italic">"Esta es la ruta más rápida y económica para convertirte en experto. Incluye fundamentos y técnicas avanzadas."</p>
                        <div className="flex items-center justify-center lg:justify-start gap-6 mb-8">
                            <div className="flex flex-col">
                                <span className="text-4xl font-black text-gray-900">$299.00</span>
                                <span className="text-lg text-gray-400 line-through">$540.00</span>
                            </div>
                            <div className="bg-green-100 text-green-700 font-black px-4 py-2 rounded-xl text-sm">AHORRA 45%</div>
                        </div>
                        <button className="w-full md:w-auto bg-gray-900 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-black shadow-2xl transition-all flex items-center justify-center gap-3">
                            <ShoppingCartIcon className="h-6 w-6" /> Comprar Paquete
                        </button>
                    </div>
                    <div className="flex items-center gap-4 md:gap-8">
                        {courses.slice(0, 2).map((c, i) => (
                            <React.Fragment key={c._id}>
                                <div className="w-40 md:w-56 bg-white p-3 rounded-2xl shadow-xl border border-gray-100">
                                    <img src={`http://localhost:5000${c.thumbnail}`} className="rounded-xl h-24 md:h-32 w-full object-cover mb-3" alt="" />
                                    <p className="text-xs font-black line-clamp-2">{c.title}</p>
                                </div>
                                {i === 0 && <PlusIcon className="h-10 w-10 text-blue-400 stroke-2" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECCIÓN 3: PRIMEROS PASOS (CARROUSEL DINÁMICO) */}
            <section className="max-w-7xl mx-auto px-4 md:px-12 py-16">
                <div className="mb-12">
                    <h2 className="text-3xl font-black mb-2">Cursos para dar tus primeros pasos</h2>
                    <p className="text-gray-500 text-lg font-medium">Descubre cursos de expertos experimentados del mundo real.</p>
                </div>
                <div className="flex gap-4 mb-10">
                    <button 
                        onClick={() => setActiveTab('populares')}
                        className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black transition-all ${activeTab === 'populares' ? 'bg-gray-900 text-white shadow-xl' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        <FireIcon className="h-5 w-5" /> Más populares
                    </button>
                    <button 
                        onClick={() => setActiveTab('favoritos')}
                        className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black transition-all ${activeTab === 'favoritos' ? 'bg-gray-900 text-white shadow-xl' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        <SparklesIcon className="h-5 w-5" /> Favorito para principiantes
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {(activeTab === 'populares' ? courses.slice(0,4) : courses.slice().reverse().slice(0,4)).map(course => (
                        <div key={course._id} className="group cursor-pointer">
                            <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 shadow-sm">
                                <img src={`http://localhost:5000${course.thumbnail}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                            </div>
                            <h4 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:underline">{course.title}</h4>
                            <div className="flex items-center gap-2">
                                <StarIcon className="h-4 w-4 text-yellow-500" />
                                <span className="font-black text-sm text-yellow-800">4.9</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECCIÓN 4: EXPLORACIÓN COMPLETA CON SISTEMA DE FILTROS */}
            <main className="max-w-7xl mx-auto px-4 md:px-12 py-20 border-t border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-3 px-8 py-4 border-2 border-gray-900 font-black rounded-xl hover:bg-gray-50 transition-all active:scale-95"
                        >
                            <AdjustmentsHorizontalIcon className="h-6 w-6" /> Filtrar
                        </button>
                        <div className="relative">
                            <select 
                                value={filters.sort}
                                onChange={(e) => setFilters({...filters, sort: e.target.value})}
                                className="appearance-none bg-white border-2 border-gray-900 px-8 py-4 pr-12 font-black rounded-xl focus:outline-none cursor-pointer"
                            >
                                <option value="">Ordenar por</option>
                                <option value="popular">Mas populares</option>
                                <option value="rating">Mejores valorados</option>
                                <option value="recent">Mas recientes</option>
                            </select>
                            <ChevronDownIcon className="h-5 w-5 absolute right-4 top-5 pointer-events-none" />
                        </div>
                    </div>
                    {isFiltering && (
                        <button onClick={handleClearFilters} className="text-red-600 font-black flex items-center gap-2 hover:underline">
                            <XMarkIcon className="h-5 w-5" /> Borrar filtros
                        </button>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Panel de Filtros Lateral */}
                    {showFilters && (
                        <aside className="w-full lg:w-72 space-y-10 animate-in fade-in slide-in-from-left duration-500">
                            {/* Filtro Valoraciones */}
                            <div>
                                <h4 className="font-black text-xl mb-6 flex items-center justify-between">Valoraciones <ChevronDownIcon className="h-4 w-4 opacity-30" /></h4>
                                {[4.5, 4, 3].map(stars => (
                                    <label key={stars} className="flex items-center gap-3 mb-4 cursor-pointer group">
                                        <input type="radio" name="rating" onChange={() => setFilters({...filters, rating: stars})} className="w-5 h-5 accent-gray-900" />
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => <StarIcon key={i} className={`h-4 w-4 ${i < Math.floor(stars) ? 'text-yellow-400' : 'text-gray-200'}`} />)}
                                            <span className="ml-2 text-sm font-bold text-gray-700">{stars} o más (24)</span>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            {/* Filtro Nivel */}
                            <div>
                                <h4 className="font-black text-xl mb-6 border-t pt-6">Nivel</h4>
                                {['Básico', 'Intermedio', 'Avanzado'].map(lvl => (
                                    <label key={lvl} className="flex items-center gap-3 mb-4 cursor-pointer">
                                        <input type="checkbox" checked={filters.level === lvl} onChange={() => setFilters({...filters, level: filters.level === lvl ? '' : lvl})} className="w-5 h-5 accent-gray-900 rounded" />
                                        <span className="font-bold text-gray-700">{lvl} <span className="text-gray-300 font-medium ml-1">(12)</span></span>
                                    </label>
                                ))}
                            </div>

                            {/* Placeholders para filtros adicionales */}
                            {['Duración', 'Tema', 'Precio', 'Idioma'].map(f => (
                                <div key={f} className="border-t pt-6 opacity-40">
                                    <h4 className="font-black text-xl mb-2">{f}</h4>
                                    <p className="text-xs font-bold uppercase tracking-widest">Próximamente</p>
                                </div>
                            ))}
                        </aside>
                    )}

                    {/* Grid de Resultados Final */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                            {filteredCourses.length > 0 ? filteredCourses.map(course => (
                                <div key={course._id} className="group flex flex-col h-full border-b border-gray-100 pb-8 hover:bg-gray-50/50 p-4 rounded-3xl transition-all">
                                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-5 shadow-lg">
                                        <img src={`http://localhost:5000${course.thumbnail}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black uppercase shadow-sm">Destacado</div>
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 mb-2 leading-tight flex-1">{course.title}</h3>
                                    <p className="text-xs font-bold text-gray-400 mb-4 tracking-wide uppercase">Instructor: {course.teacher?.name || 'Experto'}</p>
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="flex text-yellow-400">
                                            <StarIcon className="h-4 w-4" />
                                        </div>
                                        <span className="font-black text-sm">4.8</span>
                                        <span className="text-xs text-gray-300 font-medium">(1,405)</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-2xl font-black text-gray-900">${course.price}</span>
                                        <button className="p-3 bg-gray-100 rounded-xl group-hover:bg-gray-900 group-hover:text-white transition-all">
                                            <PlusIcon className="h-5 w-5" />
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