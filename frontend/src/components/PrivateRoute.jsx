import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return <div className="flex justify-center items-center h-screen">Cargando...</div>;

    // Si no hay usuario, redirigir al login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Si el usuario existe pero NO está verificado (Fase 1), mandarlo a verificar
    if (user && user.isVerified === false) {
        return <Navigate to="/verify-email" replace />;
    }

    return children;
};

export default PrivateRoute;