import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    CloudArrowUpIcon, 
    PlusIcon, 
    TrashIcon, 
    VideoCameraIcon,
    PhotoIcon 
} from '@heroicons/react/24/outline';

export const UploadCourse = ({ PRIMARY_COLOR }) => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [thumbnail, setThumbnail] = useState(null); // Nuevo estado para la imagen
    const [sections, setSections] = useState([
        { id: Date.now(), title: 'Día 1', lessons: [{ id: Date.now() + 1, title: '', video: null }] }
    ]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/categories');
                setCategories(res.data);
            } catch (err) {
                console.error("Error al cargar categorías");
            }
        };
        fetchCategories();
    }, []);

    // Funciones para manejar secciones y lecciones
    const addSection = () => {
        setSections([...sections, { id: Date.now(), title: `Día ${sections.length + 1}`, lessons: [{ id: Date.now() + 1, title: '', video: null }] }]);
    };

    const addLesson = (sectionId) => {
        setSections(sections.map(sec => 
            sec.id === sectionId 
            ? { ...sec, lessons: [...sec.lessons, { id: Date.now(), title: '', video: null }] }
            : sec
        ));
    };

    const updateLesson = (sectionId, lessonId, field, value) => {
        setSections(sections.map(sec => {
            if (sec.id === sectionId) {
                return {
                    ...sec,
                    lessons: sec.lessons.map(les => les.id === lessonId ? { ...les, [field]: value } : les)
                };
            }
            return sec;
        }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Obtenemos el token directamente de la clave 'token' que vimos en tu Local Storage
    const token = localStorage.getItem('token');

    if (!token) {
        alert('No se encontró una sesión activa. Por favor, inicia sesión de nuevo.');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('category', category);
    
    // Imagen de portada
    if (thumbnail) {
        formData.append('thumbnail', thumbnail);
    }

    // Estructura de secciones
    const layout = sections.map(sec => ({
        title: sec.title,
        lessons: sec.lessons.map(les => ({ title: les.title }))
    }));
    formData.append('sectionsLayout', JSON.stringify(layout));

    // Videos en orden
    sections.forEach(sec => {
        sec.lessons.forEach(les => {
            if (les.video) formData.append('videos', les.video);
        });
    });

    try {
        // Mostramos un mensaje de carga si lo deseas, subir videos toma tiempo
        console.log("Subiendo curso con token:", token);

        const config = {
            headers: { 
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        };

        const { data } = await axios.post('http://localhost:5000/api/courses', formData, config);
        
        alert('¡Curso y videos subidos con éxito!');
        // Opcional: limpiar el formulario o redirigir
    } catch (err) {
        console.error("Error al subir:", err.response);
        
        // Manejo de errores específicos según lo que responda tu backend
        const message = err.response && err.response.data.message 
            ? err.response.data.message 
            : 'Error de conexión con el servidor';
            
        alert(`Error: ${message}`);

        if (err.response && err.response.status === 401) {
            alert("Tu sesión ha expirado o no tienes permisos. Intenta loguearte de nuevo.");
        }
    }
};

    return (
        <div className="max-w-5xl mx-auto p-8 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-extrabold mb-8 text-gray-900">Crear Nuevo Curso</h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* INFORMACIÓN BÁSICA */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Título del Curso</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ej: Master en React desde Cero" required />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Precio (USD)</label>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 border rounded-lg" placeholder="29.99" required />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Categoría</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 border rounded-lg" required>
                            <option value="">Selecciona una</option>
                            {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 border rounded-lg h-32" placeholder="¿De qué trata tu curso?" required></textarea>
                    </div>

                    {/* SECCIÓN DE PORTADA */}
                    <div className="md:col-span-2 border-2 border-dashed border-gray-300 rounded-xl p-6 bg-blue-50/30">
                        <label className="flex flex-col items-center cursor-pointer">
                            <PhotoIcon className="h-12 w-12 text-blue-500 mb-2" />
                            <span className="text-sm font-bold text-gray-700">Subir imagen de portada</span>
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => setThumbnail(e.target.files[0])} 
                            />
                            {thumbnail && <span className="mt-2 text-xs text-green-600 font-bold">{thumbnail.name} seleccionado</span>}
                        </label>
                    </div>
                </div>

                {/* GESTIÓN DE SECCIONES */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-800">Contenido del Curso</h3>
                        <button type="button" onClick={addSection} style={{ backgroundColor: PRIMARY_COLOR }} className="flex items-center gap-2 text-white px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-all">
                            <PlusIcon className="h-5 w-5" /> Agregar Día/Sección
                        </button>
                    </div>

                    {sections.map((section, sIdx) => (
                        <div key={section.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-gray-100 p-4 border-b border-gray-200">
                                <input 
                                    type="text" 
                                    value={section.title} 
                                    onChange={(e) => {
                                        const newSections = [...sections];
                                        newSections[sIdx].title = e.target.value;
                                        setSections(newSections);
                                    }}
                                    className="bg-transparent font-bold text-gray-800 outline-none focus:border-b border-gray-400 w-full"
                                />
                            </div>

                            <div className="p-4 space-y-4">
                                {section.lessons.map((lesson, lIdx) => (
                                    <div key={lesson.id} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="flex-1">
                                            <input 
                                                type="text" 
                                                placeholder="Título de la lección" 
                                                value={lesson.title}
                                                onChange={(e) => updateLesson(section.id, lesson.id, 'title', e.target.value)}
                                                className="w-full p-2 border rounded bg-white"
                                            />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 border rounded hover:bg-gray-100 transition-all">
                                                <VideoCameraIcon className="h-5 w-5 text-gray-500" />
                                                <span className="text-sm font-medium">{lesson.video ? 'Cambiado' : 'Subir Video'}</span>
                                                <input 
                                                    type="file" 
                                                    accept="video/*" 
                                                    className="hidden" 
                                                    onChange={(e) => updateLesson(section.id, lesson.id, 'video', e.target.files[0])}
                                                />
                                            </label>
                                            {lesson.video && <span className="text-[10px] text-gray-400 truncate max-w-[100px]">{lesson.video.name}</span>}
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addLesson(section.id)} className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:underline">
                                    <PlusIcon className="h-4 w-4" /> Añadir lección a esta sección
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button type="submit" className="w-full py-4 rounded-xl text-white font-extrabold text-xl shadow-lg transition-all active:scale-95" style={{ backgroundColor: PRIMARY_COLOR }}>
                    Publicar Curso Completo
                </button>
            </form>
        </div>
    );
};

export default UploadCourse;