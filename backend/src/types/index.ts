export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'TECHNICIAN' | 'CLIENT';
  availability?: string[];
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  availability?: string[];
  avatar?: string;
}

export interface CreateServiceDto {
  name: string;
  description?: string;
  price: number;
}

export interface UpdateServiceDto {
  name?: string;
  description?: string;
  price?: number;
  isActive?: boolean;
}

export interface CreateCallDto {
  title: string;
  description?: string;
  technicianId: string;
  serviceIds: string[];
}

export interface UpdateCallDto {
  title?: string;
  description?: string;
  status?: 'ABERTO' | 'EM_ATENDIMENTO' | 'ENCERRADO';
  serviceIds?: string[];
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  token: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
