# dANI.PT - Stand de Automóveis Usados

## Descrição do Projeto
Website completo para stand de automóveis usados localizado em Coimbra, Portugal.
Inclui área pública para clientes e painel de administração para o dono do stand.

---

## 📋 O QUE JÁ ESTÁ FEITO

### Área Pública
- ✅ **Homepage** - Hero section, viaturas em destaque, campanhas ativas, CTAs
- ✅ **Página de Viaturas** - Listagem com filtros (marca, combustível, ano, preço)
- ✅ **Página Individual de Viatura** - Galeria de imagens, especificações, CTAs de contacto
- ✅ **Página Sobre Nós** - Valores, história, localização
- ✅ **Página de Contactos** - Formulário funcional, mapa, horários
- ✅ **CTAs Mobile** - Barra fixa com botões de chamada e WhatsApp

### Painel de Administração
- ✅ **Login Simples** - Email/password (admin@dani.pt / admin123)
- ✅ **Dashboard** - Estatísticas, ações rápidas, mensagens recentes
- ✅ **Gestão de Viaturas** - CRUD completo, upload de imagens, marcar vendido/destaque
- ✅ **Gestão de Campanhas** - Criar/editar promoções com datas e descontos
- ✅ **Mensagens de Contacto** - Ver, marcar como lidas, responder
- ✅ **Configurações** - Horários, contactos, morada, texto "Sobre Nós"

### Identidade Visual
- ✅ **Logo dANI.PT** integrado em todas as páginas
- ✅ **Paleta de cores**: Vermelho (#E60000), Branco, Cinza (#F4F4F4, #1A1A1A)
- ✅ **Design flat/minimalista** sem sombras, degradês ou efeitos 3D
- ✅ **Cantos retos** (2-4px de radius)
- ✅ **Tipografia**: Archivo (títulos) + Inter (corpo)

### SEO Técnico
- ✅ Meta tags base (title, description, og:tags)
- ✅ Estrutura semântica HTML5 (header, main, section, article, footer)
- ✅ Hierarquia de headings correta (H1 > H2 > H3)
- ✅ URLs limpas e descritivas
- ✅ Favicon com logo

### Backend
- ✅ FastAPI com MongoDB
- ✅ Autenticação JWT
- ✅ Upload de imagens local
- ✅ 10 viaturas de exemplo seed
- ✅ APIs: vehicles, campaigns, contacts, business-info, stats, auth

---

## 🔧 O QUE FALTA FAZER

### Funcionalidades Prioritárias (P0)
- [ ] Autenticação JWT completa com refresh tokens
- [ ] Validação "Esqueci a password"
- [ ] Compressão/otimização de imagens no upload
- [ ] Paginação nas listas de viaturas

### Funcionalidades Secundárias (P1)
- [ ] Ordenação de viaturas (preço, data, quilómetros)
- [ ] Pesquisa full-text nas viaturas
- [ ] Filtros avançados (potência, cor, extras)
- [ ] Favoritos / lista de desejos (localStorage ou BD)
- [ ] Partilha em redes sociais

### Painel Admin (P1)
- [ ] Drag & drop para reordenar imagens
- [ ] Bulk actions (eliminar/marcar múltiplos)
- [ ] Exportar leads para CSV
- [ ] Seleção de viaturas por campanha
- [ ] Preview de campanhas

### SEO & Performance (P2)
- [ ] Sitemap.xml dinâmico
- [ ] Schema.org markup para carros
- [ ] Lazy loading de imagens
- [ ] Service Worker para PWA
- [ ] Google Analytics

### Integrações Futuras (P3)
- [ ] Integração com CRM externo
- [ ] Notificações por email (SendGrid/SMTP)
- [ ] Chat ao vivo (Tawk.to/Intercom)
- [ ] Financiamento online
- [ ] Avaliação de retoma

---

## 📂 ESTRUTURA DE FICHEIROS

```
/app/
├── backend/
│   ├── server.py          # API FastAPI completa
│   ├── uploads/           # Imagens carregadas
│   └── .env               # Configurações
│
├── frontend/
│   ├── public/
│   │   ├── index.html     # Meta tags SEO
│   │   └── logo.png       # Favicon
│   │
│   └── src/
│       ├── App.js         # Routing principal
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── VehicleCard.jsx
│       │   ├── FilterBar.jsx
│       │   └── MobileContactBar.jsx
│       │
│       └── pages/
│           ├── Home.jsx
│           ├── Vehicles.jsx
│           ├── VehicleDetail.jsx
│           ├── About.jsx
│           ├── Contact.jsx
│           └── admin/
│               ├── AdminLogin.jsx
│               ├── AdminDashboard.jsx
│               ├── AdminVehicles.jsx
│               ├── AdminVehicleForm.jsx
│               ├── AdminCampaigns.jsx
│               ├── AdminCampaignForm.jsx
│               ├── AdminMessages.jsx
│               └── AdminSettings.jsx
```

---

## 🔑 CREDENCIAIS DE TESTE

| Recurso | Valor |
|---------|-------|
| Admin Email | admin@dani.pt |
| Admin Password | admin123 |
| Token Key (localStorage) | dani_admin_token |

---

## 🚀 ONDE CONTINUAR O DESENVOLVIMENTO

### Ficheiros para Editar Primeiro
1. **server.py** - Adicionar novos endpoints ou lógica
2. **AdminVehicleForm.jsx** - Melhorar formulário de viaturas
3. **Vehicles.jsx** - Adicionar mais filtros/ordenação
4. **index.html** - Adicionar mais meta tags SEO

### Padrões a Seguir
- Componentes < 50 linhas quando possível
- Comentários TODO indicam pontos de expansão
- Cores sempre via variáveis CSS ou classes Tailwind
- Imports organizados: React > Router > Axios > Lucide > Componentes locais

### Notas Técnicas
- MongoDB collections: vehicles, campaigns, contact_messages, business_info, users
- Imagens guardadas em /app/backend/uploads/
- JWT expira em 24 horas
- CORS configurado para aceitar todas as origens (ajustar em produção)

---

## 📅 Histórico

| Data | Ação |
|------|------|
| 2025-01-14 | Criação inicial do projeto |
| 2025-01-14 | Implementação completa área pública |
| 2025-01-14 | Implementação painel admin |
| 2025-01-14 | Integração logo oficial |
| 2025-01-14 | Preparação SEO base |

---

**Estado**: Avançado mas inacabado - Pronto para desenvolvimento contínuo
