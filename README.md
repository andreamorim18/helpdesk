# 🛠️ Sistema de Gerenciamento de Chamados

Sistema completo de gerenciamento de chamados com três papéis: Administrador, Técnico e Cliente.

## 📁 Estrutura do Projeto

```
call-management-system/
├── backend/          # API Node.js + TypeScript + Express.js
└── frontend/         # Aplicação React + TypeScript + Vite
```

## 🚀 Tecnologias Utilizadas

### Backend
- Node.js com TypeScript
- Express.js
- PostgreSQL com Prisma ORM
- JWT para autenticação
- Zod para validação
- Jest para testes

### Frontend
- React 18 com TypeScript
- Vite
- TailwindCSS
- React Router
- Axios
- Lucide React (ícones)
- Mobile First Design

## 🔐 Usuários de Teste

### Administrador
- **Email**: admin@callmanagement.com
- **Senha**: admin123
- **Permissões**: Gerencia técnicos, serviços e todos os chamados

### Técnicos
- **Técnico 1**: tech1@callmanagement.com / tech123 (08:00-12:00, 14:00-18:00)
- **Técnico 2**: tech2@callmanagement.com / tech123 (10:00-14:00, 16:00-20:00)
- **Técnico 3**: tech3@callmanagement.com / tech123 (12:00-16:00, 18:00-22:00)

### Cliente
- **Email**: client@callmanagement.com
- **Senha**: client123
- **Permissões**: Cria chamados, acompanha andamento

## 🏃‍♂️ Como Executar

### Opção 1: Docker Compose (Recomendado)

1. **Clone o repositório**
```bash
git clone <repository-url>
cd call-management-system
```

2. **Inicie os serviços**
```bash
docker-compose up -d
```

3. **Acesse as aplicações**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3333
- **Banco de dados**: localhost:5432

4. **Execute o seed do banco**
```bash
docker-compose exec backend npm run db:seed
```

### Opção 2: Desenvolvimento Local

#### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure DATABASE_URL no .env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

#### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Acesso
- **Backend**: http://localhost:3333
- **Frontend**: http://localhost:5173

## 📋 Funcionalidades Implementadas

### ✅ Backend
- [x] Autenticação JWT completa
- [x] CRUD de usuários (Admin, Técnico, Cliente)
- [x] CRUD de serviços (Admin)
- [x] CRUD de chamados com permissões por papel
- [x] Validação de dados com Zod
- [x] Seed data com usuários e serviços
- [x] Upload de avatar com Multer
- [x] Testes automatizados com Jest
- [x] Docker configuration

### ✅ Frontend
- [x] Login e registro
- [x] Dashboard adaptativo por papel
- [x] Interface responsiva (Mobile First)
- [x] Proteção de rotas
- [x] Context API para gerenciamento de estado

## 🎯 Features por Papel

### Administrador
- Gerenciar contas de técnicos
- Gerenciar serviços (criar, editar, desativar)
- Listar/editar/excluir clientes
- Visualizar todos os chamados
- Editar status dos chamados

### Técnico
- Editar próprio perfil
- Listar chamados atribuídos
- Adicionar serviços aos chamados
- Editar status dos chamados
- Upload de avatar

### Cliente
- Criar/editar/excluir própria conta
- Criar chamados
- Escolher técnico disponível
- Visualizar histórico de chamados
- Upload de avatar

## 🧪 Testes

### Executar testes do backend
```bash
cd backend
npm test
```

### Executar testes com coverage
```bash
cd backend
npm run test -- --coverage
```

## 📊 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/me` - Perfil do usuário

### Usuários
- `GET /api/users/profile` - Perfil próprio
- `PUT /api/users/profile` - Atualizar perfil
- `GET /api/users/technicians` - Listar técnicos (Admin)
- `POST /api/users/technicians` - Criar técnico (Admin)
- `PUT /api/users/technicians/:id` - Atualizar técnico (Admin)
- `GET /api/users/clients` - Listar clientes (Admin)
- `PUT /api/users/clients/:id` - Atualizar cliente (Admin)
- `DELETE /api/users/clients/:id` - Excluir cliente (Admin)

### Serviços
- `GET /api/services` - Listar serviços
- `POST /api/services` - Criar serviço (Admin)
- `PUT /api/services/:id` - Atualizar serviço (Admin)
- `PATCH /api/services/:id/deactivate` - Desativar serviço (Admin)

### Chamados
- `GET /api/calls` - Listar chamados (por papel)
- `POST /api/calls` - Criar chamado (Cliente)
- `GET /api/calls/:id` - Detalhes do chamado
- `PUT /api/calls/:id` - Atualizar chamado (Técnico/Admin)
- `DELETE /api/calls/:id` - Excluir chamado (Cliente/Admin)

### Upload
- `POST /api/upload/avatar` - Upload de avatar
- `DELETE /api/upload/avatar` - Remover avatar

## 🚀 Deploy

### Backend (Render)
1. Conectar repositório ao Render
2. Configurar variáveis de ambiente
3. Deploy automático

### Frontend (Vercel/Netlify)
1. Conectar repositório
2. Configurar variáveis de ambiente
3. Deploy automático

## 📄 Licença

MIT License
