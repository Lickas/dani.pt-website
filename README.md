# 🚗 dANI.PT - Stand Automóvel

Sistema completo de gestão para stand - **Arquitetura 100% Serverless (Frontend + Supabase)**.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnologia |
|------------|------------|
| **Frontend** | React 18 + Tailwind CSS + shadcn/ui |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (JWT) |
| **Storage** | Supabase Storage (imagens) |
| **Hosting** | Vercel (Static) |

---

## 📁 Estrutura do Projeto

```
/
├── src/                        # React Frontend
│   ├── pages/                  # Páginas
│   ├── components/             # Componentes
│   ├── utils/                  # Utilitários (apiService)
│   └── supabaseClient.js       # Cliente Supabase
│
├── public/                     # Assets estáticos
├── .env                        # Variáveis de ambiente
├── vercel.json                 # Configuração Vercel
└── package.json                # Dependências Node.js
```

---

## 🚀 Deploy na Vercel

### 1. Conectar Repositório
- Vai a [vercel.com](https://vercel.com)
- Importa o repositório

### 2. Configurar Variáveis de Ambiente
Na Vercel Dashboard > Settings > Environment Variables, adiciona:

| Variável | Valor | Obrigatório |
|----------|-------|
| `REACT_APP_SUPABASE_URL` | `https://xxx.supabase.co` | ✅ |
| `REACT_APP_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | ✅ |

### 3. Deploy
Clica em **Deploy** - demora ~2 minutos

---

## 🗄️ Base de Dados (Supabase)

### Tabelas
- `vehicles` - Viaturas do stand
- `campaigns` - Campanhas promocionais
- `contacts` - Mensagens de contacto
- `newsletter_subscribers` - Subscritores newsletter
- `business_info` - Informações do negócio

### Storage Buckets
- `vehicle-images` - Imagens das viaturas
- `campaign-images` - Imagens das campanhas

---

## 🔐 Autenticação Admin

O painel admin usa **Supabase Auth**. Para criar um utilizador admin:

1. Vai ao Supabase Dashboard > Authentication > Users
2. Clica em "Add User"
3. Preenche email e password
4. O utilizador pode fazer login em `/admin`

---

## 💻 Desenvolvimento Local

### Instalar dependências
```bash
yarn install
```

### Configurar ambiente
Cria um ficheiro `.env` na raiz:
```
REACT_APP_SUPABASE_URL=https://xxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### Executar
```bash
yarn start
```

---

## 🎨 Funcionalidades

### Website Público
- Homepage com viaturas em destaque
- Catálogo com filtros
- Detalhes de viatura
- Campanhas promocionais
- Formulário de contacto
- Newsletter
- Modo escuro/claro

### Painel Admin
- Login com Supabase Auth
- Gestão de viaturas (CRUD)
- Gestão de campanhas (CRUD)
- Visualização de mensagens
- Gestão de newsletter
- Upload de imagens para Supabase Storage

---

## 📝 SQL para Criar Tabelas no Supabase

Ver ficheiro `SUPABASE_SETUP.sql` para scripts de criação de tabelas e dados de teste.

---

## 📄 Licença

Projeto privado - dANI.PT © 2025
