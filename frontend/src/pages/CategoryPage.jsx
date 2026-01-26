import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
    AdjustmentsHorizontalIcon, 
    SparklesIcon, 
    FireIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    PlusIcon,
    XMarkIcon // Agregado para cerrar filtros en móvil
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

import { useCart } from '../context/CartContext'; 
import { useAuth } from '../context/AuthContext'; 

const BUNDLE_IDS = [
    "697392487c04316a5421c940", 
    "6973d02e32c43f5217799a30", 
    "6973d04932c43f5217799a41"
];
const BUNDLE_PRICE = 10.00;

export const CategoryPage = ({ PRIMARY_COLOR = "#F7A823" }) => {
    const { categorySlug } = useParams();
    const { addToCart } = useCart();
    const { user } = useAuth();
    
    // --- ESTADOS ---
    const [courses, setCourses] = useState([]); 
    const [featuredCourses, setFeaturedCourses] = useState([]); 
    const [bundleItems, setBundleItems] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [loadingFeatured, setLoadingFeatured] = useState(true);
    
    // Estado para controlar la visibilidad de filtros en Móvil
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const [filters, setFilters] = useState({
        rating: '',
        duration: '',
        topic: '',
        subcategory: '',
        level: '',
        language: '',
        priceRange: ''
    });

    const [openTabs, setOpenTabs] = useState({
        rating: true, duration: true, topic: false, 
        subcategory: false, level: false, language: false, price: false
    });

    const toggleTab = (tab) => setOpenTabs(prev => ({ ...prev, [tab]: !prev[tab] }));

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: prev[key] === value ? '' : value }));
    };

    // --- LOGICA DE CARGA (Restaurada) ---
    const fetchFilteredCourses = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (categorySlug) params.append('category', categorySlug);
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            const response = await axios.get(`/api/courses?${params.toString()}`);
            setCourses(response.data);
        } catch (error) {
            console.error("Error cargando cursos filtrados:", error);
        } finally {
            setLoading(false);
        }
    }, [filters, categorySlug]);

    const fetchFeatured = async () => {
        setLoadingFeatured(true);
        try {
            const response = await axios.get('/api/courses?section=featured');
            setFeaturedCourses(response.data);
            const bundleData = response.data.filter(c => BUNDLE_IDS.includes(c._id));
            if(bundleData.length > 0) setBundleItems(bundleData);
        } catch (error) {
            console.error("Error cargando destacados:", error);
        } finally {
            setLoadingFeatured(false);
        }
    };

    useEffect(() => { fetchFeatured(); }, [user]);
    useEffect(() => { fetchFilteredCourses(); }, [fetchFilteredCourses]);

    const handleAddBundle = () => {
        if (bundleItems.length === 0) return;
        const bundleObj = {
            _id: 'bundle-maestro-unique',
            title: 'Pack Maestro: Sabiduría Integral',
            price: BUNDLE_PRICE,
            isBundle: true,
            coursesContained: BUNDLE_IDS,
            thumbnail: bundleItems[0]?.thumbnail || '',
            quantity: 1
        };
        addToCart(bundleObj);
    };

    // --- COMPONENTES AUXILIARES (Renderizado) ---
    const CourseCard = ({ course }) => (
        <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col h-full">
            <div className="aspect-video rounded-2xl overflow-hidden mb-4 relative bg-gray-50">
                <img 
                    src={course.thumbnail} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={course.title} 
                />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <StarSolid className="h-3 w-3 text-orange-500" />
                    <span className="text-[10px] font-black">{course.rating || '5.0'}</span>
                </div>
            </div>
            
            <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-2 flex-grow">
                {course.title}
            </h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">
                {course.level}
            </p>

            <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-auto">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Precio</span>
                    <span className="font-black text-gray-900 text-lg">${course.price}</span>
                </div>
                <button 
                    onClick={() => addToCart({...course, quantity: 1})}
                    className="bg-gray-900 text-white p-2.5 rounded-2xl hover:bg-orange-500 transition-all active:scale-90 shadow-lg"
                >
                    <PlusIcon className="h-5 w-5 stroke-[3px]" />
                </button>
            </div>
        </div>
    );

    const FilterSection = ({ id, title, options, filterKey }) => (
        <div className="border-b border-gray-100 py-4">
            <button onClick={() => toggleTab(id)} className="flex items-center justify-between w-full text-left group">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 group-hover:text-orange-500 transition-colors">{title}</span>
                {openTabs[id] ? <ChevronUpIcon className="h-3 w-3" /> : <ChevronDownIcon className="h-3 w-3" />}
            </button>
            {openTabs[id] && (
                <div className="space-y-2 mt-4 animate-fadeIn">
                    {options.map(opt => (
                        <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                checked={filters[filterKey] === opt.value}
                                onChange={() => handleFilterChange(filterKey, opt.value)}
                                className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                            />
                            <span className={`text-sm transition-colors ${filters[filterKey] === opt.value ? 'text-orange-500 font-bold' : 'text-gray-500 group-hover:text-gray-900'}`}>
                                {opt.label}
                            </span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-white pb-24">
            
            {/* 1. SECCIÓN BUNDLE (RESPONSIVE) */}
            <div className="pt-20 lg:pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative bg-gray-900 rounded-[2rem] sm:rounded-[3.5rem] overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="relative z-10 flex flex-col lg:flex-row items-center p-8 sm:p-16 lg:p-20 gap-10 lg:gap-16">
                        {/* Texto */}
                        <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-widest mb-6 border border-orange-500/20">
                                <SparklesIcon className="h-4 w-4" /> Recomendación del mes
                            </span>
                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                                Pack Maestro: <br/><span style={{ color: PRIMARY_COLOR }}>Sabiduría Integral</span>
                            </h1>
                            <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                Adquiere los pilares fundamentales con un precio especial de lanzamiento.
                            </p>
                            <button onClick={handleAddBundle} className="w-full sm:w-auto px-8 py-4 sm:px-10 sm:py-5 bg-white text-gray-900 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 mx-auto lg:mx-0">
                                Adquirir Pack <FireIcon className="h-5 w-5 text-orange-500" />
                            </button>
                        </div>

                        {/* Imágenes (Responsive Stack) */}
                        <div className="flex-1 w-full relative h-[280px] sm:h-[350px] flex items-center justify-center order-1 lg:order-2">
                            {bundleItems.length > 0 ? (
                                bundleItems.map((c, i) => (
                                    <div key={c._id} className="absolute w-40 h-56 sm:w-60 sm:h-80 transition-all duration-500"
                                         style={{ transform: `rotate(${i * 8 - 8}deg) translateX(${i * 20}px)`, zIndex: 10 - i }}>
                                        <img src={c.thumbnail} className="w-full h-full object-cover rounded-2xl shadow-2xl border-2 border-white/10" alt="bundle-course" />
                                    </div>
                                ))
                            ) : (
                                <div className="w-full h-64 bg-gray-800 rounded-3xl border border-dashed border-gray-700 flex items-center justify-center text-gray-500 italic text-sm">Cargando Pack...</div>
                            )}
                            <div className="absolute -bottom-2 -right-2 sm:-bottom-6 sm:-left-6 bg-white p-4 sm:p-6 rounded-2xl shadow-2xl z-30 -rotate-3 sm:-rotate-6">
                                <p className="text-gray-900 font-black text-xl sm:text-2xl">${BUNDLE_PRICE}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. SECCIÓN DESTACADOS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <div className="flex items-center gap-4 mb-10">
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Cursos Destacados</h2>
                    <div className="h-px flex-1 bg-gray-100"></div>
                </div>
                {/* Ajuste de Grid: 1 col móvil, 2 tablet, 4 desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {loadingFeatured ? (
                        [1,2,3,4].map(i => <div key={i} className="h-64 bg-gray-50 animate-pulse rounded-3xl"></div>)
                    ) : (
                        featuredCourses.map(course => <CourseCard key={course._id} course={course} />)
                    )}
                </div>
            </section>

            {/* 3. EXPLORACIÓN Y FILTROS */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-100 pt-12 sm:pt-20">
                
                {/* Header Exploración + Botón Filtros Móvil */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900">Explorar Catálogo</h2>
                        <p className="text-gray-500 text-sm mt-1">Encuentra tu próximo estudio.</p>
                    </div>
                    <button 
                        onClick={() => setMobileFiltersOpen(true)}
                        className="lg:hidden w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-900 transition-colors"
                    >
                        <AdjustmentsHorizontalIcon className="h-5 w-5" /> Filtrar Cursos
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 relative">
                    
                    {/* ASIDE (Filtros) - Ahora con modo Drawer para Móvil */}
                    <aside className={`
                        fixed inset-0 z-50 bg-white transform transition-transform duration-300 ease-in-out lg:static lg:transform-none lg:w-64 lg:block lg:z-0
                        ${mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}>
                        {/* Contenedor con scroll interno para móvil */}
                        <div className="h-full overflow-y-auto p-6 lg:p-0">
                            <div className="flex items-center justify-between mb-8 lg:hidden">
                                <div className="flex items-center gap-2">
                                    <AdjustmentsHorizontalIcon className="h-6 w-6 text-gray-900" />
                                    <h2 className="font-black text-xl text-gray-900">Filtros</h2>
                                </div>
                                <button onClick={() => setMobileFiltersOpen(false)} className="p-2 bg-gray-100 rounded-full">
                                    <XMarkIcon className="h-6 w-6 text-gray-600" />
                                </button>
                            </div>

                            {/* Header Desktop */}
                            <div className="hidden lg:flex items-center gap-2 mb-8 sticky top-28">
                                <AdjustmentsHorizontalIcon className="h-6 w-6 text-gray-900" />
                                <h2 className="font-black text-xl text-gray-900">Filtros</h2>
                            </div>

                            <div className="space-y-1 lg:sticky lg:top-40 pb-20 lg:pb-0">
                                {/* TODAS LAS OPCIONES ORIGINALES */}
                                <FilterSection id="rating" title="Valoraciones" filterKey="rating" options={[
                                    { label: '4.5 o más', value: '4.5' },
                                    { label: '4.0 o más', value: '4.0' },
                                    { label: '3.5 o más', value: '3.5' }
                                ]} />

                                <FilterSection id="duration" title="Duración" filterKey="duration" options={[
                                    { label: '0-2 Horas', value: 'short' },
                                    { label: '3-6 Horas', value: 'medium' },
                                    { label: '7-16 Horas', value: 'long' }
                                ]} />

                                <FilterSection id="topic" title="Tema" filterKey="topic" options={[
                                    { label: 'Espiritualidad', value: 'Espiritualidad' }, 
                                    { label: 'Teología', value: 'Teología' }
                                ]} />

                                <FilterSection id="subcategory" title="Subcategoría" filterKey="subcategory" options={[
                                    { label: 'Antiguo Testamento', value: 'Antiguo Testamento' }, 
                                    { label: 'Liderazgo', value: 'Liderazgo' }
                                ]} />

                                <FilterSection id="level" title="Nivel" filterKey="level" options={[
                                    { label: 'Iniciación', value: 'Iniciación' }, 
                                    { label: 'Intermedio', value: 'Intermedio' },
                                    { label: 'Avanzado', value: 'Avanzado' }
                                ]} />

                                <FilterSection id="language" title="Idioma" filterKey="language" options={[
                                    { label: 'Español', value: 'es' }, 
                                    { label: 'Inglés', value: 'en' }
                                ]} />

                                <FilterSection id="price" title="Precio" filterKey="priceRange" options={[
                                    { label: 'Gratis', value: 'free' }, 
                                    { label: 'Premium', value: 'premium' }
                                ]} />

                                {/* Botón ver resultados en móvil */}
                                <div className="lg:hidden pt-8">
                                    <button 
                                        onClick={() => setMobileFiltersOpen(false)}
                                        className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg"
                                        style={{ backgroundColor: PRIMARY_COLOR }}
                                    >
                                        Ver Resultados
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>
                    
                    {/* Overlay oscuro para fondo cuando el menú móvil está abierto */}
                    {mobileFiltersOpen && (
                        <div 
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                            onClick={() => setMobileFiltersOpen(false)}
                        ></div>
                    )}

                    {/* MAIN CONTENT */}
                    <main className="flex-1 w-full">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 animate-pulse">
                                {[1,2,3,4,5,6].map(i => <div key={i} className="h-72 bg-gray-50 rounded-3xl"></div>)}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                                {courses.length > 0 ? courses.map(course => (
                                    <CourseCard key={course._id} course={course} />
                                )) : (
                                    <div className="col-span-full py-20 text-center flex flex-col items-center justify-center p-8 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                            <AdjustmentsHorizontalIcon className="h-8 w-8" />
                                        </div>
                                        <p className="text-gray-500 font-medium text-lg">No encontramos cursos con estos filtros.</p>
                                        <button onClick={() => setFilters({ rating: '', duration: '', topic: '', subcategory: '', level: '', language: '', priceRange: '' })} className="mt-4 text-orange-500 font-bold hover:underline">
                                            Limpiar filtros
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;