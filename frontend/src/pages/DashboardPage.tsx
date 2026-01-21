import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Settings, Phone, Clock, DollarSign, Plus, List, FileText, Key } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrador';
      case 'TECHNICIAN':
        return 'Técnico';
      case 'CLIENT':
        return 'Cliente';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'TECHNICIAN':
        return 'bg-blue-100 text-blue-800';
      case 'CLIENT':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Sistema de Chamados</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user?.role || '')}`}>
                    {getRoleDisplayName(user?.role || '')}
                  </span>
                </div>
                <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bem-vindo, {user?.name}!
          </h2>
          <p className="text-gray-600">
            {user?.role === 'ADMIN' && 'Gerencie técnicos, serviços e visualize todos os chamados.'}
            {user?.role === 'TECHNICIAN' && 'Visualize seus chamados atribuídos e atualize o status.'}
            {user?.role === 'CLIENT' && 'Crie novos chamados e acompanhe o andamento.'}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Phone className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Chamados</p>
                <p className="text-2xl font-semibold text-gray-900">24</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                <p className="text-2xl font-semibold text-gray-900">8</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-semibold text-gray-900">R$ 3.240</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Settings className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Serviços Ativos</p>
                <p className="text-2xl font-semibold text-gray-900">9</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Calls */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chamados Recentes</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Problema com impressora</p>
                  <p className="text-sm text-gray-600">Cliente: João Silva</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Em Atendimento
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Computador lento</p>
                  <p className="text-sm text-gray-600">Cliente: Maria Santos</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Encerrado
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Instalação de software</p>
                  <p className="text-sm text-gray-600">Cliente: Pedro Costa</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Aberto
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="space-y-3">
              {user?.role === 'CLIENT' && (
                <button className="w-full btn btn-primary text-left">
                  Criar Novo Chamado
                </button>
              )}
              {user?.role === 'TECHNICIAN' && (
                <button className="w-full btn btn-primary text-left">
                  Meus Chamados
                </button>
              )}
              {user?.role === 'ADMIN' && (
                <>
                  <button className="w-full btn btn-primary text-left">
                    Gerenciar Técnicos
                  </button>
                  <button className="w-full btn btn-secondary text-left">
                    Gerenciar Serviços
                  </button>
                  <button className="w-full btn btn-secondary text-left">
                    Todos os Chamados
                  </button>
                </>
              )}
              <button className="w-full btn btn-secondary text-left">
                Meu Perfil
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
