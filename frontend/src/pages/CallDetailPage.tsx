import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { callsAPI, servicesAPI, type Call, type Service } from '../api';
import { 
  Clock, 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Plus,
  X,
  Edit,
  Check,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

const CallDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [call, setCall] = useState<Call | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [status, setStatus] = useState<'ABERTO' | 'EM_ATENDIMENTO' | 'ENCERRADO'>('ABERTO');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCallData();
    }
  }, [id]);

  const loadCallData = async () => {
    try {
      setIsLoading(true);
      const [callData, servicesData] = await Promise.all([
        callsAPI.get(id!),
        servicesAPI.list(true)
      ]);

      setCall(callData);
      setServices(servicesData);
      setStatus(callData.status);
      setSelectedServices(callData.services.map(cs => cs.serviceId));
    } catch (error) {
      console.error('Error loading call data:', error);
      setError('Erro ao carregar dados do chamado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: typeof status) => {
    if (!call) return;

    try {
      const updatedCall = await callsAPI.update(call.id, { status: newStatus });
      setCall(updatedCall);
      setStatus(newStatus);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating call status:', error);
      setError('Erro ao atualizar status do chamado');
    }
  };

  const handleAddServices = async () => {
    if (!call || selectedServices.length === 0) return;

    try {
      const updatedCall = await callsAPI.update(call.id, { 
        serviceIds: [...call.services.map(cs => cs.serviceId), ...selectedServices]
      });
      setCall(updatedCall);
      setSelectedServices([]);
      setIsAddingService(false);
    } catch (error) {
      console.error('Error adding services:', error);
      setError('Erro ao adicionar serviços');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ABERTO': return 'bg-yellow-100 text-yellow-800';
      case 'EM_ATENDIMENTO': return 'bg-blue-100 text-blue-800';
      case 'ENCERRADO': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ABERTO': return 'Aberto';
      case 'EM_ATENDIMENTO': return 'Em Atendimento';
      case 'ENCERRADO': return 'Encerrado';
      default: return status;
    }
  };

  const canEditStatus = () => {
    if (!user || !call) return false;
    return user.role === 'ADMIN' || (user.role === 'TECHNICIAN' && call.technicianId === user.id);
  };

  const canAddServices = () => {
    if (!user || !call) return false;
    return user.role === 'TECHNICIAN' && call.technicianId === user.id && call.status !== 'ENCERRADO';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !call) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-900">{error || 'Chamado não encontrado'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{call.title}</h1>
              <p className="mt-2 text-gray-600">ID do Chamado: {call.id}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(call.status)}`}>
                {getStatusText(call.status)}
              </span>
              {canEditStatus() && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {isEditing ? <X className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Call Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações do Chamado</h2>
              
              <div className="space-y-4">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Descrição</h3>
                  <p className="text-gray-900">
                    {call.description || 'Nenhuma descrição fornecida'}
                  </p>
                </div>

                {/* Status Edit */}
                {isEditing && canEditStatus() && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                    <div className="flex space-x-2">
                      {(['ABERTO', 'EM_ATENDIMENTO', 'ENCERRADO'] as const).map((statusOption) => (
                        <button
                          key={statusOption}
                          onClick={() => handleStatusChange(statusOption)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            status === statusOption
                              ? getStatusColor(statusOption)
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {getStatusText(statusOption)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Data de Criação</h3>
                    <div className="flex items-center text-gray-900">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {new Date(call.createdAt).toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Última Atualização</h3>
                    <div className="flex items-center text-gray-900">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      {new Date(call.updatedAt).toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Serviços</h2>
                {canAddServices() && (
                  <button
                    onClick={() => setIsAddingService(!isAddingService)}
                    className="flex items-center px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Serviço
                  </button>
                )}
              </div>

              {/* Add Service Form */}
              {isAddingService && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Adicionar Serviços Adicionais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                    {services
                      .filter(service => !call.services.some(cs => cs.serviceId === service.id))
                      .map((service) => (
                        <label key={service.id} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedServices([...selectedServices, service.id]);
                              } else {
                                setSelectedServices(selectedServices.filter(id => id !== service.id));
                              }
                            }}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-900">{service.name}</span>
                            <span className="text-xs text-gray-500 ml-2">R$ {service.price.toFixed(2)}</span>
                          </div>
                        </label>
                      ))}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setIsAddingService(false);
                        setSelectedServices([]);
                      }}
                      className="px-3 py-1 text-gray-600 hover:text-gray-900 text-sm"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleAddServices}
                      disabled={selectedServices.length === 0}
                      className="px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar ({selectedServices.length})
                    </button>
                  </div>
                </div>
              )}

              {/* Services List */}
              <div className="space-y-3">
                {call.services.map((callService) => (
                  <div key={callService.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{callService.service.name}</h4>
                      {callService.service.description && (
                        <p className="text-sm text-gray-600">{callService.service.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">R$ {callService.price.toFixed(2)}</p>
                      {callService.quantity > 1 && (
                        <p className="text-xs text-gray-500">Qtd: {callService.quantity}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-primary-600">R$ {call.totalValue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Cliente</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <UserIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{call.client.name}</p>
                    <p className="text-sm text-gray-600">Cliente</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {call.client.email}
                </div>
              </div>
            </div>

            {/* Technician Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Técnico Responsável</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <UserIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{call.technician.name}</p>
                    <p className="text-sm text-gray-600">Técnico</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {call.technician.email}
                </div>
                {call.technician.availability && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Disponibilidade:</p>
                    <div className="flex flex-wrap gap-1">
                      {call.technician.availability.slice(0, 4).map((time, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {time}
                        </span>
                      ))}
                      {call.technician.availability.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{call.technician.availability.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            {canEditStatus() && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
                <div className="space-y-2">
                  {call.status === 'ABERTO' && (
                    <button
                      onClick={() => handleStatusChange('EM_ATENDIMENTO')}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Iniciar Atendimento
                    </button>
                  )}
                  {call.status === 'EM_ATENDIMENTO' && (
                    <button
                      onClick={() => handleStatusChange('ENCERRADO')}
                      className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Encerrar Chamado
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallDetailPage;
