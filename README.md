# 🛠️ Sistema de Gerenciamento de Chamados

Sistema completo de gerenciamento de chamados com três papéis: Administrador, Técnico e Cliente.

## 📁 Estrutura do Projeto

```
call-management-system/
├── backend/          # API Node.js + TypeScript + Express.js
└── frontend/         # Aplicação React + TypeScript + Vite
```

## 🚀 Tecnologias Utilizadas

### 🎨 Backend
<div style="display: flex; align-items: center; gap: 15px; margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 12px; border-left: 4px solid #4f46e5;">

<div style="color: #68217a; font-size: 48px;">
  <i class="devicon-nodejs" style="font-size: 48px;"></i>
</div>

<div>
  <h3 style="color: #68217a; margin: 0 0 10px 0;">Node.js</h3>
  <p style="color: #6c757d; margin: 0;">Runtime JavaScript com TypeScript</p>
  <div style="display: flex; gap: 10px; margin-top: 10px;">
    <span style="color: #007acc;">📦 Express.js</span>
    <span style="color: #007acc;">🗄️ TypeScript</span>
  </div>
</div>

</div>

<div style="display: flex; align-items: center; gap: 15px; margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 12px; border-left: 4px solid #4f46e5;">

<div style="color: #3178c6; font-size: 48px;">
  <i class="devicon-postgresql" style="font-size: 48px;"></i>
</div>

<div>
  <h3 style="color: #3178c6; margin: 0 0 10px 0;">PostgreSQL</h3>
  <p style="color: #6c757d; margin: 0;">Banco de dados relacional</p>
  <div style="display: flex; gap: 10px; margin-top: 10px;">
    <span style="color: #336791;">🔧 Prisma ORM</span>
    <span style="color: #e34c26;">🔐 JWT</span>
  </div>
</div>

</div>

<div style="display: flex; align-items: center; gap: 15px; margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 12px; border-left: 4px solid #4f46e5;">

<div style="color: #cb3837; font-size: 48px;">
  <i class="devicon-jest" style="font-size: 48px;"></i>
</div>

<div>
  <h3 style="color: #cb3837; margin: 0 0 10px 0;">Jest</h3>
  <p style="color: #6c757d; margin: 0;">Framework de testes automatizados</p>
</div>

</div>

### 🎨 Frontend
<div style="display: flex; align-items: center; gap: 15px; margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 12px; border-left: 4px solid #61dafb;">

<div style="color: #61dafb; font-size: 48px;">
  <i class="devicon-react" style="font-size: 48px;"></i>
</div>

<div>
  <h3 style="color: #61dafb; margin: 0 0 10px 0;">React 18</h3>
  <p style="color: #6c757d; margin: 0;">Biblioteca JavaScript para interfaces</p>
  <div style="display: flex; gap: 10px; margin-top: 10px;">
    <span style="color: #61dafb;">⚛️ TypeScript</span>
    <span style="color: #61dafb;">🔄 Vite</span>
  </div>
</div>

</div>

<div style="display: flex; align-items: center; gap: 15px; margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 12px; border-left: 4px solid #38bdf8;">

<div style="color: #38bdf8; font-size: 48px;">
  <i class="devicon-tailwindcss" style="font-size: 48px;"></i>
</div>

<div>
  <h3 style="color: #38bdf8; margin: 0 0 10px 0;">TailwindCSS</h3>
  <p style="color: #6c757d; margin: 0;">Framework CSS utilitário-first</p>
</div>

</div>

<div style="display: flex; align-items: center; gap: 15px; margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 12px; border-left: 4px solid #ff6f00;">

<div style="color: #ff6f00; font-size: 48px;">
  <i class="devicon-reactrouter" style="font-size: 48px;"></i>
</div>

<div>
  <h3 style="color: #ff6f00; margin: 0 0 10px 0;">React Router</h3>
  <p style="color: #6c757d; margin: 0;">Biblioteca de navegação</p>
</div>

</div>

<div style="display: flex; align-items: center; gap: 15px; margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 12px; border-left: 4px solid #0ea5e9;">

<div style="color: #0ea5e9; font-size: 48px;">
  <i class="devicon-axios" style="font-size: 48px;"></i>
</div>

<div>
  <h3 style="color: #0ea5e9; margin: 0 0 10px 0;">Axios</h3>
  <p style="color: #6c757d; margin: 0;">Cliente HTTP para comunicação com API</p>
</div>

</div>

<div style="display: flex; align-items: center; gap: 15px; margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 12px; border-left: 4px solid #4285f4;">

<div style="color: #4285f4; font-size: 48px;">
  <i class="devicon-lucide-react" style="font-size: 48px;"></i>
</div>

<div>
  <h3 style="color: #4285f4; margin: 0 0 10px 0;">Lucide React</h3>
  <p style="color: #6c757d; margin: 0;">Biblioteca de ícones</p>
</div>

</div>

### 🐳 DevOps
<div style="display: flex; align-items: center; gap: 15px; margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 12px; border-left: 4px solid #2496ed;">

<div style="color: #2496ed; font-size: 48px;">
  <i class="devicon-docker" style="font-size: 48px;"></i>
</div>

<div>
  <h3 style="color: #2496ed; margin: 0 0 10px 0;">Docker</h3>
  <p style="color: #6c757d; margin: 0;">Plataforma de contêineres</p>
  <div style="display: flex; gap: 10px; margin-top: 10px;">
    <span style="color: #2496ed;">🐳 Docker Compose</span>
    <span style="color: #2496ed;">🐋 Dockerfile</span>
  </div>
</div>

</div>

<div style="display: flex; align-items: center; gap: 15px; margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 12px; border-left: 4px solid #ff9800;">

<div style="color: #ff9800; font-size: 48px;">
  <i class="devicon-github" style="font-size: 48px;"></i>
</div>

<div>
  <h3 style="color: #ff9800; margin: 0 0 10px 0;">GitHub</h3>
  <p style="color: #6c757d; margin: 0;">Controle de versão e colaboração</p>
  <div style="display: flex; gap: 10px; margin-top: 10px;">
    <span style="color: #ff9800;">🔧 Render</span>
    <span style="color: #ff9800;">🌐 Vercel</span>
    <span style="color: #ff9800;">🔷 Netlify</span>
  </div>
</div>

</div>

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
