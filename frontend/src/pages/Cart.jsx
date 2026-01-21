import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { TrashIcon, HeartIcon, ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

export const Cart = ({ PRIMARY_COLOR = "#F7A823" }) => {
    const { cartItems, removeFromCart, totalPrice } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Tu cesta espera ser llenada</h2>
                <p className="text-gray-500 mb-8 max-w-sm">Parece que aún no has elegido tu próximo desafío espiritual. Explora nuestra biblioteca.</p>
                <Link 
                    to="/" 
                    className="px-8 py-4 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-orange-200"
                    style={{ backgroundColor: PRIMARY_COLOR }}
                >
                    Descubrir Cursos
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-12 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* CABECERA */}
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Tu Cesta de Aprendizaje</h1>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-600">{cartItems.length} {cartItems.length === 1 ? 'ítem seleccionado' : 'ítems seleccionados'}</span>
                        <div className="h-1 w-1 bg-gray-400 rounded-full"></div>
                        <span className="text-gray-500 italic">Un paso más hacia tu propósito</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* LISTADO DE ITEMS */}
                    <div className="flex-1 space-y-4">
                        {cartItems.map((item) => {
                            const isBundle = item.itemType === 'bundle';
                            
                            return (
                                <div 
                                    key={item._id} 
                                    className={`bg-white rounded-2xl p-4 sm:p-6 shadow-sm border ${isBundle ? 'border-orange-200 bg-orange-50/30' : 'border-gray-100'} flex flex-col sm:flex-row gap-6 transition-all hover:shadow-md group relative overflow-hidden`}
                                >
                                    {/* Indicador visual de Bundle */}
                                    {isBundle && (
                                        <div className="absolute top-0 right-0 bg-orange-500 text-white text-[8px] font-black uppercase px-4 py-1 rounded-bl-xl tracking-widest">
                                            Ahorro 40%
                                        </div>
                                    )}

                                    {/* Imagen */}
                                    <div className="relative w-full sm:w-48 h-32 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-200">
                                        <img 
                                            src={item.thumbnail?.startsWith('http') ? item.thumbnail : `http://localhost:5000${item.thumbnail}`} 
                                            alt={item.title} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                        />
                                        <div className="absolute inset-0 bg-black/5"></div>
                                    </div>

                                    {/* Info del ítem */}
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                {isBundle && (
                                                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-1 mb-1">
                                                        <SparklesIcon className="h-3 w-3" /> Pack Especial
                                                    </span>
                                                )}
                                                <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-gray-700 transition-colors">
                                                    {item.title}
                                                </h3>
                                            </div>
                                            <p className="text-xl font-black text-gray-900">
                                                ${item.price}
                                            </p>
                                        </div>
                                        
                                        <p className="text-sm text-gray-500 mb-2">
                                            {isBundle ? (
                                                <span className="text-orange-600/70 font-medium">Contenido Multidisciplinar</span>
                                            ) : (
                                                <>Por <span className="font-semibold text-gray-700">{item.teacher?.name || 'Instructor de Bayit'}</span></>
                                            )}
                                        </p>
                                        
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="flex items-center text-orange-500">
                                                <StarSolid className="h-4 w-4" />
                                                <span className="ml-1 text-sm font-bold text-gray-900">5.0</span>
                                            </div>
                                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                                                {isBundle ? 'Pack de Categoría' : 'Premium Selection'}
                                            </span>
                                        </div>

                                        {/* Acciones */}
                                        <div className="mt-auto flex items-center gap-6 border-t border-gray-50 pt-4">
                                            <button 
                                                onClick={() => removeFromCart(item._id)} 
                                                className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest"
                                            >
                                                <TrashIcon className="h-4 w-4" /> Eliminar
                                            </button>
                                            {!isBundle && (
                                                <button className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest">
                                                    <HeartIcon className="h-4 w-4" /> Guardar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* RESUMEN DE PAGO */}
                    <div className="lg:w-[380px]">
                        <div className="sticky top-8 bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                            <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight">Resumen</h2>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Subtotal</span>
                                    <span className="text-gray-400 line-through">
                                        ${(totalPrice * 1.4).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-900 font-black text-3xl pt-2 border-t border-gray-50">
                                    <span>Total</span>
                                    <span style={{ color: PRIMARY_COLOR }}>${totalPrice.toFixed(2)}</span>
                                </div>
                                
                                {cartItems.some(i => i.itemType === 'bundle') ? (
                                    <p className="text-orange-600 text-sm font-bold bg-orange-50 p-3 rounded-xl text-center border border-orange-100">
                                        🎉 ¡Estás aprovechando el Pack Ahorro!
                                    </p>
                                ) : (
                                    <p className="text-green-600 text-sm font-bold bg-green-50 p-2 rounded-lg text-center">
                                        Formación espiritual de alto nivel
                                    </p>
                                )}
                            </div>

                            <button 
                                className="w-full py-5 text-white font-black text-lg rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                                style={{ backgroundColor: PRIMARY_COLOR, boxShadow: `0 10px 20px -10px ${PRIMARY_COLOR}88` }}
                            >
                                Proceder al pago <ArrowRightIcon className="h-5 w-5 stroke-[3px]" />
                            </button>

                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="Código de cupón" 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                                        style={{ '--tw-ring-color': PRIMARY_COLOR }}
                                    />
                                    <button className="absolute right-2 top-2 bottom-2 px-4 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-colors">
                                        Aplicar
                                    </button>
                                </div>
                            </div>

                            <p className="mt-6 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                Pago seguro mediante tecnología de Reino
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Cart;