import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';

export const Cart = ({ PRIMARY_COLOR }) => {
    const { cartItems, removeFromCart, totalPrice } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu cesta está vacía.</h2>
                <Link to="/" className="px-6 py-3 bg-purple-600 text-white font-bold rounded hover:bg-purple-700">
                    Sigue comprando
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-8 bg-white min-h-screen font-sans text-black">
            <h1 className="text-4xl font-bold mb-6 text-gray-900">Cesta</h1>
            
            <p className="font-bold text-gray-900 mb-2">{cartItems.length} cursos en la cesta</p>
            <hr className="mb-6 border-gray-200" />

            <div className="flex flex-col lg:flex-row gap-12">
                
                {/* LISTADO DE CURSOS (IZQUIERDA) */}
                <div className="flex-1 space-y-6">
                    {cartItems.map((item) => (
                        <div key={item._id} className="flex flex-col sm:flex-row gap-4 py-4 border-b border-gray-200 relative group">
                            {/* Imagen del curso */}
                            <img 
                                src={item.thumbnail ? `http://localhost:5000${item.thumbnail}` : 'https://placehold.co/300x170'} 
                                alt={item.title} 
                                className="w-full sm:w-44 h-28 object-cover rounded border border-gray-200" 
                            />

                            {/* Info del curso */}
                            <div className="flex-1">
                                <h3 className="text-md font-bold text-gray-900 leading-tight mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-gray-600 mb-1">Por {item.teacher?.name || 'Instructor de Bayit'}</p>
                                
                                <div className="flex items-center gap-1 mb-1">
                                    <span className="text-sm font-bold text-orange-800">4.7</span>
                                    <div className="flex text-orange-500">
                                        {[...Array(5)].map((_, i) => <StarIcon key={i} className="h-3 w-3" />)}
                                    </div>
                                    <span className="text-xs text-gray-500">(72,313 valoraciones)</span>
                                </div>

                                <div className="text-xs text-gray-500 flex gap-2 mb-2">
                                    <span>61.5 horas en total</span>
                                    <span>•</span>
                                    <span>{item.lessons?.length || 0} clases</span>
                                    <span>•</span>
                                    <span>Todos los niveles</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="bg-[#eceb98] text-[#3d3c0a] px-2 py-0.5 font-bold text-[10px] rounded uppercase">Actualizado recientemente</span>
                                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 font-bold text-[10px] rounded flex items-center gap-1">
                                        <span className="text-lg leading-none">◈</span> Premium
                                    </span>
                                </div>
                            </div>

                            {/* Acciones y Precio (Derecha del item) */}
                            <div className="flex flex-col items-end gap-1 min-w-[100px]">
                                <button onClick={() => removeFromCart(item._id)} className="text-purple-600 text-sm hover:text-purple-800 underline">Eliminar</button>
                                <button className="text-purple-600 text-sm hover:text-purple-800 underline">Guardar para después</button>
                                <button className="text-purple-600 text-sm hover:text-purple-800 underline">Mover a la lista de deseos</button>
                            </div>

                            <div className="text-right ml-4">
                                <p className="text-lg font-bold text-purple-700 flex items-center justify-end gap-1">
                                    MX${item.price} <span className="text-xs">🏷️</span>
                                </p>
                                <p className="text-sm text-gray-400 line-through">MX$1,299</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* RESUMEN DE PAGO (DERECHA / STICKY) */}
                <div className="lg:w-[320px]">
                    <div className="sticky top-6">
                        <p className="text-gray-600 font-bold mb-1">Total:</p>
                        <p className="text-4xl font-bold text-gray-900 mb-1">MX${totalPrice.toFixed(2)}</p>
                        <p className="text-sm text-gray-500 line-through mb-1">MX${(totalPrice * 2.5).toFixed(0)}</p>
                        <p className="text-md text-gray-900 mb-6">60 % de descuento</p>

                        <button 
                            className="w-full py-4 text-white font-bold text-lg rounded bg-purple-600 hover:bg-purple-700 transition-colors mb-3 flex items-center justify-center gap-2"
                        >
                            Proceder a pagar <span>→</span>
                        </button>

                        <p className="text-center text-xs text-gray-500 mb-6">Todavía no se cobrará</p>

                        <div className="border-t border-gray-200 pt-6">
                            <button className="w-full py-3 border border-gray-900 text-gray-900 font-bold rounded hover:bg-gray-50 transition-colors">
                                Aplicar cupón
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
export default Cart;