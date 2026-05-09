import { Request, Response, NextFunction } from 'express'
import * as tasksService from './tasks.service'
import { TaskStatus, Priority } from '@prisma/client'

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await tasksService.getTasks(req.user!.userId, req.user!.role, req.user!.orgId, {
      projectId: req.query.projectId as string,
      assigneeId: req.query.assigneeId as string,
      status: req.query.status as TaskStatus,
      priority: req.query.priority as Priority,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
    })
    res.json(result)
  } catch (err) { next(err) }
}

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await tasksService.getTaskById(req.params.id as string, req.user!.userId, req.user!.role)
    res.json(task)
  } catch (err) { next(err) }
}

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await tasksService.createTask(req.user!.userId, req.user!.role, req.body)
    res.status(201).json(task)
  } catch (err) { next(err) }
}

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await tasksService.updateTask(req.params.id as string, req.user!.userId, req.user!.role, req.body)
    res.json(task)
  } catch (err) { next(err) }
}

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await tasksService.deleteTask(req.params.id as string, req.user!.userId, req.user!.role)
    res.status(204).send()
  } catch (err) { next(err) }
}