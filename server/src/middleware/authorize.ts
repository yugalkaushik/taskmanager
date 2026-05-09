import { Request, Response, NextFunction } from 'express'
import { Role } from '@prisma/client'
import { forbidden } from '../utils/errors'

export const authorize =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) return next(forbidden())
    next()
  }