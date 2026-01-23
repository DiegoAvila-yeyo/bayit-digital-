import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { AuthContext } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);

    // Sincronizar al cargar el usuario
    useEffect(() => {
        if (user && user.cart) {
            setCartItems(user.cart);
        } else {
            setCartItems([]);
        }
    }, [user]);

    // Guardar en DB
    const syncCartWithDB = async (newCart) => {
        if (!user) return;
        try {
            const courseIds = newCart
                .map(item => item.itemType === 'bundle' ? item.courses : item._id)
                .flat();

            await api.put('/users/update-cart', 
                { cart: [...new Set(courseIds)] }
            );
        } catch (error) {
            console.error("Error al sincronizar carrito");
        }
    };

    const addToCart = (item, isBundle = false) => {
        if (isBundle) {
            const hasBundle = cartItems.some(x => x.itemType === 'bundle');
            if (hasBundle) {
                toast.error("Solo se permite un Pack Ahorro por compra.");
                return;
            }
            
            const bundleItem = {
                _id: `bundle-${Date.now()}`,
                title: `Pack Ahorro: ${item.categoryName}`,
                price: Number(item.price),
                courses: item.courses,
                itemType: 'bundle',
                thumbnail: item.thumbnail
            };

            const updated = [...cartItems, bundleItem];
            setCartItems(updated);
            syncCartWithDB(updated);
            toast.success("¡Pack Ahorro añadido!");
        } else {
            const exist = cartItems.find((x) => x._id === item._id);
            if (!exist) {
                const updated = [...cartItems, { ...item, itemType: 'course' }];
                setCartItems(updated);
                syncCartWithDB(updated);
                toast.success("Curso añadido");
            } else {
                toast.error("Ya está en tu cesta.");
            }
        }
    };

    const removeFromCart = (id) => {
        const updated = cartItems.filter((x) => x._id !== id);
        setCartItems(updated);
        syncCartWithDB(updated);
    };

    const clearCart = () => {
        setCartItems([]);
        syncCartWithDB([]);
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0), 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);