import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const EditProfile = ({ PRIMARY_COLOR }) => {
    const { user, setUser } = useContext(AuthContext);
    const [name, setName] = useState(user?.name || '');
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(user?.profilePicture);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Vista previa inmediata
        setPreview(URL.createObjectURL(file));
        setUploading(true);

        // CONFIGURACIÓN DE CLOUDINARY
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'bayit_digital_presets'); // Debes crear esto en Cloudinary settings
        formData.append('cloud_name', 'dwyiw7evh');

        try {
            const res = await axios.post(
                'https://api.cloudinary.com/v1_1/dwyiw7evh/image/upload',
                formData
            );
            const imageUrl = res.data.secure_url;
            
            // Enviamos la URL al backend
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.put('http://localhost:5000/api/auth/profile', { profilePicture: imageUrl }, config);
            
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Foto de perfil actualizada');
        } catch (err) {
            toast.error('Error al subir la imagen');
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateName = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.put('http://localhost:5000/api/auth/profile', { name }, config);
            
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Nombre actualizado');
        } catch (err) {
            toast.error('Error al actualizar nombre');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-10 mt-10 bg-white rounded-2xl shadow-lg border border-gray-100">
            <h1 className="text-3xl font-bold mb-8">Configuración de Perfil</h1>
            
            <div className="flex items-center space-x-6 mb-10">
                <div className="relative">
                    <img src={preview} alt="Perfil" className="w-24 h-24 rounded-full object-cover border-4" style={{ borderColor: PRIMARY_COLOR }} />
                    <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md cursor-pointer border border-gray-200">
                        <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </label>
                </div>
                <div>
                    <h3 className="font-bold text-lg">{user?.name}</h3>
                    <p className="text-gray-500">{uploading ? 'Subiendo...' : 'Cambia tu foto de perfil'}</p>
                </div>
            </div>

            <form onSubmit={handleUpdateName} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                    <input 
                        type="text" 
                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 outline-none"
                        style={{ '--tw-ring-color': PRIMARY_COLOR }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <button 
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-white font-bold transition-all active:scale-95"
                    style={{ backgroundColor: PRIMARY_COLOR }}
                >
                    Guardar Cambios
                </button>
            </form>
        </div>
    );
};

export default EditProfile;