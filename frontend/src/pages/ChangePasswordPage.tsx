import React, { useState } from 'react';
import { usersAPI } from '../api';
import { Eye, EyeOff, Lock, Check, X, ArrowLeft } from 'lucide-react';

const ChangePasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Senha atual é obrigatória';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Nova senha é obrigatória';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'A senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});
      
      await usersAPI.updateProfile({ password: formData.newPassword } as any);
      
      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setErrors({ general: 'Senha atual incorreta' });
      } else {
        setErrors({ general: 'Erro ao alterar senha. Tente novamente.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const levels = [
      { strength: 0, text: '', color: '' },
      { strength: 1, text: 'Fraca', color: 'bg-red-500' },
      { strength: 2, text: 'Média', color: 'bg-yellow-500' },
      { strength: 3, text: 'Forte', color: 'bg-blue-500' },
      { strength: 4, text: 'Muito Forte', color: 'bg-green-500' },
    ];

    return levels[strength] || levels[1];
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Alterar Senha</h1>
          <p className="mt-2 text-gray-600">
            Mantenha sua conta segura atualizando sua senha regularmente
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <Check className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <p className="text-green-800 font-medium">Senha alterada com sucesso!</p>
              <p className="text-green-600 text-sm">Sua senha foi atualizada.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <X className="h-5 w-5 text-red-600 mr-3" />
            <p className="text-red-800">{errors.general}</p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Senha Atual
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Digite sua senha atual"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.newPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Digite sua nova senha"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
              )}
              
              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Força da senha</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength.strength <= 1 ? 'text-red-600' :
                      passwordStrength.strength === 2 ? 'text-yellow-600' :
                      passwordStrength.strength === 3 ? 'text-blue-600' :
                      'text-green-600'
                    }`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirme sua nova senha"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Requisitos da senha:</h4>
              <ul className="space-y-1 text-xs text-gray-600">
                <li className="flex items-center">
                  <span className={`mr-2 ${
                    formData.newPassword.length >= 6 ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {formData.newPassword.length >= 6 ? '✓' : '○'}
                  </span>
                  Pelo menos 6 caracteres
                </li>
                <li className="flex items-center">
                  <span className={`mr-2 ${
                    /[a-z]/.test(formData.newPassword) && /[A-Z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {/[a-z]/.test(formData.newPassword) && /[A-Z]/.test(formData.newPassword) ? '✓' : '○'}
                  </span>
                  Letras maiúsculas e minúsculas
                </li>
                <li className="flex items-center">
                  <span className={`mr-2 ${
                    /\d/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {/\d/.test(formData.newPassword) ? '✓' : '○'}
                  </span>
                  Pelo menos um número
                </li>
                <li className="flex items-center">
                  <span className={`mr-2 ${
                    /[^a-zA-Z\d]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {/[^a-zA-Z\d]/.test(formData.newPassword) ? '✓' : '○'}
                  </span>
                  Pelo menos um caractere especial
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Alterando...
                  </>
                ) : (
                  'Alterar Senha'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Dicas de segurança:</h4>
          <ul className="space-y-1 text-xs text-blue-800">
            <li>• Use senhas diferentes para cada conta</li>
            <li>• Não compartilhe sua senha com ninguém</li>
            <li>• Altere sua senha regularmente</li>
            <li>• Evite usar informações pessoais óbvias</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
