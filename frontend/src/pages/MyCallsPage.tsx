import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { callsAPI, type Call } from '../api';
import { 
  Phone, 
  Calendar, 
  Clock, 
  User as UserIcon,
  DollarSign,
  Filter,
  Search,
  Plus,
  Eye,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

const MyCallsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [calls, setCalls] = useState<Call[]>([]);
  const [filteredCalls, setFilteredCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCalls();
  }, []);

  useEffect(() => {
    filterCalls();
  }, [calls, searchTerm, statusFilter]);

  const loadCalls = async () => {
    try {
      setIsLoading(true);
      const callsData = await callsAPI.list();
      setCalls(callsData);
    } catch (error) {
      console.error('Error loading calls:', error);
      setError('Erro ao carregar chamados');
    } finally {
      setIsLoading(false);
    }
  };

  const filterCalls = () => {
    let filtered = calls;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(call =>
        call.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(call => call.status === statusFilter);
    }

    setFilteredCalls(filtered);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ABERTO': return <Clock className="h-4 w-4" />;
      case 'EM_ATENDIMENTO': return <Clock className="h-4 w-4" />;
      case 'ENCERRADO': return <Eye className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const canCreateCall = () => {
    return user?.role === 'CLIENT';
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </button>
            
            {canCreateCall() && (
              <button
                onClick={() => navigate('/create-call')}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Chamado
              </button>
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user?.role === 'CLIENT' ? 'Meus Chamados' : 'Chamados'}
            </h1>
            <p className="mt-2 text-gray-600">
              {user?.role === 'CLIENT' 
                ? 'Acompanhe o andamento dos seus chamados'
                : 'Visualize os chamados atribuídos a você'
              }
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar chamados..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
                >
                  <option value="all">Todos os status</option>
                  <option value="ABERTO">Aberto</option>
                  <option value="EM_ATENDIMENTO">Em Atendimento</option>
                  <option value="ENCERRADO">Encerrado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredCalls.length} chamado{filteredCalls.length !== 1 ? 's' : ''} encontrado{filteredCalls.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Calls List */}
        {filteredCalls.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' 
                ? 'Nenhum chamado encontrado' 
                : user?.role === 'CLIENT'
                  ? 'Você ainda não possui chamados'
                  : 'Nenhum chamado atribuído'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {user?.role === 'CLIENT' && !searchTerm && statusFilter === 'all'
                ? 'Crie seu primeiro chamado para solicitar um atendimento'
                : 'Tente ajustar os filtros ou buscar por outros termos'
              }
            </p>
            {user?.role === 'CLIENT' && !searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => navigate('/create-call')}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Chamado
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCalls.map((call) => (
              <div
                key={call.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/calls/${call.id}`)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{call.title}</h3>
                    {call.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{call.description}</p>
                    )}
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(call.status)}`}>
                    {getStatusIcon(call.status)}
                    <span className="ml-1">{getStatusText(call.status)}</span>
                  </span>
                </div>

                {/* Services Preview */}
                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {call.services.length} serviço{call.services.length !== 1 ? 's' : ''}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {call.services.slice(0, 2).map((callService) => (
                      <span
                        key={callService.id}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {callService.service.name}
                      </span>
                    ))}
                    {call.services.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{call.services.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* People Involved */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm">
                    <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-gray-600 text-xs">Cliente</p>
                      <p className="font-medium text-gray-900">{call.client.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <UserIcon className="h-4 w-4 text-blue-500 mr-2" />
                    <div>
                      <p className="text-gray-600 text-xs">Técnico</p>
                      <p className="font-medium text-gray-900">{call.technician.name}</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(call.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-lg font-bold text-primary-600">R$ {call.totalValue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCallsPage;
