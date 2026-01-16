# dANI.PT - Stand de Automóveis 🚗

Website moderno para stand de automóveis com gestão de viaturas, campanhas e contactos.

---

## 🚀 DEPLOY RÁPIDO NA VERCEL

**Quer fazer deploy agora? Leia:** [`GUIA_RAPIDO_VERCEL.md`](./GUIA_RAPIDO_VERCEL.md)

**✅ Site funciona imediatamente sem backend!**

---

## 📁 Estrutura do Projeto

```
/app/
├── frontend/           # React App (Create React App)
├── backend/           # FastAPI + PostgreSQL (Supabase)
├── GUIA_RAPIDO_VERCEL.md       # 🚀 Deploy na Vercel
├── RESUMO_ALTERACOES.md        # 📝 Lista de correções
├── VERCEL_DEPLOY.md            # 📚 Guia completo
└── TESTES_VERIFICACAO.md       # ✅ Checklist de testes
```

---

## 🛡️ Correções Implementadas

### ✅ Problema Resolvido

- **Antes:** Tela branca na Vercel com `TypeError: e.data.filter is not a function`
- **Depois:** Site funciona 100% mesmo sem backend

### ✅ Soluções

1. **Programação Defensiva** - Validação de arrays antes de `.map()`, `.filter()`, `.slice()`
2. **API Service** - Sistema centralizado com fallback automático
3. **Mock Data** - 8 viaturas + 2 campanhas de exemplo
4. **Variáveis de Ambiente** - Controlo de modo demo vs produção
5. **Demo Banner** - Aviso visual quando em modo demonstração

---

## 🏃 Quick Start

### Frontend (React)

```bash
cd frontend
yarn install
yarn start
```

Abre em `http://localhost:3000`

### Modo Demo (sem backend)

```bash
cd frontend
echo "REACT_APP_USE_MOCK=true" > .env
yarn start
```

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload
```

Abre em `http://localhost:8000`

---

## 🌍 Deploy

### Vercel (Frontend)

**Configuração:**
- Root Directory: `frontend`
- Framework: `Create React App`
- Build Command: `yarn build`
- Output Directory: `build`

**Variáveis de Ambiente:**
```env
REACT_APP_USE_MOCK=true
REACT_APP_BACKEND_URL=http://localhost:8000
```

✅ **Deploy** → Site funciona com dados de demonstração

### Heroku/Railway (Backend)

1. Deploy do backend
2. Atualizar na Vercel:
   ```env
   REACT_APP_USE_MOCK=false
   REACT_APP_BACKEND_URL=https://seu-backend.herokuapp.com
   ```
3. Redesenhar

---

## 📚 Documentação

- [`GUIA_RAPIDO_VERCEL.md`](./GUIA_RAPIDO_VERCEL.md) - Deploy rápido (5 minutos)
- [`RESUMO_ALTERACOES.md`](./RESUMO_ALTERACOES.md) - O que foi alterado
- [`VERCEL_DEPLOY.md`](./VERCEL_DEPLOY.md) - Guia detalhado de deploy
- [`TESTES_VERIFICACAO.md`](./TESTES_VERIFICACAO.md) - Checklist completo

---

## 🛠️ Tech Stack

### Frontend
- React 19
- React Router
- Axios
- Tailwind CSS
- Radix UI
- Lucide Icons
- Sonner (Toast)

### Backend
- FastAPI
- PostgreSQL (Supabase)
- SQLAlchemy
- Alembic
- Supabase Auth
- Supabase Storage

---

## 🎯 Features

### Público
- ✅ Catálogo de viaturas com filtros
- ✅ Detalhes de cada viatura
- ✅ Campanhas promocionais
- ✅ Formulário de contacto
- ✅ Página sobre
- ✅ Dark mode

### Admin
- ✅ Dashboard com estatísticas
- ✅ Gestão de viaturas (CRUD)
- ✅ Gestão de campanhas (CRUD)
- ✅ Visualização de mensagens
- ✅ Upload de imagens
- ✅ Autenticação JWT

---

## 🧪 Testes

```bash
# Frontend
cd frontend
yarn test

# Build
yarn build

# Verificar erros
yarn build 2>&1 | grep -i error
```

---

## 📋 Requisitos

### Desenvolvimento
- Node.js 18+
- Yarn 1.22+
- Python 3.10+
- PostgreSQL (ou Supabase)

### Produção
- Vercel (frontend)
- Heroku/Railway (backend - opcional)
- Supabase (database - opcional)

---

## 🔐 Variáveis de Ambiente

### Frontend (`.env`)

```env
# Backend API
REACT_APP_BACKEND_URL=http://localhost:8000

# Modo Mock (true = dados fake, false = API real)
REACT_APP_USE_MOCK=false

# Web Dev Server
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
```

### Backend (`.env`)

```env
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=xxx
SUPABASE_SERVICE_KEY=xxx

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db
```

---

## 🆘 Troubleshooting

### Problema: Tela branca na Vercel
**Solução:** Adicionar `REACT_APP_USE_MOCK=true`

### Problema: `TypeError: e.data.filter is not a function`
**Solução:** Já corrigido! Sistema valida arrays automaticamente.

### Problema: API não responde
**Solução:** 
1. Verificar `REACT_APP_BACKEND_URL`
2. Verificar CORS no backend
3. Usar modo mock como fallback

### Problema: Build falha
**Solução:**
1. Verificar Root Directory = `frontend`
2. Limpar cache: `rm -rf node_modules build && yarn install`

---

## 🤝 Contribuir

1. Fork o projeto
2. Criar branch (`git checkout -b feature/nova-feature`)
3. Commit (`git commit -m 'Adicionar nova feature'`)
4. Push (`git push origin feature/nova-feature`)
5. Pull Request

---

## 📄 Licença

Este projeto é privado e proprietário.

---

## 📞 Suporte

Para questões técnicas, consulte a documentação:
- `GUIA_RAPIDO_VERCEL.md` - Deploy
- `RESUMO_ALTERACOES.md` - Correções
- `TESTES_VERIFICACAO.md` - Validação

---

## ✅ Status

- ✅ Frontend: Pronto para produção
- ✅ Backend: Funcional (Supabase integrado)
- ✅ Deploy: Configurado para Vercel
- ✅ Documentação: Completa

**Última atualização:** Janeiro 2025

---

**🚀 Pronto para Deploy na Vercel!**

