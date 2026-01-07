import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export const SearchResultsPage = ({ PRIMARY_COLOR }) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    // Extraer el parámetro "q" de la URL (?q=algo)
    const query = new URLSearchParams(location.search).get('q');

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;
            try {
                setLoading(true);
                // Usamos el endpoint que actualizamos en el backend
                const res = await axios.get(`http://localhost:5000/api/courses?search=${query}`);
                setResults(res.data);
            } catch (error) {
                console.error("Error en la búsqueda", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    return (
        <div className="min-h-screen bg-white p-8 md:p-16">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-black text-gray-900 mb-2">
                    Resultados para "{query}"
                </h1>
                <p className="text-gray-500 mb-10">
                    Hemos encontrado {results.length} cursos que coinciden con tu búsqueda.
                </p>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                        <p className="mt-4 text-gray-500 font-medium">Buscando en la academia...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {results.length > 0 ? (
                            results.map(course => (
                                <div key={course._id} className="group border rounded-2xl overflow-hidden hover:shadow-xl transition-all">
                                    <img 
                                        src={`http://localhost:5000${course.thumbnail}`} 
                                        alt={course.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                                    />
                                    <div className="p-6">
                                        <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                                        <p className="text-gray-500 text-sm line-clamp-2 mb-4">{course.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-black">${course.price}</span>
                                            <button 
                                                className="px-4 py-2 rounded-lg text-white font-bold text-sm"
                                                style={{ backgroundColor: PRIMARY_COLOR }}
                                            >
                                                Ver curso
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed">
                                <p className="text-xl text-gray-400 font-medium">No encontramos nada que coincida con "{query}".</p>
                                <p className="text-sm text-gray-400 mt-2">Intenta con otras palabras clave o explora las categorías.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};