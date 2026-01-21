import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI, uploadAPI } from '../api';
import { Camera, Save, X, Mail, Phone, Calendar, MapPin } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    birthDate: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      try {
        setIsLoading(true);
        const response = await uploadAPI.uploadAvatar(file);
        updateUser(response.user);
        setPreviewImage(null);
      } catch (error) {
        console.error('Error uploading avatar:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const updatedUser = await usersAPI.updateProfile(formData);
      updateUser(updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setIsLoading(true);
      const response = await uploadAPI.deleteAvatar();
      updateUser(response.user);
      setPreviewImage(null);
    } catch (error) {
      console.error('Error removing avatar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="mt-2 text-gray-600">Gerencie suas informações pessoais</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card - Left Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden">
                    {previewImage ? (
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : user?.avatar ? (
                      <img src={`http://localhost:3333${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-semibold text-gray-600">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Camera Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <h2 className="mt-4 text-xl font-semibold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                  user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                  user?.role === 'TECHNICIAN' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user?.role === 'ADMIN' ? 'Administrador' :
                   user?.role === 'TECHNICIAN' ? 'Técnico' : 'Cliente'}
                </span>

                {/* Avatar Actions */}
                {previewImage && (
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={handleImageUpload}
                      disabled={isLoading}
                      className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                      onClick={() => setPreviewImage(null)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {user?.avatar && !previewImage && (
                  <button
                    onClick={handleRemoveAvatar}
                    disabled={isLoading}
                    className="mt-4 text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    Remover avatar
                  </button>
                )}
              </div>

              {/* Quick Info */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Membro desde {new Date(user?.createdAt || '').toLocaleDateString('pt-BR')}
                </div>
                {user?.role === 'TECHNICIAN' && user.availability && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Disponibilidade:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {user.availability.slice(0, 4).map((time, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {time}
                        </span>
                      ))}
                      {user.availability.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{user.availability.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form - Right Side */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Informações Pessoais</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(00) 00000-0000"
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Birth Date */}
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Nascimento
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Rua, número, bairro, cidade - UF"
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
