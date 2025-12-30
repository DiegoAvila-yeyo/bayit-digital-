import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/outline';

const Cart = ({ PRIMARY_COLOR }) => {
    const { cartItems, removeFromCart, cartTotal } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <h2 className="text-2xl font-bold mb-4">Tu cesta está vacía</h2>
                <Link 
                    to="/" 
                    className="px-6 py-2 text-white rounded-lg font-bold"
                    style={{ backgroundColor: PRIMARY_COLOR }}
                >
                    Explorar cursos
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Cesta de compra</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Lista de productos */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item._id} className="bg-white p-4 rounded-xl shadow-sm border flex gap-4 items-center">
                                <img src={item.image} alt={item.title} className="w-24 h-16 object-cover rounded" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                                    <p className="text-sm text-gray-500">{item.instructor}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">${item.price} MX$</p>
                                    <button 
                                        onClick={() => removeFromCart(item._id)}
                                        className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 mt-1"
                                    >
                                        <TrashIcon className="h-4 w-4" /> Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Resumen de pago */}
                    <div className="bg-white p-6 rounded-xl shadow-md border h-fit sticky top-28">
                        <h2 className="text-gray-500 font-bold mb-2 uppercase text-xs">Resumen</h2>
                        <div className="text-4xl font-bold mb-6">${cartTotal} MX$</div>
                        <button 
                            className="w-full py-3 text-white font-bold rounded-lg transition-transform active:scale-95"
                            style={{ backgroundColor: PRIMARY_COLOR }}
                        >
                            Pagar ahora
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;