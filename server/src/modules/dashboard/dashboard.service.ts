import prisma from '../../utils/prisma'
import { Role } from '@prisma/client'

export const getStats = async (userId: string, role: Role, orgId: string) => {
  const projectWhere = role === 'ADMIN'
    ? { orgId }
    : { orgId, OR: [{ ownerId: userId }, { members: { some: { userId } } }] }

  const userProjects = await prisma.project.findMany({ where: projectWhere, select: { id: true } })
  const projectIds = userProjects.map(p => p.id)
  const taskWhere = role === 'ADMIN' ? { project: { orgId } } : { projectId: { in: projectIds } }

  const [totalProjects, totalTasks, tasksByStatus, tasksByPriority, overdueCount, recentTasks] = await Promise.all([
    prisma.project.count({ where: projectWhere }),
    prisma.task.count({ where: taskWhere }),
    prisma.task.groupBy({ by: ['status'], where: taskWhere, _count: { _all: true } }),
    prisma.task.groupBy({ by: ['priority'], where: taskWhere, _count: { _all: true } }),
    prisma.task.count({ where: { ...taskWhere, dueDate: { lt: new Date() }, status: { not: 'DONE' } } }),
    prisma.task.findMany({
      where: taskWhere,
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
  ])

  return {
    totalProjects,
    totalTasks,
    tasksByStatus: tasksByStatus.map(t => ({ status: t.status, count: t._count._all })),
    tasksByPriority: tasksByPriority.map(t => ({ priority: t.priority, count: t._count._all })),
    overdueCount,
    recentActivity: recentTasks,
  }
}