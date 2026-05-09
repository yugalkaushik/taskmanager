import prisma from '../../utils/prisma'
import { notFound, forbidden, conflict, badRequest } from '../../utils/errors'
import { ProjectStatus, Role } from '@prisma/client'

const projectSelect = {
  id: true, name: true, description: true, status: true, ownerId: true, orgId: true, createdAt: true, updatedAt: true,
  owner: { select: { id: true, name: true, email: true } },
  _count: { select: { members: true, tasks: true } },
}

export const getProjects = async (userId: string, role: Role, orgId: string) => {
  const where = role === 'ADMIN'
    ? { orgId }
    : { orgId, OR: [{ ownerId: userId }, { members: { some: { userId } } }] }
  return prisma.project.findMany({ where, select: projectSelect, orderBy: { createdAt: 'desc' } })
}

export const getProjectById = async (projectId: string, userId: string, role: Role, orgId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      members: { include: { user: { select: { id: true, name: true, email: true, role: true } } } },
      tasks: { include: { assignee: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } },
    },
  })
  if (!project || project.orgId !== orgId) throw notFound('Project not found')
  if (role !== 'ADMIN') {
    const isMember = project.members.some(m => m.userId === userId)
    if (!isMember) throw forbidden()
  }
  return project
}

export const createProject = async (userId: string, orgId: string, name: string, description?: string) => {
  return prisma.project.create({
    data: { name, description, ownerId: userId, orgId, members: { create: { userId } } },
    select: projectSelect,
  })
}

export const updateProject = async (
  projectId: string, userId: string, role: Role, orgId: string,
  data: { name?: string; description?: string; status?: ProjectStatus }
) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project || project.orgId !== orgId) throw notFound('Project not found')
  if (role !== 'ADMIN' && project.ownerId !== userId) throw forbidden()
  return prisma.project.update({ where: { id: projectId }, data, select: projectSelect })
}

export const deleteProject = async (projectId: string, orgId: string) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project || project.orgId !== orgId) throw notFound('Project not found')
  await prisma.project.delete({ where: { id: projectId } })
}

export const addMember = async (projectId: string, userId: string, requesterId: string, role: Role, orgId: string) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project || project.orgId !== orgId) throw notFound('Project not found')
  if (role !== 'ADMIN' && project.ownerId !== requesterId) throw forbidden()

  const userExists = await prisma.user.findUnique({ where: { id: userId } })
  if (!userExists || userExists.orgId !== orgId) throw notFound('User not found in this org')

  const existing = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  })
  if (existing) throw conflict('User is already a member')

  return prisma.projectMember.create({
    data: { projectId, userId },
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
  })
}

export const removeMember = async (projectId: string, userId: string, requesterId: string, role: Role, orgId: string) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project || project.orgId !== orgId) throw notFound('Project not found')
  if (role !== 'ADMIN' && project.ownerId !== requesterId) throw forbidden()
  if (project.ownerId === userId) throw badRequest('Cannot remove the project owner')

  const targetUser = await prisma.user.findUnique({ where: { id: userId }, select: { role: true, orgId: true } })
  if (!targetUser || targetUser.orgId !== orgId) throw notFound('User not found in this org')
  if (targetUser.role === 'ADMIN' && role !== 'ADMIN') throw forbidden('Cannot remove an admin user')

  await prisma.projectMember.delete({ where: { projectId_userId: { projectId, userId } } })
}