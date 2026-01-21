# Sistema de Gerenciamento de Chamados - Backend

API RESTful para gerenciamento de chamados com três papéis: Administrador, Técnico e Cliente.

## 🚀 Tecnologias

- Node.js com TypeScript
- Express.js
- PostgreSQL com Prisma ORM
- JWT para autenticação
- Zod para validação
- Jest para testes
- Docker

## 📋 Funcionalidades

### Autenticação
- Login e registro de usuários
- Tokens JWT
- Middleware de autenticação

### Usuários
- **Administrador**: Gerencia técnicos, clientes e serviços
- **Técnico**: Visualiza chamados atribuídos, atualiza status
- **Cliente**: Cria chamados, acompanha andamento

### Chamados
- Criação, listagem, atualização e exclusão
- Status: Aberto, Em Atendimento, Encerrado
- Múltiplos serviços por chamado

### Serviços
- Gerenciamento pelo administrador
- Soft delete para serviços desativados

## 🛠️ Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- Docker (opcional)

### 1. Clone o repositório
```bash
git clone <repository-url>
cd backend
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/call_management_db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=3333
NODE_ENV=development
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

### 4. Configure o banco de dados
```bash
# Gere o Prisma Client
npm run db:generate

# Execute as migrações
npm run db:migrate

# (Opcional) Popule com dados iniciais
npm run db:seed
```

## 🏃‍♂️ Executando

### Modo desenvolvimento
```bash
npm run dev
```

### Modo produção
```bash
npm run build
npm start
```

## 📊 Dados Iniciais

O seed cria os seguintes usuários de teste:

- **Admin**: `admin@callmanagement.com` / `admin123`
- **Técnico 1**: `tech1@callmanagement.com` / `tech123` (08:00-12:00, 14:00-18:00)
- **Técnico 2**: `tech2@callmanagement.com` / `tech123` (10:00-14:00, 16:00-20:00)
- **Técnico 3**: `tech3@callmanagement.com` / `tech123` (12:00-16:00, 18:00-22:00)
- **Cliente**: `client@callmanagement.com` / `client123`

E 9 serviços pré-configurados.

## 🧪 Testes

### Execute todos os testes
```bash
npm test
```

### Execute em modo watch
```bash
npm run test:watch
```

## 📚 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro

### Usuários
- `GET /api/users/profile` - Perfil do usuário logado
- `PUT /api/users/profile` - Atualizar perfil
- `GET /api/users/technicians` - Listar técnicos (Admin)
- `POST /api/users/technicians` - Criar técnico (Admin)
- `PUT /api/users/technicians/:id` - Atualizar técnico (Admin)
- `GET /api/users/clients` - Listar clientes (Admin)
- `PUT /api/users/clients/:id` - Atualizar cliente (Admin)
- `DELETE /api/users/clients/:id` - Excluir cliente (Admin)

### Serviços
- `GET /api/services` - Listar serviços
- `GET /api/services/:id` - Obter serviço
- `POST /api/services` - Criar serviço (Admin)
- `PUT /api/services/:id` - Atualizar serviço (Admin)
- `PATCH /api/services/:id/deactivate` - Desativar serviço (Admin)

### Chamados
- `GET /api/calls` - Listar chamados (filtrado por papel)
- `GET /api/calls/:id` - Obter chamado
- `POST /api/calls` - Criar chamado (Cliente)
- `PUT /api/calls/:id` - Atualizar chamado (Técnico/Admin)
- `DELETE /api/calls/:id` - Excluir chamado (Admin/Cliente)

## 🐳 Docker

### Build da imagem
```bash
docker build -t call-management-backend .
```

### Execute com Docker
```bash
docker run -p 3333:3333 --env-file .env call-management-backend
```

## 📝 Estrutura do Projeto

```
src/
├── controllers/     # Controladores da API
├── middleware/      # Middlewares (autenticação, validação)
├── routes/         # Definição de rotas
├── services/       # Lógica de negócio
├── utils/          # Utilitários (database, jwt)
├── types/          # Tipos TypeScript
└── prisma/         # Schema e seeds do Prisma
```

## 🚀 Deploy

### Render
1. Conecte seu repositório ao Render
2. Configure as variáveis de ambiente
3. Faça o deploy automático

### Variáveis de ambiente necessárias:
- `DATABASE_URL`
- `JWT_SECRET`
- `NODE_ENV=production`

## 📄 Licença

MIT License
