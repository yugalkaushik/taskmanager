import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { env } from './config/env'
import { AppError } from './utils/errors'
import authRouter from './modules/auth/auth.router'
import usersRouter from './modules/users/users.router'
import projectsRouter from './modules/projects/projects.router'
import tasksRouter from './modules/tasks/tasks.router'
import dashboardRouter from './modules/dashboard/dashboard.router'
import orgsRouter from './modules/orgs/orgs.router'


const app = express()
app.set("trust proxy", 1);
const localOrigins = ['http://localhost:5173', 'http://localhost:5174']
const configuredOrigins = env.CORS_ORIGINS
  ? env.CORS_ORIGINS.split(',').map(v => v.trim()).filter(Boolean)
  : []
const allowedOrigins = new Set([...localOrigins, ...configuredOrigins])

app.use(helmet())
app.use(cors({
  credentials: true,
  origin: (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return cb(null, true)
    if (allowedOrigins.has(origin)) return cb(null, true)
    return cb(new Error('Not allowed by CORS'))
  },
}))
app.use(express.json({ limit: '1mb' }))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }))

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/tasks', tasksRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/orgs', orgsRouter)

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message })
    return
  }
  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
})

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`)
})

export default app