# 🚀 Super Tasks

Painel de gerenciamento de tarefas Full-Stack containerizado, desenvolvido com o ecossistema JavaScript/TypeScript.

---

## 📋 Sobre o Projeto

Sistema para cadastro e gerenciamento de tarefas com controle de acesso, perfis de usuário e proteção de rotas.

### ✨ Funcionalidades

* **Autenticação:** Login e Registro via E-mail/Senha e **Google OAuth2**.
* **Tarefas:** CRUD completo (Criar, Ler, Editar, Deletar).
* **Perfil:** Edição de dados e avatar (link de imagem e preview).
* **Interface:** Construída com **Shadcn UI** e **Tailwind CSS**.

### 🏆 Bônus Implementados

1.  **Auth & Segurança:**
    * Estratégia híbrida (Local + Google).
    * Persistência de sessão via JWT e Cookies.
2.  **API Avançada:**
    * Paginação de resultados.
    * Ordenação dinâmica.
    * Filtragem de dados no banco.
3.  **Infraestrutura (Extra):**
    * Ambiente Dockerizado (Frontend, Backend e Banco).

---

## 🛠️ Tecnologias

**Frontend:**
* [Next.js 16](https://nextjs.org/) (App Router)
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Shadcn UI](https://ui.shadcn.com/)
* [Axios](https://axios-http.com/)
* [Zod](https://zod.dev/) & React Hook Form

**Backend:**
* [NestJS](https://nestjs.com/)
* [Prisma ORM](https://www.prisma.io/)
* [PostgreSQL](https://www.postgresql.org/)
* [Passport](https://www.passportjs.org/) (JWT & Google Strategies)

**DevOps:**
* [Docker](https://www.docker.com/) & Docker Compose

---

## 🚀 Como Executar o Projeto

Execução via **Docker** (Recomendado).

### Pré-requisitos

* [Docker](https://www.docker.com/products/docker-desktop/) e **Docker Compose** instalados.

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/Gustaa13/Super-painel-de-tarefas.git
    cd Super-painel-de-tarefas
    ```

2.  **Configuração (.env):**
    Crie um arquivo `.env` na **raiz do projeto** e insira os dados abaixo:

    ```env
    # --- ARQUIVO .env ---

    # Segurança (JWT)
    JWT_SECRET="sua_chave_secreta"

    # Google OAuth (Necessário para o botão "Entrar com Google" funcionar)
    # Gere em: https://console.cloud.google.com/apis/credentials
    GOOGLE_CLIENT_ID="seu_google_client_id"
    GOOGLE_CLIENT_SECRET="seu_google_client_secret"
    
    # Banco configurado automaticamente pelo Docker.
    ```

3.  **Execução:**
    Na raiz do projeto, execute:

    ```bash
    docker-compose up -d --build
    ```

    *Aguarde o download das imagens e instalação das dependências.*

4.  **Acesso:**

    * **Frontend:** [http://localhost:3000](http://localhost:3000)
    * **Backend:** [http://localhost:3001](http://localhost:3001)
    * **Banco (Externo):** `localhost:5433` (User: `admin`, Pass: `password123`, DB: `supertasks_db`)

---

## ⚙️ Execução Manual (Sem Docker)

Para execução local dos serviços separadamente:

**1. Backend:**
```bash
cd backend
npm install
# Configure .env na pasta backend (DATABASE_URL, JWT_SECRET, GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET)
npx prisma generate
npx prisma db push
npm run start:dev
```

**2. Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

Desenvolvido por [Gustaa13](https://github.com/Gustaa13).