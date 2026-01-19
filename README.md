# 🚗 dANI.PT - Stand Automóvel

Sistema completo de gestão para stand automóvel com frontend React e backend FastAPI integrado com **Supabase**.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnologia |
|------------|------------|
| **Frontend** | React 18 + Tailwind CSS + shadcn/ui |
| **Backend** | FastAPI (Python 3.11) |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (JWT) |
| **Storage** | Supabase Storage (imagens) |
| **ORM** | SQLAlchemy + Alembic |

---

## 📁 Estrutura do Projeto

```
/app/
├── backend/
│   ├── server.py           # API FastAPI principal
│   ├── database.py         # Conexão Supabase/PostgreSQL
│   ├── models.py           # Modelos SQLAlchemy
│   ├── supabase_client.py  # Clientes Supabase (Auth + Storage)
│   ├── seed_data.py        # Dados de exemplo
│   ├── alembic/            # Migrações de base de dados
│   └── requirements.txt    # Dependências Python
│
├── frontend/
│   ├── src/
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── components/     # Componentes reutilizáveis
│   │   └── utils/          # Utilitários (API service, mock data)
│   ├── public/             # Assets estáticos
│   └── package.json        # Dependências Node.js
│
└── memory/PRD.md           # Product Requirements Document
```

---

## 🚀 Funcionalidades

### 🌐 Website Público
- **Homepage** com viaturas em destaque e campanhas
- **Catálogo de Viaturas** com filtros (marca, preço, combustível, ano)
- **Detalhes de Viatura** com galeria de imagens
- **Campanhas Promocionais** ativas
- **Formulário de Contacto**
- **Marquee de Marcas** animado
- **Modo Escuro/Claro**

### 🔐 Painel Admin
- **Login** com Supabase Auth
- **Gestão de Viaturas** (CRUD completo)
- **Gestão de Campanhas** (CRUD completo)
- **Visualização de Mensagens** de contacto
- **Upload de Imagens** para Supabase Storage

---

## ⚙️ Configuração

### Variáveis de Ambiente - Backend (`backend/.env`)

```env
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_KEY=eyJhbGci...

# Database (Transaction Pooler)
DATABASE_URL=postgresql://postgres.xxx:password@aws-0-eu-central-1.pooler.supabase.com:6543/postgres

# JWT
JWT_SECRET=your-jwt-secret
JWT_ALGORITHM=HS256
```

### Variáveis de Ambiente - Frontend (`frontend/.env`)

```env
REACT_APP_BACKEND_URL=http://localhost:8001
REACT_APP_SUPABASE_URL=https://xxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGci...
```

---

## 🗄️ Base de Dados (Supabase)

### Tabelas

| Tabela | Descrição |
|--------|-----------|
| `vehicles` | Viaturas do stand |
| `campaigns` | Campanhas promocionais |
| `contacts` | Mensagens de contacto |
| `admin_users` | Utilizadores admin |
| `newsletter_subscribers` | Subscritores newsletter |

### Storage Buckets

| Bucket | Descrição |
|--------|-----------|
| `vehicle-images` | Imagens das viaturas |
| `campaign-images` | Imagens das campanhas |

---

## 📡 API Endpoints

### Públicos
```
GET  /api/health              # Health check
GET  /api/vehicles            # Listar viaturas
GET  /api/vehicles/{id}       # Detalhes viatura
GET  /api/campaigns           # Campanhas ativas
GET  /api/campaigns/{id}      # Detalhes campanha
POST /api/contacts            # Enviar mensagem
POST /api/newsletter          # Subscrever newsletter
```

### Admin (requer autenticação)
```
POST   /api/admin/login       # Login
POST   /api/admin/register    # Registar admin
GET    /api/contacts          # Ver mensagens
GET    /api/campaigns/all     # Todas as campanhas
POST   /api/vehicles          # Criar viatura
PUT    /api/vehicles/{id}     # Atualizar viatura
DELETE /api/vehicles/{id}     # Apagar viatura
POST   /api/campaigns         # Criar campanha
PUT    /api/campaigns/{id}    # Atualizar campanha
DELETE /api/campaigns/{id}    # Apagar campanha
POST   /api/upload/vehicle-image    # Upload imagem viatura
POST   /api/upload/campaign-image   # Upload imagem campanha
```

---

## 🎨 Design System

- **Cores:** Vermelho primário `#E60000`, fundo branco/cinza
- **Fontes:** Archivo (headings), Inter (body)
- **Estilo:** Swiss International Style - minimalista e funcional
- **Componentes:** shadcn/ui personalizados

---

## 🧪 Desenvolvimento Local

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8001
```

### Frontend
```bash
cd frontend
yarn install
yarn start
```

---

## 📦 Deploy

### Frontend (Vercel)
1. Root Directory: `frontend`
2. Build Command: `yarn build`
3. Output Directory: `build`
4. Adicionar variáveis de ambiente

### Backend (Railway/Heroku)
1. Root Directory: `backend`
2. Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
3. Adicionar variáveis de ambiente

---

## 📄 Licença

Projeto privado - dANI.PT © 2025
