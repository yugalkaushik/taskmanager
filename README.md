# TaskManager

Deployed Application: https://sparkling-patience-production-c8d0.up.railway.app/login

The database has already been seeded with demo data, so you can directly log in using the accounts below and explore the platform without any setup.
- Admin: `Yugal Kaushik` - `yugal@taskmanager.dev` password: `Yugal1234`
- Manager: `Tina Sharma` - `tina@taskmanager.dev` password: `Tina1234`
- Member: `Shubham Gupta` - `shubham@taskmanager.dev` password: `Shubham1234`

The app is split into two parts:

- `client/` - a React + Vite frontend
- `server/` - an Express + Prisma API backed by PostgreSQL

## What the app does

- Organizes work into projects and tasks
- Supports roles: `ADMIN`, `MANAGER`, and `MEMBER`
- Lets admins and managers create and manage projects
- Lets members update task status, while admins/managers can handle the rest of the task details
- Shows project-level boards, a dashboard, member lists, and recent activity
- Uses invite codes for joining an organization

## Access control

- Admins can manage everything.
- Managers can work on projects and tasks but they do not get admin-level control.
- Members can update task status only.
- Task and project access is scoped to the organization.

## Tech stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Query, React Hook Form, Zod
- Backend: Express, TypeScript, Prisma, PostgreSQL, Zod, JWT, bcrypt

## Project structure

The repo is organized like this:

- `client/src/pages` - top-level screens like dashboard, projects, tasks, login and register
- `client/src/components` - reusable UI and task/project components
- `client/src/api` - API calls and request helpers
- `server/src/modules` - feature-based backend modules for auth, users, orgs, projects, tasks, and dashboard
- `server/prisma` - Prisma schema, seed data, and migrations

## Local setup

### 1. Install dependencies

From the repo root:

```bash
cd client && npm install
cd ../server && npm install
```

### 2. Set environment variables

Create both environment files:

- `server/.env`
- `client/.env`

Server expects a PostgreSQL database URL, JWT secrets and optional CORS settings.

Typical values look like this:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager"
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
PORT="4000"
CORS_ORIGINS="http://localhost:5173,http://localhost:5174"
```

Client expects API base URL:

```env
VITE_API_URL="http://localhost:4000/api"
```

### 3. Run migrations and seed data

```bash
cd server
npx prisma migrate dev
npm run seed
```

### 4. Start both apps

```bash
# terminal 1
cd server
npm run dev

# terminal 2
cd client
npm run dev
```

## Seeded demo data

The seed script creates one organization and a small team with realistic task data.

- Organization: `Task Manager Dev`
- Invite code: `task2026`
- Admin: `Yugal Kaushik` - `yugal@taskmanager.dev` / `Yugal1234`
- Manager: `Tina Sharma` - `tina@taskmanager.dev` / `Tina1234`
- Members: `Akash Mehta`, `Shubham Gupta`, `Neha Singh`, `Pooja Patil`