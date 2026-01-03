import React, { useState, useEffect } from 'react';
import { getCategories } from '../services/categoryService';
import { CloudArrowUpIcon, FilmIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const UploadCourse = ({ PRIMARY_COLOR }) => {
    const [categories, setCategories] = useState([]);
    const [video, setVideo] = useState(null);
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        const fetchCats = async () => {
            const data = await getCategories();
            setCategories(data);
        };
        fetchCats();
    }, []);

    // Funciones para el Drag & Drop
    const handleDrag = (e) => {
        e.preventDefault();
        setDragging(e.type === "dragover");
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("video/")) setVideo(file);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    
                    {/* Header de la página */}
                    <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Subir nuevo curso</h1>
                            <p className="text-gray-500 mt-1">Comparte tu conocimiento con la comunidad de Bayit Digital.</p>
                        </div>
                        <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-blue-50">
                            <FilmIcon className="h-6 w-6" style={{ color: PRIMARY_COLOR }} />
                        </div>
                    </div>

                    <form className="p-8 space-y-8">
                        {/* Sección 1: Detalles Básicos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Título del curso</label>
                                <input type="text" placeholder="Ej: Fundamentos de la Fe" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Precio sugerido (USD)</label>
                                <input type="number" placeholder="29.99" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                        </div>

                        {/* Sección 2: Categoría */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Categoría del contenido</label>
                            <select className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none">
                                <option value="">Selecciona un tema...</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sección 3: Zona de Drag & Drop */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Video del curso</label>
                            <div 
                                onDragOver={handleDrag}
                                onDragLeave={handleDrag}
                                onDrop={handleDrop}
                                className={`relative border-2 border-dashed rounded-3xl p-12 transition-all flex flex-col items-center justify-center space-y-4 ${
                                    dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-blue-300'
                                }`}
                            >
                                {video ? (
                                    <div className="text-center">
                                        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-2" />
                                        <p className="font-bold text-gray-800">{video.name}</p>
                                        <button onClick={() => setVideo(null)} className="text-sm text-red-500 font-medium mt-2 underline">Cambiar video</button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="p-4 bg-white rounded-full shadow-sm">
                                            <CloudArrowUpIcon className="h-10 w-10 text-gray-400" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-lg font-semibold text-gray-700">Arrastra y suelta tu video aquí</p>
                                            <p className="text-sm text-gray-400">o haz clic para seleccionar desde tus archivos</p>
                                        </div>
                                        <input 
                                            type="file" 
                                            accept="video/*" 
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => setVideo(e.target.files[0])}
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Botón de Acción */}
                        <button 
                            type="submit" 
                            className="w-full py-4 rounded-2xl text-white font-bold text-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                            style={{ backgroundColor: PRIMARY_COLOR }}
                        >
                            Publicar curso ahora
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UploadCourse;