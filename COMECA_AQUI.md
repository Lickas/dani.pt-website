# 🚀 COMO FAZER DEPLOY - INSTRUÇÕES SIMPLES

## O QUE FOI FEITO?

✅ **Corrigi todos os problemas do site para funcionar na Vercel**

O site agora:
- ✅ Não dá mais tela branca
- ✅ Não dá mais erros de `filter is not a function`
- ✅ Funciona perfeitamente mesmo sem backend
- ✅ Mostra 8 carros de exemplo + 2 campanhas

---

## COMO FAZER DEPLOY AGORA? (SUPER SIMPLES)

### PASSO 1: Vai à Vercel
Acede a: https://vercel.com

### PASSO 2: Clica em "Add New Project"
Importa o teu repositório do GitHub/GitLab

### PASSO 3: Configura assim:
```
Root Directory: frontend
Framework: Create React App
Build Command: yarn build
Output Directory: build
```

### PASSO 4: Adiciona 2 variáveis de ambiente:
```
REACT_APP_USE_MOCK=true
REACT_APP_BACKEND_URL=http://localhost:8000
```

### PASSO 5: Clica em "Deploy"
Espera 2-3 minutos

### PASSO 6: PRONTO! ✅
O site está online e a funcionar!

---

## O QUE VER NO SITE?

Quando o deploy acabar, vais ver:

✅ Homepage com 8 viaturas
✅ Secção de campanhas
✅ Filtros funcionais
✅ Páginas de detalhes
✅ Formulário de contacto
✅ Tudo responsivo (mobile/desktop)

**Banner amarelo no topo** a dizer "Modo Demonstração" porque os dados são exemplos.

---

## E DEPOIS?

### Opção A: Deixar assim (Modo Demo)
- ✅ Site funciona visualmente
- ✅ Podes mostrar a clientes
- ✅ Zero custos de backend
- ⚠️ Dados não são salvos (são falsos)

### Opção B: Adicionar Backend Real (Mais tarde)
Quando quiseres funcionalidades completas:

1. Faz deploy do backend (Heroku/Railway)
2. Volta à Vercel
3. Muda as variáveis para:
   ```
   REACT_APP_USE_MOCK=false
   REACT_APP_BACKEND_URL=https://teu-backend.com
   ```
4. Redesenha

E pronto! Tudo funciona com dados reais.

---

## FICHEIROS IMPORTANTES

Criei vários guias para te ajudar:

1. **`GUIA_RAPIDO_VERCEL.md`** ← COMEÇA POR AQUI
2. **`CHECKLIST_DEPLOY.md`** ← Lista de verificação
3. **`RESUMO_ALTERACOES.md`** ← O que mudei
4. **`VERCEL_DEPLOY.md`** ← Guia super detalhado

---

## PROBLEMAS?

### Tela branca?
→ Verifica se adicionaste `REACT_APP_USE_MOCK=true`

### Build falha?
→ Verifica se Root Directory = `frontend`

### Ainda com problemas?
→ Lê o `GUIA_RAPIDO_VERCEL.md` com atenção

---

## RESUMO

✅ Tudo corrigido
✅ Código pronto
✅ Documentação completa
✅ Pode fazer deploy AGORA

**Tempo estimado: 5 minutos**

**Dificuldade: Fácil**

---

## PRÓXIMO PASSO

👉 **Abre o ficheiro `GUIA_RAPIDO_VERCEL.md`**

Tem tudo explicado passo a passo com prints e exemplos.

---

**Bom deploy! 🚀**

**Qualquer dúvida, consulta os guias que criei.**

**Está tudo explicado lá.**
