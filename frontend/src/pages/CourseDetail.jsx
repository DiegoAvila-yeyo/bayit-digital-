import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext'; // NUEVO

const CourseDetail = ({ PRIMARY_COLOR }) => {
  const { slug } = useParams(); 
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart(); // NUEVO: Función para añadir

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/courses/${slug}`);
        setCurso(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al traer el detalle del curso:", error);
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando la profundidad del curso...</div>;
  if (!curso) return <div className="min-h-screen flex items-center justify-center">Curso no encontrado.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <h1 className="text-4xl font-bold mb-4">{curso.title}</h1>
            <p className="text-xl mb-6 text-gray-300">{curso.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="bg-yellow-400 text-black px-2 py-1 font-bold rounded">Lo más vendido</span>
              <span className="text-yellow-400 font-bold">{curso.rating} ★★★★★</span>
              <span>({curso.reviews} reseñas)</span>
            </div>
            <p className="mt-4">Creado por <span className="text-blue-400 underline">{curso.instructor}</span></p>
            <p className="text-sm mt-2 text-gray-400 font-bold">Última actualización: {curso.updatedDate}</p>
          </div>

          <div className="md:w-1/3 bg-white text-black p-6 rounded-lg shadow-2xl border border-gray-200">
            <img src={curso.image} alt={curso.title} className="w-full h-48 object-cover rounded mb-4" />
            <div className="text-3xl font-bold mb-4">${curso.price} MX$</div>
            
            {/* BOTÓN ACTUALIZADO */}
            <button 
              onClick={() => addToCart(curso)}
              className="w-full py-3 text-white font-bold rounded mb-3 hover:brightness-110 transition-all"
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              Añadir a la cesta
            </button>
            
            <button className="w-full py-3 border border-black font-bold rounded">Comprar ahora</button>
            <p className="text-center text-xs mt-4 text-gray-500 font-bold">Garantía de reembolso de 30 días</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="md:w-2/3 border border-gray-200 p-8 bg-white rounded">
          <h2 className="text-2xl font-bold mb-6">Lo que aprenderás</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-bold">
            {curso.objectives?.map((obj, index) => (
              <div key={index} className="flex gap-3 text-sm text-gray-700">
                <span className="text-green-600 font-bold">✓</span>
                {obj}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;