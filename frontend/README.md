# Frontend dANI.PT

Frontend React para o stand automóvel dANI.PT.

## 🛠️ Stack

- React 18
- Tailwind CSS
- shadcn/ui
- React Router DOM
- Axios

## 🚀 Comandos

```bash
# Instalar dependências
yarn install

# Desenvolvimento
yarn start

# Build produção
yarn build
```

## 📁 Estrutura

```
src/
├── pages/           # Páginas da aplicação
│   ├── Home.jsx
│   ├── Vehicles.jsx
│   ├── VehicleDetail.jsx
│   ├── Campaigns.jsx
│   ├── Contact.jsx
│   └── admin/       # Painel admin
├── components/      # Componentes reutilizáveis
│   ├── ui/          # shadcn/ui
│   └── ...
└── utils/           # Utilitários
    ├── apiService.js
    └── mockData.js
```

## ⚙️ Configuração

Criar ficheiro `.env`:

```env
REACT_APP_BACKEND_URL=http://localhost:8001
REACT_APP_SUPABASE_URL=https://xxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGci...
```
