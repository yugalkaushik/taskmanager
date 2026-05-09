import prisma from '../../utils/prisma'
import { notFound } from '../../utils/errors'
import { Role } from '@prisma/client'

const safeSelect = {
  id: true, name: true, email: true, role: true, avatarUrl: true, createdAt: true, orgId: true,
}

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { ...safeSelect, org: { select: { id: true, name: true, inviteCode: true } } },
  })
  if (!user) throw notFound('User not found')
  return user
}

export const updateMe = async (userId: string, data: { name?: string; avatarUrl?: string }) => {
  return prisma.user.update({ where: { id: userId }, data, select: safeSelect })
}

export const getAllUsers = async (orgId: string, page: number, limit: number) => {
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: { orgId },
      skip: (page - 1) * limit,
      take: limit,
      select: safeSelect,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where: { orgId } }),
  ])
  return { users, total, page, limit }
}

export const updateUserRole = async (userId: string, role: Role, requesterId: string, requesterOrgId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw notFound('User not found')
  if (user.orgId !== requesterOrgId) throw notFound('User not found')
  return prisma.user.update({ where: { id: userId }, data: { role }, select: safeSelect })
}