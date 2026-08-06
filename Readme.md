# Sistema de Chamados e Procedimentos (BFF + Frontend)

Sistema web para gestão, consulta e cadastro de procedimentos operacionais e scripts de atendimento, desenvolvido em arquitetura **BFF (Backend for Frontend)** com **Express/Node.js**, **Prisma ORM**, **PostgreSQL** e interface reativa em **Next.js**.

---

## 🛠️ Tecnologias Utilizadas

### **Backend (BFF)**
* **Node.js** (v22 / Debian Slim)
* **Express 5**
* **Prisma ORM** (Client & CLI v6+)
* **PostgreSQL 16**
* **Multer** (Upload de anexos e mídias)
* **Swagger UI / OpenAPI 3.0** (Documentação da API)

### **Frontend**
* **Next.js 16** (App Router)
* **React 19** / **TypeScript**
* **Tailwind CSS v4**
* **Axios** (Integração de APIs)
* **Lucide React** (Ícones)
* **React Hot Toast & SweetAlert2** (Notificações e modais)

---

## 📁 Estrutura do Projeto

```text
sistema-chamados-procedimentos/
├── .env.example                # Template global de variáveis de ambiente
├── .gitignore                  # Regras globais de exclusão do Git
├── docker-compose.yml          # Orquestração do banco, BFF e frontend
├── package.json                # Scripts raiz do projeto
│
├── bff-chamados/               # Backend Express + Prisma
│   ├── prisma/
│   │   ├── migrations/         # Histórico de migrações do PostgreSQL
│   │   └── schema.prisma       # Modelagem das tabelas
│   ├── src/
│   │   ├── config/             # Validação de ENVs e setups
│   │   ├── controllers/        # Controladores de rotas
│   │   ├── repositories/       # Camada de acesso ao banco via Prisma
│   │   └── routes/             # Definição de endpoints e Swagger
│   ├── Dockerfile              # Build otimizado em Node 22
│   └── entrypoint.sh           # Script de migração automática ao iniciar
│
└── frontend-chamados/          # Aplicação Next.js
    ├── src/
    │   ├── components/         # Componentes UI (Sidebar, Modais, Painel)
    │   ├── hooks/              # Custom Hooks (useProcedimentos)
    │   ├── services/           # Camada de integração Axios
    │   └── utils/              # Constantes e helpers
    ├── app/                    # Páginas e layouts do Next.js
    └── Dockerfile              # Build multi-stage para produção

```

## ⚙️ Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na **raiz do projeto** baseando-se no `.env.example`:

```ini
# --- BANCO DE DADOS (POSTGRES) ---
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgrespassword
POSTGRES_DB=chamados_db
POSTGRES_PORT=5432

# --- BFF BACKEND ---
BFF_PORT=3001
JWT_SECRET=sua_chave_secreta_super_segura
CORS_ORIGIN=http://localhost:3000

# --- FRONTEND NEXT.JS ---
FRONTEND_PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:3001

