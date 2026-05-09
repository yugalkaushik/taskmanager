import prisma from '../../utils/prisma'
import { notFound, forbidden, badRequest } from '../../utils/errors'
import { Role, TaskStatus, Priority } from '@prisma/client'

const taskInclude = {
  assignee: { select: { id: true, name: true, email: true } },
  project: { select: { id: true, name: true } },
}

export const getTasks = async (
  userId: string, role: Role, orgId: string,
  filters: { projectId?: string; assigneeId?: string; status?: TaskStatus; priority?: Priority; page?: number; limit?: number }
) => {
  const page = filters.page || 1
  const limit = filters.limit || 10

  const projectWhere = role === 'ADMIN'
    ? { orgId }
    : { orgId, OR: [{ ownerId: userId }, { members: { some: { userId } } }] }

  const userProjects = await prisma.project.findMany({ where: projectWhere, select: { id: true } })
  const projectIds = userProjects.map(p => p.id)

  const accessWhere = role === 'ADMIN' ? { project: { orgId } } : { projectId: { in: projectIds } }

  const filterWhere = {
    ...(filters.projectId && { projectId: filters.projectId }),
    ...(filters.assigneeId && { assigneeId: filters.assigneeId }),
    ...(filters.status && { status: filters.status }),
    ...(filters.priority && { priority: filters.priority }),
  }

  const where = { ...accessWhere, ...filterWhere }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where, include: taskInclude,
      skip: (page - 1) * limit, take: limit,
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.task.count({ where }),
  ])
  return { tasks, total, page, limit }
}

export const getTaskById = async (taskId: string, userId: string, role: Role) => {
  const task = await prisma.task.findUnique({ where: { id: taskId }, include: taskInclude })
  if (!task) throw notFound('Task not found')

  if (role !== 'ADMIN') {
    const membership = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: task.projectId, userId } },
    })
    if (!membership) throw forbidden()
  }
  return task
}

export const createTask = async (userId: string, role: Role, data: {
  title: string; description?: string; status?: TaskStatus; priority?: Priority;
  projectId: string; assigneeId?: string; dueDate?: string
}) => {
  const membership = role === 'ADMIN' ? true : await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId: data.projectId, userId } },
  })
  if (!membership) throw forbidden('You are not a member of this project')

  if (data.assigneeId) {
    const assigneeMembership = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: data.projectId, userId: data.assigneeId } },
    })
    if (!assigneeMembership) throw badRequest('Assignee must be a member of the project')
  }

  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      projectId: data.projectId,
      assigneeId: data.assigneeId,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      doneAt: data.status === 'DONE' ? new Date() : null,
    },
    include: taskInclude,
  })
}

export const updateTask = async (taskId: string, userId: string, role: Role, data: {
  title?: string; description?: string; status?: TaskStatus; priority?: Priority;
  assigneeId?: string | null; dueDate?: string | null
}) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: {
      id: true,
      projectId: true,
      assigneeId: true,
      doneAt: true,
      project: { select: { id: true, ownerId: true, orgId: true } },
      assignee: { select: { id: true, role: true } },
    },
  })
  if (!task) throw notFound('Task not found')

  if (role !== 'ADMIN') {
    const membership = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: task.projectId, userId } },
    })
    if (!membership) throw forbidden()
  }

  if (role === 'MEMBER') {
    const hasNonStatusChanges =
      data.title !== undefined ||
      data.description !== undefined ||
      data.priority !== undefined ||
      data.assigneeId !== undefined ||
      data.dueDate !== undefined

    if (hasNonStatusChanges) throw forbidden('Members can only change task status')
  }

  if (role !== 'ADMIN' && task.assignee?.role === 'ADMIN' && data.assigneeId !== undefined && data.assigneeId !== task.assigneeId) {
    throw forbidden('Cannot remove an admin from a task')
  }

  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...data,
      doneAt: data.status === undefined ? undefined : data.status === 'DONE' ? task.doneAt ?? new Date() : null,
      dueDate: data.dueDate === null ? null : data.dueDate ? new Date(data.dueDate) : undefined,
    },
    include: taskInclude,
  })
}

export const deleteTask = async (taskId: string, userId: string, role: Role) => {
  const task = await prisma.task.findUnique({ where: { id: taskId }, include: { project: true } })
  if (!task) throw notFound('Task not found')

  const canDelete = role === 'ADMIN' || task.project.ownerId === userId
  if (!canDelete) throw forbidden()

  await prisma.task.delete({ where: { id: taskId } })
}