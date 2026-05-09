# TaskManager

TaskManager is a full-stack project board for small teams. It combines projects, tasks, members, and roles in one place so the team can keep work moving without jumping between tools.

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

## Tech stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Query, React Hook Form, Zod
- Backend: Express, TypeScript, Prisma, PostgreSQL, Zod, JWT, bcrypt

## Project structure

The repo is organized like this:

- `client/src/pages` - top-level screens like dashboard, projects, tasks, login, and register
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

Server expects a PostgreSQL database URL, JWT secrets, and optional CORS settings.

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

## Available scripts

### Server

- `npm run dev` - start the API in development mode
- `npm run build` - compile the TypeScript server
- `npm run start` - run the compiled server
- `npm run seed` - load sample organization, users, projects, and tasks

### Client

- `npm run dev` - start the Vite app
- `npm run build` - type-check and build for production
- `npm run lint` - run ESLint
- `npm run preview` - preview the production build

## Seeded demo data

The seed script creates one organization and a small team with realistic task data.

- Organization: `Task Manager Dev`
- Invite code: `task2026`
- Admin: `Yugal Kaushik` - `yugal@taskmanager.dev` / `Yugal1234`
- Manager: `Tina Sharma` - `tina@taskmanager.dev` / `Tina1234`
- Members: `Akash Mehta`, `Shubham Gupta`, `Neha Singh`, `Pooja Patil`

## Notes on access control

- Admins can manage everything.
- Managers can work on projects and tasks, but they do not get admin-level control.
- Members can update task status only.
- Task and project access is scoped to the user’s organization.

## Database changes

Prisma migrations live in `server/prisma/migrations`. The seed script in `server/prisma/seed.ts` resets the sample data and loads the demo workspace.

## Deploy on Railway

This project is easiest to deploy as two Railway services:

- backend service from `server/`
- frontend service from `client/`

### 1. Deploy backend service

In Railway, create a new service from this repo and set root directory to `server`.

Set these environment variables in Railway:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `NODE_ENV=production`
- `CORS_ORIGINS` (set this to your frontend Railway URL, example: `https://taskmanager-client.up.railway.app`)

Recommended backend commands:

- Build command: `npm install && npx prisma generate && npm run build`
- Start command: `npx prisma migrate deploy && npm run start`

### 2. Deploy frontend service

Create another Railway service from the same repo with root directory `client`.

Set frontend env:

- `VITE_API_URL` = your backend URL + `/api`
	- example: `https://taskmanager-api.up.railway.app/api`

Recommended frontend commands:

- Build command: `npm install && npm run build`
- Start command: `npx vite preview --host 0.0.0.0 --port $PORT`

### 3. Final production checks

- Confirm backend health by hitting one API route (for example login)
- Confirm browser requests go to `VITE_API_URL`
- Confirm CORS allows the frontend domain from `CORS_ORIGINS`
- Re-run seed only if you want demo data in production

### 4. Keep development and production both working

- Local development uses `client/.env` with `http://localhost:4000/api`
- Production uses Railway env with deployed service URLs
- Server CORS supports both local origins and configured production origins
