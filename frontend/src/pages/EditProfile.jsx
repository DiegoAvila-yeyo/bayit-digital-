import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CameraIcon, GlobeAltIcon, UserCircleIcon, IdentificationIcon } from '@heroicons/react/24/outline';

const EditProfile = ({ PRIMARY_COLOR = "#F7A823" }) => {
    const { user, setUser } = useContext(AuthContext);
    
    // Estados del Formulario
    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        specialty: user?.specialty || '',
        website: user?.website || ''
    });
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(user?.profilePicture || '/default-avatar.png');

    // Sincronizar si el usuario tarda en cargar del context
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                bio: user.bio || '',
                specialty: user.specialty || '',
                website: user.website || ''
            });
            setPreview(user.profilePicture);
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));
        setUploading(true);

        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'bayit_digital_presets'); 
        data.append('cloud_name', 'dwyiw7evh');

        try {
            const res = await axios.post('https://api.cloudinary.com/v1_1/dwyiw7evh/image/upload', data);
            const imageUrl = res.data.secure_url;
            
            // Actualizar solo la imagen en el backend
            const { data: updatedUser } = await api.put('/auth/profile', { profilePicture: imageUrl });
            
            // ACTUALIZACIÓN CRÍTICA DEL CONTEXTO
            const newUserState = { ...user, ...updatedUser };
            setUser(newUserState);
            localStorage.setItem('userInfo', JSON.stringify(newUserState));
            toast.success('Imagen actualizada');
        } catch (err) {
            toast.error('Error al subir imagen');
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const { data: updatedUser } = await api.put('/auth/profile', { profilePicture: imageUrl });
            
            // Unimos el token viejo con los datos nuevos
            const newUserState = { ...user, ...updatedUser };
            setUser(newUserState);
            localStorage.setItem('userInfo', JSON.stringify(newUserState));
            toast.success('Perfil actualizado con éxito');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al actualizar');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-12 mt-10 bg-white rounded-[3rem] shadow-2xl border border-gray-50">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12 border-b border-gray-100 pb-10">
                <div className="relative group">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-8 border-gray-50 shadow-inner">
                        <img src={preview} alt="Perfil" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    </div>
                    <label className="absolute bottom-2 right-2 p-3 rounded-full shadow-xl cursor-pointer hover:scale-110 transition-all text-white" style={{ backgroundColor: PRIMARY_COLOR }}>
                        <CameraIcon className="w-6 h-6" />
                        <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                    </label>
                    {uploading && <div className="absolute inset-0 bg-white/60 rounded-full flex items-center justify-center font-black text-xs">SUBIENDO...</div>}
                </div>
                
                <div className="text-center md:text-left">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Mi <span style={{ color: PRIMARY_COLOR }}>Esencia</span></h1>
                    <p className="text-gray-500 font-medium italic">Define cómo quieres que el mundo te perciba.</p>
                </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Nombre */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-2">
                        <UserCircleIcon className="w-4 h-4" /> Nombre Público
                    </label>
                    <input name="name" type="text" value={formData.name} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-orange-200 transition-all" />
                </div>

                {/* Especialidad */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-2">
                        <IdentificationIcon className="w-4 h-4" /> Especialidad / Rol
                    </label>
                    <input name="specialty" placeholder="Ej: Maestro en Teología" type="text" value={formData.specialty} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-orange-200 transition-all" />
                </div>

                {/* Biografía */}
                <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2 block">Tu Biografía / Propósito</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-3xl font-medium outline-none h-32 border-2 border-transparent focus:border-orange-200 transition-all resize-none" placeholder="Cuéntanos sobre tu camino espiritual o profesional..."></textarea>
                </div>

                {/* Link Externo */}
                <div className="md:col-span-2 space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 ml-2">
                        <GlobeAltIcon className="w-4 h-4" /> Sitio Web o Portfolio
                    </label>
                    <input name="website" type="url" placeholder="https://tuweb.com" value={formData.website} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-orange-200 transition-all" />
                </div>

                <button type="submit" className="md:col-span-2 py-6 rounded-[2rem] text-white font-black text-xl shadow-xl transition-all active:scale-95 hover:brightness-110" style={{ backgroundColor: PRIMARY_COLOR }}>
                    ACTUALIZAR IDENTIDAD
                </button>
            </form>
        </div>
    );
};

export default EditProfile;