import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'TECHNICIAN' | 'CLIENT';
  availability?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  availability?: string[];
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CallService {
  id: string;
  serviceId: string;
  service: Service;
  quantity: number;
  price: number;
}

export interface Call {
  id: string;
  title: string;
  description?: string;
  status: 'ABERTO' | 'EM_ATENDIMENTO' | 'ENCERRADO';
  totalValue: number;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  client: User;
  technicianId: string;
  technician: User;
  services: CallService[];
}

export interface CreateCallData {
  title: string;
  description?: string;
  technicianId: string;
  serviceIds: string[];
}

export interface UpdateCallData {
  title?: string;
  description?: string;
  status?: 'ABERTO' | 'EM_ATENDIMENTO' | 'ENCERRADO';
  serviceIds?: string[];
}

// Auth API
export const authAPI = {
  login: (data: LoginData): Promise<AuthResponse> =>
    api.post('/auth/login', data).then(res => res.data),
  
  register: (data: RegisterData): Promise<AuthResponse> =>
    api.post('/auth/register', data).then(res => res.data),
};

// Users API
export const usersAPI = {
  getProfile: (): Promise<User> =>
    api.get('/users/profile').then(res => res.data),
  
  updateProfile: (data: Partial<User>): Promise<User> =>
    api.put('/users/profile', data).then(res => res.data),
  
  listTechnicians: (): Promise<User[]> =>
    api.get('/users/technicians').then(res => res.data),
  
  createTechnician: (data: RegisterData): Promise<User> =>
    api.post('/users/technicians', data).then(res => res.data),
  
  updateTechnician: (id: string, data: Partial<User>): Promise<User> =>
    api.put(`/users/technicians/${id}`, data).then(res => res.data),
  
  listClients: (): Promise<User[]> =>
    api.get('/users/clients').then(res => res.data),
  
  updateClient: (id: string, data: Partial<User>): Promise<User> =>
    api.put(`/users/clients/${id}`, data).then(res => res.data),
  
  deleteClient: (id: string): Promise<void> =>
    api.delete(`/users/clients/${id}`).then(res => res.data),
};

// Services API
export const servicesAPI = {
  list: (activeOnly?: boolean): Promise<Service[]> =>
    api.get('/services', { params: { activeOnly } }).then(res => res.data),
  
  get: (id: string): Promise<Service> =>
    api.get(`/services/${id}`).then(res => res.data),
  
  create: (data: Omit<Service, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>): Promise<Service> =>
    api.post('/services', data).then(res => res.data),
  
  update: (id: string, data: Partial<Service>): Promise<Service> =>
    api.put(`/services/${id}`, data).then(res => res.data),
  
  deactivate: (id: string): Promise<Service> =>
    api.patch(`/services/${id}/deactivate`).then(res => res.data),
};

// Calls API
export const callsAPI = {
  list: (status?: string): Promise<Call[]> =>
    api.get('/calls', { params: { status } }).then(res => res.data),
  
  get: (id: string): Promise<Call> =>
    api.get(`/calls/${id}`).then(res => res.data),
  
  create: (data: CreateCallData): Promise<Call> =>
    api.post('/calls', data).then(res => res.data),
  
  update: (id: string, data: UpdateCallData): Promise<Call> =>
    api.put(`/calls/${id}`, data).then(res => res.data),
  
  delete: (id: string): Promise<void> =>
    api.delete(`/calls/${id}`).then(res => res.data),
};

// Upload API
export const uploadAPI = {
  uploadAvatar: (file: File): Promise<{ user: User; message: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return api.post('/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data);
  },
  
  deleteAvatar: (): Promise<{ user: User; message: string }> =>
    api.delete('/upload/avatar').then(res => res.data),
};

export default api;
