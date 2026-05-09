import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken, TokenPayload } from '../utils/jwt'
import { unauthorized } from '../utils/errors'

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload
    }
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) return next(unauthorized())
  const token = header.split(' ')[1]
  try {
    req.user = verifyAccessToken(token)
    next()
  } catch {
    next(unauthorized('Token expired or invalid'))
  }
}