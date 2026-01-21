import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="p-20 text-center">Cargando seguridad...</div>;

    // Verificamos que el usuario exista Y que su rol sea 'admin'
    return user && user.role === 'admin' ? children : <Navigate to="/" />;
};

export default AdminRoute;