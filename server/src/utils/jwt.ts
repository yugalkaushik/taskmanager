import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { Role } from '@prisma/client'

export interface TokenPayload {
  userId: string
  role: Role
  orgId: string
}

export const signAccessToken = (payload: TokenPayload): string =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: '15m' })

export const signRefreshToken = (payload: TokenPayload): string =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: '7d' })

export const verifyAccessToken = (token: string): TokenPayload =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload

export const verifyRefreshToken = (token: string): TokenPayload =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload