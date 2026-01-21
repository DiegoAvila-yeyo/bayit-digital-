import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import { Hero } from './components/Hero.jsx';
import { CourseCarousel } from './components/CourseCarousel.jsx';
import { SendaPro } from './components/SendaPro.jsx';
import ComingSoon from './pages/ComingSoon';
import { UdemyCarousel } from './components/UdemyCarousel.jsx';
import { Footer } from './components/Footer.jsx';
import { CourseDetail } from './pages/CourseDetail.jsx';
import { CategoryPage } from './pages/CategoryPage.jsx';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import { Toaster } from 'react-hot-toast';
import { SearchResultsPage } from './pages/SearchResultsPage';

// --- IMPORTACIÓN DE PROTECTORES DE RUTAS ---
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute'; // Nuevo guardián de rol

import MyLearning from './pages/MyLearning'; 
import EditProfile from './pages/EditProfile'; 
import Cart from './pages/Cart';
import { UploadCourse } from './pages/UploadCourse';

import { PRIMARY_COLOR, HOVER_COLOR } from './data.js';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        {/* Toaster centralizado para notificaciones de éxito/error */}
        <Toaster position="top-center" reverseOrder={false} />
        
        <div className="min-h-screen bg-white">
          <Navbar PRIMARY_COLOR={PRIMARY_COLOR} HOVER_COLOR={HOVER_COLOR} />

          <Routes>
            {/* --- RUTAS PÚBLICAS --- */}
            <Route path="/" element={
              <main>
                <Hero PRIMARY_COLOR={PRIMARY_COLOR} />
                <CourseCarousel PRIMARY_COLOR={PRIMARY_COLOR} />
                <SendaPro PRIMARY_COLOR={PRIMARY_COLOR} />
                <UdemyCarousel PRIMARY_COLOR={PRIMARY_COLOR} />
              </main>
            } />

            <Route path="/login" element={<Login PRIMARY_COLOR={PRIMARY_COLOR} />} />
            <Route path="/register" element={<Register PRIMARY_COLOR={PRIMARY_COLOR} />} />
            <Route path="/verify-email" element={<VerifyEmail PRIMARY_COLOR={PRIMARY_COLOR} />} />
            <Route path="/curso/:id" element={<CourseDetail PRIMARY_COLOR={PRIMARY_COLOR} />} />
            <Route path="/buscar" element={<SearchResultsPage PRIMARY_COLOR={PRIMARY_COLOR} />} />
            <Route path="/senda-pro-info" element={<ComingSoon PRIMARY_COLOR="#F7A823" />} />
            <Route path="/cursos/:categorySlug" element={<CategoryPage PRIMARY_COLOR={PRIMARY_COLOR} />} />
            <Route path="/cart" element={<Cart PRIMARY_COLOR={PRIMARY_COLOR} />} />

            {/* --- RUTAS PRIVADAS (Solo usuarios logueados) --- */}
            <Route path="/mi-aprendizaje" element={
              <PrivateRoute>
                <MyLearning PRIMARY_COLOR={PRIMARY_COLOR} />
              </PrivateRoute>
            } />

            <Route path="/editar-perfil" element={
              <PrivateRoute>
                <EditProfile PRIMARY_COLOR={PRIMARY_COLOR} />
              </PrivateRoute>
            } />

            <Route path="/configuracion" element={
              <PrivateRoute>
                <div className="p-20 text-center text-2xl font-bold">Ajustes de Cuenta</div>
              </PrivateRoute>
            } />

            {/* --- RUTA DE ADMINISTRACIÓN (Blindada por Rol) --- */}
            <Route path="/admin/subir-curso" element={
              <AdminRoute> 
                <UploadCourse PRIMARY_COLOR={PRIMARY_COLOR} /> 
              </AdminRoute>
            }/>

          </Routes>

          <Footer PRIMARY_COLOR={PRIMARY_COLOR} />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;