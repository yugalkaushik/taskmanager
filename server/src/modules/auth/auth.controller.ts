import { Request, Response, NextFunction } from 'express'
import * as authService from './auth.service'
import { verifyRefreshToken, signAccessToken } from '../../utils/jwt'
import { unauthorized } from '../../utils/errors'

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(
      req.body.name,
      req.body.email,
      req.body.password,
      req.body.orgName,
      req.body.inviteCode,
    )
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body.email, req.body.password)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const refresh = (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = verifyRefreshToken(req.body.refreshToken)
    const accessToken = signAccessToken({ userId: payload.userId, role: payload.role, orgId: payload.orgId })
    res.json({ accessToken })
  } catch {
    next(unauthorized('Refresh token invalid or expired'))
  }
}

export const logout = (_req: Request, res: Response) => {
  res.json({ message: 'Logged out' })
}