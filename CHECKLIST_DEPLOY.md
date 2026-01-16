# ✅ CHECKLIST DE DEPLOY - dANI.PT

Use este checklist para garantir que tudo está configurado corretamente antes do deploy.

---

## 📦 ANTES DO DEPLOY

### Código
- [x] ✅ Frontend compila sem erros (`yarn build`)
- [x] ✅ Programação defensiva implementada
- [x] ✅ Mock data criado
- [x] ✅ API service centralizado
- [x] ✅ Variáveis de ambiente configuradas
- [x] ✅ `.env.example` criado

### Git
- [ ] Código commitado
- [ ] Push para GitHub/GitLab/Bitbucket
- [ ] Branch principal definida (main/master)

---

## 🚀 DURANTE O DEPLOY

### Vercel - Configuração do Projeto
- [ ] Novo projeto criado
- [ ] Repositório Git conectado
- [ ] Root Directory: **`frontend`** ⚠️ IMPORTANTE
- [ ] Framework Preset: **`Create React App`**
- [ ] Build Command: **`yarn build`**
- [ ] Output Directory: **`build`**
- [ ] Install Command: **`yarn install`**

### Vercel - Variáveis de Ambiente
- [ ] `REACT_APP_USE_MOCK` = **`true`** (para modo demo)
- [ ] `REACT_APP_BACKEND_URL` = **`http://localhost:8000`** (pode ser qualquer URL)

### Deploy
- [ ] Clicou em "Deploy"
- [ ] Aguardou conclusão (2-3 min)
- [ ] Build passou sem erros

---

## 🧪 APÓS O DEPLOY

### Testes Básicos
- [ ] Site abre (sem tela branca)
- [ ] Página inicial carrega
- [ ] Viaturas aparecem (8 exemplos)
- [ ] Campanhas aparecem (2 exemplos)
- [ ] Banner amarelo de "Modo Demonstração" visível
- [ ] Links funcionam
- [ ] Formulário de contacto aceita submissão
- [ ] Toast de sucesso aparece

### Navegação
- [ ] /viaturas (lista de carros)
- [ ] /viaturas/:id (detalhes)
- [ ] /campanhas (lista de promoções)
- [ ] /campanhas/:id (detalhes)
- [ ] /sobre (página sobre)
- [ ] /contacto (formulário)

### Visual
- [ ] Layout está correto
- [ ] Imagens carregam
- [ ] Cores corretas (vermelho #E60000)
- [ ] Fontes corretas
- [ ] Responsivo (mobile/tablet/desktop)
- [ ] Dark mode funciona

### Performance
- [ ] Carregamento < 3 segundos
- [ ] Sem erros no console do browser
- [ ] Lighthouse score > 80

---

## 🔍 VERIFICAÇÕES TÉCNICAS

### Browser DevTools → Console
```javascript
// Não deve ter erros vermelhos
// Avisos (warnings) são OK
✓ Sem "TypeError"
✓ Sem "Cannot read property 'filter'"
✓ Sem "undefined.map"
```

### Browser DevTools → Network
```
✓ Status: 200 OK (página principal)
✓ Imagens carregam
✓ CSS carrega
✓ JS carrega
```

### Variáveis de Ambiente
```javascript
// No console do browser:
console.log(process.env.REACT_APP_USE_MOCK)
// Deve retornar: "true"

console.log(process.env.REACT_APP_BACKEND_URL)
// Deve retornar: "http://localhost:8000" (ou sua URL)
```

---

## 📱 TESTES EM DISPOSITIVOS

### Desktop
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Mobile
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Tablet

---

## ⚙️ MODO DEMO vs PRODUÇÃO

### Modo Demo (Atual)
```env
REACT_APP_USE_MOCK=true
```
✓ Site funciona sem backend
✓ Dados são exemplos
✓ Formulários simulam sucesso
⚠️ Nada é salvo

### Modo Produção (Futuro)
```env
REACT_APP_USE_MOCK=false
REACT_APP_BACKEND_URL=https://seu-backend.com
```
✓ Site conecta ao backend real
✓ Dados são persistidos
✓ Formulários enviam emails
✓ Admin funciona completamente

---

## 🐛 TROUBLESHOOTING

### ❌ Build Falha
Verificar:
- [ ] Root Directory = `frontend`
- [ ] package.json existe em `/frontend/package.json`
- [ ] Limpar cache na Vercel
- [ ] Redeployar

### ❌ Tela Branca
Verificar:
- [ ] `REACT_APP_USE_MOCK=true` está configurado
- [ ] Logs do Vercel (Functions > Logs)
- [ ] Erros no browser console

### ❌ Imagens Não Carregam
Normal:
- Mock data usa Unsplash
- Pode ter delay inicial
- Verificar conexão internet

### ❌ "Cannot read property"
Já corrigido:
- [x] Programação defensiva implementada
- [x] Validações de array em todos os componentes
- [x] Fallback automático funcionando

---

## 📊 MÉTRICAS DE SUCESSO

### ✅ Build
```
✓ Build time: < 5 min
✓ Bundle size: ~130 KB (gzipped)
✓ 0 Errors
✓ Warnings aceitáveis
```

### ✅ Performance
```
✓ First Contentful Paint: < 1.5s
✓ Time to Interactive: < 3s
✓ Lighthouse Performance: > 80
```

### ✅ Funcionalidade
```
✓ 100% das páginas carregam
✓ 0 crashes
✓ Formulários funcionam
✓ Navegação fluida
```

---

## 🎉 DEPLOY COMPLETO!

Quando todos os checkboxes acima estiverem marcados:

✅ **PARABÉNS!** O site está online e funcional!

### Próximos Passos (Opcional):

1. **Custom Domain**
   - [ ] Configurar domínio dani.pt na Vercel
   - [ ] DNS atualizado
   - [ ] HTTPS ativo

2. **Backend Real**
   - [ ] Deploy backend (Heroku/Railway)
   - [ ] Atualizar variáveis na Vercel
   - [ ] Testar integração

3. **SEO**
   - [ ] Adicionar meta tags
   - [ ] Sitemap.xml
   - [ ] robots.txt
   - [ ] Google Analytics

4. **Monitorização**
   - [ ] Sentry para errors
   - [ ] Google Analytics
   - [ ] Vercel Analytics

---

## 📞 LINKS ÚTEIS

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Docs:** https://vercel.com/docs
- **Suporte:** https://vercel.com/support

---

**✨ Tudo pronto! O site está no ar! ✨**

**🔗 Compartilhe a URL da Vercel com clientes/investors.**

**📱 Funciona perfeitamente em todos os dispositivos.**

**🚀 Backend pode ser adicionado a qualquer momento.**
