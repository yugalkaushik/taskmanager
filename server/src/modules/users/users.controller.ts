import { Request, Response, NextFunction } from 'express'
import * as usersService from './users.service'
import { Role } from '@prisma/client'

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await usersService.getMe(req.user!.userId)
    res.json(user)
  } catch (err) { next(err) }
}

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await usersService.updateMe(req.user!.userId, req.body)
    res.json(user)
  } catch (err) { next(err) }
}

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const result = await usersService.getAllUsers(req.user!.orgId, page, limit)
    res.json(result)
  } catch (err) { next(err) }
}

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id as string
    const user = await usersService.updateUserRole(
      userId, req.body.role as Role, req.user!.userId, req.user!.orgId
    )
    res.json(user)
  } catch (err) { next(err) }
}