import { Request, Response, NextFunction } from 'express'
import * as projectsService from './projects.service'
import { ProjectStatus } from '@prisma/client'

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await projectsService.getProjects(req.user!.userId, req.user!.role, req.user!.orgId)
    res.json(projects)
  } catch (err) { next(err) }
}

export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.id as string
    const project = await projectsService.getProjectById(projectId, req.user!.userId, req.user!.role, req.user!.orgId)
    res.json(project)
  } catch (err) { next(err) }
}

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await projectsService.createProject(req.user!.userId, req.user!.orgId, req.body.name, req.body.description)
    res.status(201).json(project)
  } catch (err) { next(err) }
}

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.id as string
    const project = await projectsService.updateProject(
      projectId, req.user!.userId, req.user!.role, req.user!.orgId,
      { ...req.body, status: req.body.status as ProjectStatus | undefined }
    )
    res.json(project)
  } catch (err) { next(err) }
}

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await projectsService.deleteProject(req.params.id as string, req.user!.orgId)
    res.status(204).send()
  } catch (err) { next(err) }
}

export const addMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.id as string
    const member = await projectsService.addMember(
      projectId, req.body.userId, req.user!.userId, req.user!.role, req.user!.orgId
    )
    res.status(201).json(member)
  } catch (err) { next(err) }
}

export const removeMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.id as string
    const memberUserId = req.params.userId as string
    await projectsService.removeMember(
      projectId, memberUserId, req.user!.userId, req.user!.role, req.user!.orgId
    )
    res.status(204).send()
  } catch (err) { next(err) }
}