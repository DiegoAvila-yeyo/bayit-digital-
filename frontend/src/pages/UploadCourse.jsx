import React, { useState, useEffect } from 'react';
import api from '../api/axios'; // La única importación nueva para el interceptor
import { toast } from 'react-hot-toast'; // Para notificaciones profesionales
import { 
    PlusIcon, 
    TrashIcon, 
    VideoCameraIcon,
    PhotoIcon,
    AcademicCapIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

const LEVELS = ['Iniciación', 'Intermedio', 'Avanzado', 'Masterclass'];
const GOALS = ['Paz Interior', 'Propósito', 'Conocimiento', 'Transformación'];
const LANGUAGES = [{code: 'es', name: 'Español'}, {code: 'en', name: 'Inglés'}];

export const UploadCourse = ({ PRIMARY_COLOR = "#F7A823" }) => {
    // ESTADOS BÁSICOS (Tal cual los tenías)
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState(''); 
    const [subcategory, setSubcategory] = useState('General');
    const [topic, setTopic] = useState('Espiritualidad');
    const [language, setLanguage] = useState('es');
    const [level, setLevel] = useState('Iniciación');
    const [goal, setGoal] = useState('Paz Interior');
    
    // ARCHIVOS
    const [thumbnail, setThumbnail] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // DINÁMICOS
    const [categoriesFromDB, setCategoriesFromDB] = useState([]);
    const [availableSubcategories, setAvailableSubcategories] = useState([]);

    const [sections, setSections] = useState([
        { id: Date.now(), title: 'Módulo 1', lessons: [{ id: Date.now() + 1, title: '', video: null, duration: '05:00' }] }
    ]);

    // CARGAR CATEGORÍAS
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                setCategoriesFromDB(res.data);
            } catch (err) {
                console.error("Error al cargar categorías");
            }
        };
        fetchCategories();
    }, []);

    // SINCRONIZAR SUBCATEGORÍAS
    useEffect(() => {
        const selectedCat = categoriesFromDB.find(c => c._id === categoryId);
        if (selectedCat && selectedCat.subcategories) {
            setAvailableSubcategories(selectedCat.subcategories);
            setSubcategory(selectedCat.subcategories[0] || 'General');
        } else {
            setAvailableSubcategories([]);
            setSubcategory('General');
        }
    }, [categoryId, categoriesFromDB]);

    const resetForm = () => {
        setTitle('');
        setPrice('');
        setDescription('');
        setCategoryId('');
        setSubcategory('General');
        setTopic('Espiritualidad');
        setLanguage('es');
        setLevel('Iniciación');
        setGoal('Paz Interior');
        setThumbnail(null);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        setSections([
            { id: Date.now(), title: 'Módulo 1', lessons: [{ id: Date.now() + 1, title: '', video: null, duration: '05:00' }] }
        ]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // LÓGICA DE SECCIONES Y LECCIONES (Mantengo tu lógica exacta)
    const addSection = () => {
        setSections([...sections, { 
            id: Date.now(), 
            title: `Módulo ${sections.length + 1}`, 
            lessons: [{ id: Date.now() + 1, title: '', video: null, duration: '05:00' }] 
        }]);
    };

    const removeSection = (sectionId) => {
        if (sections.length > 1) setSections(sections.filter(s => s.id !== sectionId));
    };

    const addLesson = (sectionId) => {
        setSections(sections.map(sec => 
            sec.id === sectionId 
            ? { ...sec, lessons: [...sec.lessons, { id: Date.now(), title: '', video: null, duration: '05:00' }] } 
            : sec
        ));
    };

    const updateLesson = (sectionId, lessonId, field, value) => {
        setSections(sections.map(sec => 
            sec.id === sectionId 
            ? { ...sec, lessons: sec.lessons.map(les => les.id === lessonId ? { ...les, [field]: value } : les) } 
            : sec
        ));
    };

    const removeLesson = (sectionId, lessonId) => {
        setSections(sections.map(sec => {
            if (sec.id === sectionId && sec.lessons.length > 1) {
                return { ...sec, lessons: sec.lessons.filter(l => l.id !== lessonId) };
            }
            return sec;
        }));
    };

    // HANDLE SUBMIT MODIFICADO (Implementando el Interceptor y Cloudinary)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const loadingToast = toast.loading("Publicando enseñanza en la nube...");

        const formData = new FormData();
        formData.append('title', title);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('category', categoryId); 
        formData.append('subcategory', subcategory);
        formData.append('topic', topic);
        formData.append('language', language);
        formData.append('level', level);
        formData.append('goal', goal);
        formData.append('published', 'true');

        if (thumbnail) formData.append('thumbnail', thumbnail);

        const layout = sections.map(sec => ({
            title: sec.title,
            lessons: sec.lessons.map(les => ({ title: les.title, duration: les.duration }))
        }));
        formData.append('sectionsLayout', JSON.stringify(layout));

        sections.forEach(sec => {
            sec.lessons.forEach(les => {
                if (les.video) formData.append('videos', les.video);
            });
        });

        try {
            // Ya no pasamos headers manuales ni token, api lo hace solo
            await api.post('/courses', formData);
            toast.success('¡Enseñanza publicada con éxito!', { id: loadingToast });
            resetForm();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Error al subir el curso', { id: loadingToast });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-8 bg-gray-50 min-h-screen">
            <header className="mb-10 text-center md:text-left">
                <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic">
                    NUEVA <span style={{ color: PRIMARY_COLOR }}>ENSEÑANZA</span>
                </h2>
                <p className="text-gray-500 font-medium">Sincroniza tu conocimiento con la red espiritual.</p>
            </header>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* BLOQUE DE DATOS PRINCIPALES */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-3">
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2">Título de la Enseñanza</label>
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-orange-200 transition-all" placeholder="Ej: El Despertar de la Conciencia" required />
                            </div>
                            <div className="md:col-span-1">
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2">Precio ($)</label>
                                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl font-black outline-none border-2 border-transparent focus:border-orange-200 transition-all" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2">Descripción Profunda</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl font-medium outline-none h-32 border-2 border-transparent focus:border-orange-200 transition-all resize-none"></textarea>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 text-center">Imagen de Portada</label>
                        <label className="relative flex-1 flex flex-col items-center justify-center border-4 border-dashed border-gray-100 rounded-[2.5rem] hover:bg-gray-50 cursor-pointer overflow-hidden transition-all">
                            {preview ? (
                                <img src={preview} alt="preview" className="w-full h-full object-cover absolute inset-0" />
                            ) : (
                                <div className="text-center p-4">
                                    <PhotoIcon className="h-12 w-12 text-gray-200 mx-auto" />
                                    <span className="text-[10px] font-black text-gray-300 block mt-2">SUBIR ARTE</span>
                                </div>
                            )}
                            <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
                        </label>
                    </div>
                </div>

                {/* FILTROS Y CATEGORIZACIÓN (Incluyo tu lógica de subcategorías y niveles) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                        <label className="text-[10px] font-black uppercase text-gray-400 block mb-2 text-center">Categoría Raíz</label>
                        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full bg-transparent font-bold outline-none text-center cursor-pointer" required>
                            <option value="">Seleccionar...</option>
                            {categoriesFromDB.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                        </select>
                    </div>

                    <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                        <label className="text-[10px] font-black uppercase text-gray-400 block mb-2 text-center">Subcategoría</label>
                        <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className="w-full bg-transparent font-bold outline-none text-center cursor-pointer">
                            {availableSubcategories.length > 0 ? (
                                availableSubcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)
                            ) : (
                                <option value="General">General</option>
                            )}
                        </select>
                    </div>

                    <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                        <label className="text-[10px] font-black uppercase text-gray-400 block mb-2 text-center">Nivel</label>
                        <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full bg-transparent font-bold outline-none text-center cursor-pointer">
                            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>

                    <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                        <label className="text-[10px] font-black uppercase text-gray-400 block mb-2 text-center">Idioma</label>
                        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-transparent font-bold outline-none text-center cursor-pointer">
                            {LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* SECCIONES Y CURRÍCULUM */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center px-4">
                        <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase italic">Plan de Estudio</h3>
                        <button type="button" onClick={addSection} className="bg-black text-white px-6 py-2 rounded-full text-[10px] font-black flex items-center gap-2 hover:bg-orange-500 transition-all shadow-lg">
                            <PlusIcon className="h-4 w-4" /> AÑADIR MÓDULO
                        </button>
                    </div>

                    {sections.map((section, sIdx) => (
                        <div key={section.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                            <div className="flex items-center bg-gray-900 text-white p-4 px-8">
                                <AcademicCapIcon className="h-5 w-5 text-orange-400 mr-3" />
                                <input 
                                    type="text" 
                                    value={section.title} 
                                    onChange={(e) => {
                                        const newSections = [...sections];
                                        newSections[sIdx].title = e.target.value;
                                        setSections(newSections);
                                    }}
                                    className="flex-1 bg-transparent font-black outline-none text-sm uppercase tracking-widest"
                                />
                                <button type="button" onClick={() => removeSection(section.id)} className="p-2 hover:text-red-500 transition-colors"><TrashIcon className="h-5 w-5" /></button>
                            </div>
                            <div className="p-6 space-y-4 bg-gray-50/30">
                                {section.lessons.map((lesson) => (
                                    <div key={lesson.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 bg-white rounded-3xl shadow-sm border border-gray-100 transition-hover hover:border-orange-100">
                                        <div className="md:col-span-5">
                                            <input type="text" placeholder="Nombre de la lección..." value={lesson.title} onChange={(e) => updateLesson(section.id, lesson.id, 'title', e.target.value)} className="w-full p-3 rounded-xl font-bold text-sm bg-gray-50 outline-none focus:bg-white transition-all" required />
                                        </div>
                                        <div className="md:col-span-3 flex items-center gap-2 bg-gray-50 p-3 rounded-xl">
                                            <ClockIcon className="h-4 w-4 text-gray-400" />
                                            <input type="text" value={lesson.duration} onChange={(e) => updateLesson(section.id, lesson.id, 'duration', e.target.value)} className="w-full bg-transparent outline-none text-xs font-black text-center" />
                                        </div>
                                        <div className="md:col-span-3">
                                            <label className="flex items-center justify-center gap-2 cursor-pointer bg-gray-900 text-white p-3 rounded-xl hover:bg-orange-500 transition-all shadow-md group">
                                                <VideoCameraIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                <span className="text-[10px] font-black uppercase">{lesson.video ? 'VIDEO CARGADO' : 'SUBIR VIDEO'}</span>
                                                <input type="file" accept="video/*" className="hidden" onChange={(e) => updateLesson(section.id, lesson.id, 'video', e.target.files[0])} />
                                            </label>
                                        </div>
                                        <div className="md:col-span-1 flex justify-center">
                                            <button type="button" onClick={() => removeLesson(section.id, lesson.id)} className="text-gray-300 hover:text-red-500 transition-colors"><TrashIcon className="h-6 w-6" /></button>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addLesson(section.id)} className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-[10px] font-black text-gray-400 uppercase hover:border-orange-300 hover:text-orange-500 transition-all">+ Nueva Lección en este Módulo</button>
                            </div>
                        </div>
                    ))}
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full py-10 rounded-[4rem] text-white font-black text-4xl shadow-2xl transition-all active:scale-95 flex flex-col items-center justify-center group relative overflow-hidden ${isSubmitting ? 'opacity-50' : ''}`} 
                    style={{ backgroundColor: PRIMARY_COLOR }}
                >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative z-10">{isSubmitting ? 'PUBLICANDO...' : 'PUBLICAR ENSEÑANZA'}</span>
                </button>
            </form>
        </div>
    );
};

export default UploadCourse;