import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart_bayit');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart_bayit', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (course) => {
        const exists = cartItems.find(item => item._id === course._id);
        if (exists) {
            toast.error("Este curso ya está en tu cesta");
            return;
        }
        setCartItems([...cartItems, course]);
        toast.success("¡Curso añadido con éxito!");
    };

    const removeFromCart = (id) => {
        setCartItems(cartItems.filter(item => item._id !== id));
        toast.success("Curso eliminado de la cesta");
    };

    const clearCart = () => setCartItems([]);

    const cartTotal = cartItems.reduce((acc, item) => acc + item.price, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);