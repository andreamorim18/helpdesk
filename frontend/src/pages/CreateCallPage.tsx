import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { callsAPI, servicesAPI, usersAPI, type Service, type User } from '../api';
import { 
  Save, 
  ArrowLeft,
  User as UserIcon,
  Clock,
  DollarSign,
  AlertCircle,
  Check
} from 'lucide-react';

const CreateCallPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [errors, setErrors] = useState<{
    title?: string;
    technicianId?: string;
    serviceIds?: string;
    general?: string;
  }>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user?.role !== 'CLIENT') {
      navigate('/dashboard');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      const [servicesData, techniciansData] = await Promise.all([
        servicesAPI.list(true),
        usersAPI.listTechnicians()
      ]);

      setServices(servicesData);
      setTechnicians(techniciansData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!selectedTechnician) {
      newErrors.technicianId = 'Selecione um técnico';
    }

    if (selectedServices.length === 0) {
      newErrors.serviceIds = 'Selecione pelo menos um serviço';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    return services
      .filter(service => selectedServices.includes(service.id))
      .reduce((total, service) => total + service.price, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});
      
      const callData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        technicianId: selectedTechnician,
        serviceIds: selectedServices,
      };

      const newCall = await callsAPI.create(callData);
      
      setSuccess(true);
      
      // Redirect to call detail after 2 seconds
      setTimeout(() => {
        navigate(`/calls/${newCall.id}`);
      }, 2000);
    } catch (error: any) {
      if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error });
      } else {
        setErrors({ general: 'Erro ao criar chamado. Tente novamente.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getTechnicianAvailability = (technician: User) => {
    if (!technician.availability || technician.availability.length === 0) {
      return 'Não definido';
    }

    const times = technician.availability.slice(0, 3);
    if (technician.availability.length > 3) {
      return `${times.join(', ')}...`;
    }
    return times.join(', ');
  };

  if (!user || user.role !== 'CLIENT') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Criar Novo Chamado</h1>
          <p className="mt-2 text-gray-600">
            Preencha as informações abaixo para solicitar um atendimento
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <Check className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <p className="text-green-800 font-medium">Chamado criado com sucesso!</p>
              <p className="text-green-600 text-sm">Redirecionando para o detalhe...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
            <p className="text-red-800">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Informações Básicas</h2>
            
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Título do Chamado *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Descreva brevemente o problema"
                  maxLength={100}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.title.length}/100 caracteres
                </p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição Detalhada
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Forneça mais detalhes sobre o problema (opcional)"
                  maxLength={500}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.description.length}/500 caracteres
                </p>
              </div>
            </div>
          </div>

          {/* Technician Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Selecionar Técnico *</h2>
            
            {errors.technicianId && (
              <p className="mb-4 text-sm text-red-600">{errors.technicianId}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {technicians.map((technician) => (
                <label
                  key={technician.id}
                  className={`relative p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedTechnician === technician.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="technician"
                    value={technician.id}
                    checked={selectedTechnician === technician.id}
                    onChange={(e) => setSelectedTechnician(e.target.value)}
                    className="sr-only"
                  />
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <UserIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">{technician.name}</h3>
                        {selectedTechnician === technician.id && (
                          <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600">{technician.email}</p>
                      
                      {technician.availability && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-gray-700 mb-1">Disponibilidade:</p>
                          <div className="flex items-center text-xs text-gray-600">
                            <Clock className="h-3 w-3 mr-1" />
                            {getTechnicianAvailability(technician)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Services Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Selecionar Serviços *</h2>
            
            {errors.serviceIds && (
              <p className="mb-4 text-sm text-red-600">{errors.serviceIds}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <label
                  key={service.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedServices.includes(service.id)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.id)}
                      onChange={() => handleServiceToggle(service.id)}
                      className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-3"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">{service.name}</h3>
                        <span className="font-semibold text-primary-600">
                          R$ {service.price.toFixed(2)}
                        </span>
                      </div>
                      
                      {service.description && (
                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Total */}
            {selectedServices.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="text-lg font-semibold text-gray-900">
                      Valor Total ({selectedServices.length} serviço{selectedServices.length > 1 ? 's' : ''}):
                    </span>
                  </div>
                  <span className="text-xl font-bold text-primary-600">
                    R$ {calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || selectedServices.length === 0 || !selectedTechnician}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Criando Chamado...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Criar Chamado
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCallPage;
