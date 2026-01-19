# 🚗 dANI.PT - Stand Automóvel

Sistema completo de gestão para stand - **Estrutura Serverless para Vercel**.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnologia |
|------------|------------|
| **Frontend** | React 18 + Tailwind CSS + shadcn/ui |
| **Backend** | Vercel Serverless Functions (Python) |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (JWT) |
| **Storage** | Supabase Storage (imagens) |

---

## 📁 Estrutura do Projeto

```
/
├── api/                        # Serverless Functions (Python)
│   ├── _shared/                # Código partilhado
│   │   ├── database.py         # Conexão PostgreSQL
│   │   ├── models.py           # Modelos SQLAlchemy
│   │   ├── supabase_client.py  # Cliente Supabase
│   │   └── auth.py             # Verificação JWT
│   ├── admin/
│   │   ├── login.py            # POST /api/admin/login
│   │   └── register.py         # POST /api/admin/register
│   ├── health.py               # GET /api/health
│   ├── vehicles.py             # CRUD /api/vehicles
│   ├── campaigns.py            # CRUD /api/campaigns
│   ├── contacts.py             # CRUD /api/contacts
│   ├── upload.py               # POST /api/upload/*
│   └── newsletter.py           # POST /api/newsletter
│
├── src/                        # React Frontend
│   ├── pages/                  # Páginas
│   ├── components/             # Componentes
│   └── utils/                  # Utilitários
│
├── public/                     # Assets estáticos
├── vercel.json                 # Configuração Vercel
├── package.json                # Dependências Node.js
└── requirements.txt            # Dependências Python
```

---

## 🚀 Deploy na Vercel

### 1. Conectar Repositório
- Vai a [vercel.com](https://vercel.com)
- Importa o repositório

### 2. Configurar Variáveis de Ambiente
Na Vercel Dashboard > Settings > Environment Variables, adiciona:

| Variável | Valor | Obrigatório |
|----------|-------|-------------|
| `SUPABASE_URL` | `https://xxx.supabase.co` | ✅ |
| `SUPABASE_ANON_KEY` | `eyJhbGciOi...` (chave completa) | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` (chave completa) | ✅ |
| `JWT_SECRET` | Qualquer string secreta | ✅ |
| `REACT_APP_SUPABASE_URL` | Mesmo que SUPABASE_URL | ✅ |
| `REACT_APP_SUPABASE_ANON_KEY` | Mesmo que SUPABASE_ANON_KEY | ✅ |

⚠️ **IMPORTANTE:** As chaves do Supabase são muito longas (começam com `eyJhbGciOi...`). Copia-as completas do Supabase Dashboard > Settings > API.

### 3. Deploy
Clica em **Deploy** - demora ~2 minutos

---

## 🌐 API Endpoints

### Públicos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/health` | Health check |
| GET | `/api/vehicles` | Listar viaturas |
| GET | `/api/vehicles/{id}` | Detalhes viatura |
| GET | `/api/campaigns` | Campanhas ativas |
| GET | `/api/campaigns/public/{id}` | Detalhes campanha |
| POST | `/api/contacts` | Enviar mensagem |
| POST | `/api/newsletter` | Subscrever newsletter |
| POST | `/api/newsletter/unsubscribe` | Cancelar subscrição newsletter |
| GET | `/api/newsletter/check/{email}` | Verificar subscrição |

### Admin (requer autenticação)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/admin/login` | Login |
| POST | `/api/admin/register` | Registar admin |
| GET | `/api/vehicles/all` | Todas as viaturas |
| POST | `/api/vehicles` | Criar viatura |
| PUT | `/api/vehicles/{id}` | Atualizar viatura |
| DELETE | `/api/vehicles/{id}` | Apagar viatura |
| GET | `/api/campaigns/all` | Todas as campanhas |
| POST | `/api/campaigns` | Criar campanha |
| PUT | `/api/campaigns/{id}` | Atualizar campanha |
| DELETE | `/api/campaigns/{id}` | Apagar campanha |
| GET | `/api/contacts` | Ver mensagens |
| POST | `/api/upload/vehicle-image` | Upload imagem |
| POST | `/api/upload/campaign-image` | Upload imagem |

---

## 💻 Desenvolvimento Local

### Instalar dependências
```bash
yarn install
pip install -r requirements.txt
```

### Criar ficheiro .env
```bash
cp .env.example .env
# Editar com as credenciais do Supabase
```

### Executar
```bash
# Frontend
yarn start

# Para testar API localmente, usar Vercel CLI:
vercel dev
```

---

## 🗄️ Base de Dados (Supabase)

### Tabelas
- `vehicles` - Viaturas do stand
- `campaigns` - Campanhas promocionais
- `contacts` - Mensagens de contacto
- `admin_users` - Utilizadores admin
- `newsletter_subscribers` - Subscritores newsletter

### Storage Buckets
- `vehicle-images` - Imagens das viaturas
- `campaign-images` - Imagens das campanhas

---

## 🎨 Funcionalidades

### Website Público
- Homepage com viaturas em destaque
- Catálogo com filtros
- Detalhes de viatura
- Campanhas promocionais
- Formulário de contacto
- Modo escuro/claro

### Painel Admin
- Login com Supabase Auth
- Gestão de viaturas (CRUD)
- Gestão de campanhas (CRUD)
- Visualização de mensagens
- Upload de imagens

---

## 📄 Licença

Projeto privado - dANI.PT © 2025
