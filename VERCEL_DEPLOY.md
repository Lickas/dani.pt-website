# Deploy dANI.PT na Vercel 🚀

## 📝 Pré-requisitos

Este guia assume que você quer fazer deploy **APENAS do Frontend** na Vercel (sem backend).

O site funcionará em **modo demonstração** com dados mock quando o backend não estiver disponível.

---

## 🚀 Passo a Passo - Deploy na Vercel

### 1. Preparar o Repositório Git

Certifique-se de que o seu código está num repositório Git (GitHub, GitLab ou Bitbucket).

### 2. Configurar a Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New Project"**
3. Importe o seu repositório Git

### 3. Configurações do Projeto

Na configuração do projeto na Vercel:

**Root Directory:**
```
frontend
```

**Framework Preset:**
```
Create React App
```

**Build Command:**
```bash
yarn build
```

**Output Directory:**
```
build
```

**Install Command:**
```bash
yarn install
```

### 4. Variáveis de Ambiente

Adicione estas variáveis de ambiente na Vercel:

#### Opção A: Modo Mock (Site funciona sem backend)
```
REACT_APP_USE_MOCK=true
REACT_APP_BACKEND_URL=http://localhost:8000
```

#### Opção B: Com Backend Real
Se tiver um backend em produção:
```
REACT_APP_USE_MOCK=false
REACT_APP_BACKEND_URL=https://seu-backend-api.com
```

### 5. Deploy

Clique em **"Deploy"** e aguarde o build.

---

## ✅ Verificação

Após o deploy:

1. Abra a URL da Vercel
2. O site deve carregar normalmente
3. Se `REACT_APP_USE_MOCK=true`:
   - Verá viaturas e campanhas de exemplo
   - Todas as funcionalidades visuais funcionarão
   - Formulários simularão sucesso

---

## 🛠️ Resolução de Problemas

### Problema: Página em branco

**Solução:**
1. Verifique os logs de build na Vercel
2. Certifique-se de que:
   - Root directory = `frontend`
   - Build command = `yarn build`
   - Variáveis de ambiente estão configuradas

### Problema: Erro "Cannot read property 'filter' of undefined"

**Solução:**
Defina a variável de ambiente:
```
REACT_APP_USE_MOCK=true
```

Isto ativará o modo demonstração com dados falsos.

### Problema: API não responde

**Solução:**
1. Verifique se `REACT_APP_BACKEND_URL` está correto
2. Certifique-se de que o backend tem CORS configurado para a URL da Vercel
3. Como fallback, use `REACT_APP_USE_MOCK=true`

---

## 📚 Arquitetura do Sistema de Fallback

O frontend foi desenvolvido com **programação defensiva**:

### Sistema de Fallback Automático

```javascript
// Quando a API falha...
try {
  const data = await axios.get('/api/vehicles');
  setVehicles(data); // Dados reais
} catch (error) {
  setVehicles(mockVehicles); // Dados falsos automaticamente
}
```

### Verificação de Arrays

Todos os componentes verificam se os dados são arrays antes de usar `.map()`, `.filter()`, etc:

```javascript
// PROGRAMAÇÃO DEFENSIVA
const safeVehicles = Array.isArray(data) ? data : [];
setVehicles(safeVehicles);
```

Isto **previne crashes** mesmo quando:
- Backend está offline
- API retorna dados inválidos
- Rede falha
- Timeout

---

## 🔗 Próximos Passos

### Para ter backend em produção:

1. **Opção 1: Heroku**
   - Fazer deploy do backend FastAPI no Heroku
   - Atualizar `REACT_APP_BACKEND_URL` na Vercel

2. **Opção 2: Railway**
   - Deploy do backend no Railway
   - Configurar Supabase para PostgreSQL

3. **Opção 3: DigitalOcean**
   - VPS com Docker
   - Backend + PostgreSQL + Nginx

---

## ❓ Suporte

Se encontrar problemas:

1. Verifique os logs na Vercel (Functions > Logs)
2. Teste localmente primeiro: `cd frontend && yarn start`
3. Certifique-se de que todas as variáveis de ambiente estão corretas

---

## 🌐 URLs Úteis

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Documentação Vercel:** https://vercel.com/docs
- **Suporte Vercel:** https://vercel.com/support

---

**✅ Deploy Frontend-Only = Site 100% Funcional Visualmente**

**🔐 Com Backend = Funcionalidades Completas (Admin, Persistência)**
