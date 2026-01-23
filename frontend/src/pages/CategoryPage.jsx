import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom'; // Vital para capturar la categoría de la URL
import axios from 'axios';
import { 
    AdjustmentsHorizontalIcon, 
    SparklesIcon, 
    SunIcon,
    FireIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    PlusIcon
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
    const { categorySlug } = useParams(); // <--- Capturamos el parámetro :categorySlug
    const { addToCart } = useCart();
    const { user } = useAuth();
    
    // ESTADOS
    const [courses, setCourses] = useState([]); 
    const [featuredCourses, setFeaturedCourses] = useState([]); 
    const [bundleItems, setBundleItems] = useState([]); 
    
    const [loading, setLoading] = useState(true);
    const [loadingFeatured, setLoadingFeatured] = useState(true);

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

    // --- CARGA DE CURSOS FILTRADOS (SECCIÓN 3) ---
    const fetchFilteredCourses = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            
            // 1. Agregamos la categoría actual a la petición
            if (categorySlug) params.append('category', categorySlug);

            // 2. Agregamos el resto de filtros activos
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
    }, [filters, categorySlug]); // <--- Depende de los filtros y de la categoría en la URL

    // --- CARGA DE CURSOS DESTACADOS (SECCIÓN 2) ---
    const fetchFeatured = async () => {
        setLoadingFeatured(true);
        try {
            // Los destacados suelen ser globales o por categoría, aquí los pedimos globales
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

    // Efecto para destacados al montar
    useEffect(() => {
        fetchFeatured();
    }, [user]);

    // Efecto para cursos filtrados cada vez que cambia el filtro o la URL
    useEffect(() => {
        fetchFilteredCourses();
    }, [fetchFilteredCourses]);

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

    // ... (Aquí irían las funciones CourseCard y FilterSection que ya tienes)

    const CourseCard = ({ course }) => (
        <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden">
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
            
            <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 h-10 mb-1">
                {course.title}
            </h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">
                {course.level}
            </p>

            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
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
            <button onClick={() => toggleTab(id)} className="flex items-center justify-between w-full text-left">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">{title}</span>
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
            
            {/* 1. SECCIÓN BUNDLE */}
            <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative bg-gray-900 rounded-[3.5rem] overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="relative z-10 flex flex-col lg:flex-row items-center p-10 lg:p-20 gap-16">
                        <div className="flex-1 text-center lg:text-left">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-widest mb-6 border border-orange-500/20">
                                <SparklesIcon className="h-4 w-4" /> Recomendación del mes
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                                Pack Maestro: <br/><span style={{ color: PRIMARY_COLOR }}>Sabiduría Integral</span>
                            </h1>
                            <p className="text-gray-400 text-lg mb-10 max-w-xl leading-relaxed">
                                Adquiere los pilares fundamentales con un precio especial de lanzamiento.
                            </p>
                            <button onClick={handleAddBundle} className="px-10 py-5 bg-white text-gray-900 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3 mx-auto lg:mx-0">
                                Adquirir Pack <FireIcon className="h-5 w-5 text-orange-500" />
                            </button>
                        </div>

                        <div className="flex-1 w-full max-w-md relative h-[350px] flex items-center justify-center">
                            {bundleItems.length > 0 ? (
                                bundleItems.map((c, i) => (
                                    <div key={c._id} className="absolute w-60 h-80 transition-all duration-500"
                                         style={{ transform: `rotate(${i * 8 - 8}deg) translateX(${i * 30}px)`, zIndex: 10 - i }}>
                                        <img src={c.thumbnail} className="w-full h-full object-cover rounded-2xl shadow-2xl border-2 border-white/10" alt="bundle-course" />
                                    </div>
                                ))
                            ) : (
                                <div className="w-full h-64 bg-gray-800 rounded-3xl border border-dashed border-gray-700 flex items-center justify-center text-gray-500 italic text-sm">Configura BUNDLE_IDS con IDs reales</div>
                            )}
                            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl z-30 -rotate-6">
                                <p className="text-gray-900 font-black text-2xl">${BUNDLE_PRICE}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. SECCIÓN DESTACADOS (USA featuredCourses) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <div className="flex items-center gap-4 mb-10">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Cursos Destacados</h2>
                    <div className="h-px flex-1 bg-gray-100"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {loadingFeatured ? (
                        [1,2,3,4].map(i => <div key={i} className="h-64 bg-gray-50 animate-pulse rounded-3xl"></div>)
                    ) : (
                        featuredCourses.map(course => <CourseCard key={course._id} course={course} />)
                    )}
                </div>
            </section>

            {/* 3. EXPLORACIÓN (USA courses filtrados) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16 border-t border-gray-100 pt-20">
                <aside className="lg:w-64 flex-shrink-0">
                    <div className="sticky top-28 space-y-2">
                        <div className="flex items-center gap-2 mb-8">
                            <AdjustmentsHorizontalIcon className="h-6 w-6 text-gray-900" />
                            <h2 className="font-black text-xl text-gray-900">Filtros</h2>
                        </div>

                        <FilterSection id="rating" title="Valoraciones" filterKey="rating" options={[
                            { label: '4.5 o más', value: '4.5' },
                            { label: '4.0 o más', value: '4.0' },
                            { label: '3.5 o más', value: '3.5' }
                        ]} />

                        <FilterSection id="duration" title="Duración de video" filterKey="duration" options={[
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
                    </div>
                </aside>

                <main className="flex-1">
                    {loading ? (
                        <div className="grid grid-cols-2 xl:grid-cols-3 gap-8 animate-pulse">
                            {[1,2,3,4,5,6].map(i => <div key={i} className="h-72 bg-gray-50 rounded-3xl"></div>)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 xl:grid-cols-3 gap-8">
                            {courses.length > 0 ? courses.map(course => (
                                <CourseCard key={course._id} course={course} />
                            )) : (
                                <div className="col-span-full py-20 text-center text-gray-400 italic">No hay cursos con estos criterios.</div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CategoryPage;