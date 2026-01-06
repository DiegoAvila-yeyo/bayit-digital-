import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Inicializamos con lo que haya en localStorage para no perder el carrito al refrescar
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (course) => {
        const exist = cartItems.find((x) => x._id === course._id);
        if (!exist) {
            setCartItems([...cartItems, course]);
            alert("Curso añadido al carrito");
        } else {
            alert("Este curso ya está en tu carrito");
        }
    };

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter((x) => x._id !== id));
    };

    const clearCart = () => setCartItems([]);

    const totalPrice = cartItems.reduce((acc, item) => {
    const price = Number(item.price) || 0; // Forzamos a número
    return acc + price;
}, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);