import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export const CategoryPage = ({ PRIMARY_COLOR }) => {
    const { categorySlug } = useParams(); // Esto atrapa "estudios-profeticos" de la URL
    const [courses, setCourses] = useState([]);

    useEffect(() => {
    const fetchCourses = async () => {
        try {
            // Verificamos que categorySlug no sea undefined antes de llamar
            if (categorySlug) {
                const res = await axios.get(`http://localhost:5000/api/courses?category=${categorySlug}`);
                setCourses(res.data);
            }
        } catch (error) {
            console.error("Error filtrando cursos", error);
        }
    };
    fetchCourses();
}, [categorySlug]);

    return (
        <div className="max-w-7xl mx-auto p-8 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 capitalize">
                Cursos de {categorySlug.replace(/-/g, ' ')}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.length > 0 ? (
                    courses.map(course => (
                        <div key={course._id} className="border rounded-xl overflow-hidden shadow-sm">
                            <img src={`http://localhost:5000${course.thumbnail}`} alt={course.title} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h3 className="font-bold text-lg">{course.title}</h3>
                                <p className="text-xl font-bold mt-2" style={{ color: PRIMARY_COLOR }}>${course.price}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No hay cursos disponibles en esta categoría todavía.</p>
                )}
            </div>
        </div>
    );
};