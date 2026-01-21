# Sistema de Gerenciamento de Chamados - Frontend

Aplicação web responsiva para gerenciamento de chamados, construída com React, TypeScript e TailwindCSS.

## 🚀 Tecnologias

- React 18 com TypeScript
- Vite
- TailwindCSS
- React Router
- Axios
- Lucide React (ícones)
- Mobile First Design

## 📋 Funcionalidades

### Autenticação
- Login e registro de usuários
- Proteção de rotas
- Gerenciamento de sessão

### Dashboard
- Visualização adaptativa por papel (Admin, Técnico, Cliente)
- Estatísticas em tempo real
- Chamados recentes
- Ações rápidas

### Interface Responsiva
- Design Mobile First
- Layout adaptável para desktop
- Componentes reutilizáveis

## 🛠️ Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### 1. Clone o repositório
```bash
git clone <repository-url>
cd frontend
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
VITE_API_URL=http://localhost:3333/api
```

## 🏃‍♂️ Executando

### Modo desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Build para produção
```bash
npm run build
```

### Preview do build
```bash
npm run preview
```

## 📱 Acesso à Aplicação

### Usuários de Teste
Use os seguintes credenciais para testar diferentes papéis:

#### Administrador
- **Email**: admin@callmanagement.com
- **Senha**: admin123
- **Permissões**: Gerencia técnicos, serviços e todos os chamados

#### Técnico
- **Email**: tech1@callmanagement.com
- **Senha**: tech123
- **Permissões**: Visualiza chamados atribuídos, atualiza status

#### Cliente
- **Email**: client@callmanagement.com
- **Senha**: client123
- **Permissões**: Cria chamados, acompanha andamento

## 🎨 Design System

### Cores
- **Primary**: Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Componentes
- **Buttons**: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`
- **Inputs**: `.input`
- **Cards**: `.card`

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 📁 Estrutura do Projeto

```
src/
├── api/            # Configuração da API e tipos
├── components/     # Componentes reutilizáveis
├── contexts/       # Contextos React (Auth)
├── pages/          # Páginas da aplicação
├── hooks/          # Hooks personalizados
└── utils/          # Utilitários
```

## 🔧 Configuração

### API Configuration
A configuração da API está em `src/api/index.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';
```

### TailwindCSS
Configuração em `tailwind.config.js` com cores personalizadas e plugins.

## 🚀 Deploy

### Vercel
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Netlify
1. Faça o build: `npm run build`
2. Faça upload da pasta `dist`
3. Configure redirects para SPA

### Variáveis de ambiente necessárias:
- `VITE_API_URL` (URL da API backend)

## 🧪 Testes

### Execute os testes
```bash
npm test
```

### Testes E2E (Cypress)
```bash
npm run test:e2e
```

## 📱 Funcionalidades por Papel

### Administrador
- Dashboard com estatísticas gerais
- Gerenciamento de técnicos
- Gerenciamento de serviços
- Visualização de todos os chamados
- Edição de status de chamados

### Técnico
- Dashboard com chamados atribuídos
- Atualização de status dos chamados
- Adição de serviços aos chamados
- Edição do próprio perfil

### Cliente
- Dashboard com chamados criados
- Criação de novos chamados
- Seleção de técnicos disponíveis
- Acompanhamento do andamento

## 🎯 Features Implementadas

### ✅ Autenticação
- [x] Login com JWT
- [x] Registro de usuários
- [x] Proteção de rotas
- [x] Logout automático

### ✅ Dashboard
- [x] Interface responsiva
- [x] Cards de estatísticas
- [x] Lista de chamados recentes
- [x] Ações rápidas

### ✅ Design
- [x] Mobile First
- [x] TailwindCSS
- [x] Componentes reutilizáveis
- [x] Estados de loading

## 🔄 Fluxo de Navegação

1. **Login/Register** → Autenticação
2. **Dashboard** → Página principal baseada no papel
3. **Navegação** → Menu lateral/header com opções específicas
4. **Logout** → Retorna para página de login

## 📄 Licença

MIT License
