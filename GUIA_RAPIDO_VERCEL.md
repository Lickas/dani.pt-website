# 🚀 DEPLOY VERCEL - GUIA RÁPIDO

## ✅ TUDO PRONTO! Pode fazer deploy agora.

---

## 📋 PASSO A PASSO

### 1️⃣ Configurar Vercel

Aceda a https://vercel.com/new

**Configurações:**
```
Framework Preset: Create React App
Root Directory: frontend
Build Command: yarn build
Output Directory: build
Install Command: yarn install
```

### 2️⃣ Variáveis de Ambiente

Adicione estas 2 variáveis na Vercel:

```
REACT_APP_USE_MOCK=true
REACT_APP_BACKEND_URL=http://localhost:8000
```

### 3️⃣ Deploy

Clique em **"Deploy"**

⏱️ Aguarde 2-3 minutos

✅ **PRONTO!** O site está online

---

## 🎯 O QUE ESPERAR

### ✅ Site Funciona 100%
- Layout completo visível
- Todas as páginas carregam
- 8 viaturas de exemplo
- 2 campanhas ativas
- Formulários simulam sucesso

### ⚠️ Limitações (Modo Demo)
- Dados não são salvos (são mock)
- Admin não persiste alterações
- Formulários não enviam emails reais

### 🔄 Para Backend Real
Quando tiver backend em produção:
1. Mudar `REACT_APP_USE_MOCK=false`
2. Atualizar `REACT_APP_BACKEND_URL=https://seu-backend.com`
3. Redesenhar

---

## 🐛 PROBLEMAS COMUNS

### ❌ Build Falha
**Solução:** Verificar se Root Directory = `frontend`

### ❌ Página Branca
**Solução:** Adicionar `REACT_APP_USE_MOCK=true`

### ❌ Erros de API
**Solução:** Normal - está em modo demo

---

## 📞 PRÓXIMOS PASSOS

### Opção 1: Manter Modo Demo
✅ Site funciona para apresentações
✅ Zero custos de backend
⚠️ Dados não persistem

### Opção 2: Adicionar Backend
Recomendado: **Railway** ou **Heroku**

1. Fazer deploy do backend
2. Atualizar variáveis na Vercel
3. Redesenhar

---

## 📚 DOCUMENTAÇÃO COMPLETA

- `RESUMO_ALTERACOES.md` - Lista de todas as correções
- `VERCEL_DEPLOY.md` - Guia detalhado de deploy

---

## ✅ CHECKLIST FINAL

- [ ] Código no GitHub/GitLab
- [ ] Projeto criado na Vercel
- [ ] Root Directory = `frontend`
- [ ] Variáveis de ambiente adicionadas
- [ ] Deploy executado
- [ ] Site testado e funcionando

---

**🎉 BOM DEPLOY!**

**O site está 100% funcional visualmente.**
**Pode mostrar aos clientes/investors imediatamente.**
**Backend pode ser adicionado depois quando necessário.**
