# GoSIM Marketplace Clone

Full-stack eSIM marketplace monorepo built with React, Express, Prisma, and PostgreSQL.

## Prerequisites

- Node.js >= 18
- Docker & Docker Compose
- Stripe Account (for payments)

## Setup

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Setup environment variables:
   Copy `.env.example` to `.env` in the root folder, backend, and frontend if needed.

3. Start Infrastructure (Postgres & Redis):

   ```bash
   docker-compose up -d
   ```

4. Database Setup:

   ```bash
   npm run prisma:generate --workspace=backend
   # Once you add models, use npx prisma db push --schema=./backend/prisma/schema.prisma
   ```

5. Start the development servers:
   ```bash
   npm run dev
   ```
   Frontend runs on http://localhost:5173
   Backend runs on http://localhost:5000

## Stack

- **Frontend**: Vite, React (TypeScript), Tailwind CSS, Shadcn UI
- **Backend**: Express (TypeScript), Prisma
- **Database**: PostgreSQL & Redis
- **Infra**: Docker Compose
