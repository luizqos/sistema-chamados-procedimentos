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

```

## 🚀 Como Executar o Projeto

### **A. Via Docker Compose**

Sobe todo o ambiente containerizado (PostgreSQL, BFF e Frontend) de forma integrada e realiza as migrações automaticamente:

1. Inicie os containers com rebuild:
```ini
docker compose up -d --build
```

2. Acesse os serviços:
   - Frontend: http://localhost:3000
   - BFF API: http://localhost:3001
   - Documentação Swagger: http://localhost:3001/api-docs

### **B. Execução Local para Desenvolvimento (Sem Docker)**

Para rodar a aplicação localmente utilizando scripts do package.json:

1. Instale as dependências da raiz e dos subprojetos:
```ini
    npm install
    cd bff-chamados && npm install
    cd ../frontend-chamados && npm install
    cd ..
```

2. Sincronize o banco de dados (SQLite ou Postgres):

- Opção SQLite:
 
 ```ini
    cd bff-chamados
    npm run db:push:sqlite
    cd ..
```
- Opção PostgreSQL:

 ```ini
    cd bff-chamados
    npm run db:push:pg
    cd ..
```

3. Inicie o projeto em modo dev concorrente:

 ```ini
    npm run dev
```

## 🗄️ Gerenciamento de Migrações do Banco de Dados

Sempre que alterar os modelos no arquivo bff-chamados/prisma/schema.prisma durante o desenvolvimento com PostgreSQL, crie e versione uma nova migração:

 ```ini
    cd bff-chamados
    npx prisma migrate dev --name <nome_da_alteracao>
```

Em ambiente de produção ou durante a inicialização dos containers via Docker, as migrações aplicadas no banco de dados utilizam estritamente o comando:

 ```ini
    npx prisma migrate deploy
```

## 💾 Persistência e Backup de Dados

O banco de dados PostgreSQL utiliza um Named Volume gerenciado pelo Docker (postgres_data), garantindo que a remoção ou rebuild de imagens e containers não apague os registros armazenados.

### Backup dos Dados

Para exportar o banco de dados antes de migrar de ambiente:

 ```ini
    docker exec -t bff_postgres pg_dump -U postgres -d chamados_db > backup_chamados.sql
```

### Restauração dos Dados

Para importar um arquivo de backup para um novo container:

 ```ini
    docker exec -i bff_postgres psql -U postgres -d chamados_db < backup_chamados.sql
```

## 📌 Principais Funcionalidades

- Busca em Tempo Real: Filtro rápido de procedimentos por palavra-chave no título, descrição ou passos do script.
- Leitor de Script em Markdown: Renderização rica com suporte a formatação de texto, tabelas, listas e blocos de código.
- Cópia Rápida de Script: Botão de um clique para enviar o script técnico para a área de transferência.
- Galeria de Anexos Mídia: Upload e exibição integrada de imagens (PNG, JPG, WEBP) e vídeos explicativos (MP4, WEBM).
- Scroll Infinito Operacional: Paginação do lado do servidor integrada com sentinela de rolagem na barra lateral.
- Confirmações de Segurança: Dialogs customizados para ações de exclusão destrutivas.