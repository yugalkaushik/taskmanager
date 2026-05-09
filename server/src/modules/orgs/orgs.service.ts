import prisma from '../../utils/prisma'
import { notFound, forbidden } from '../../utils/errors'
import { Role } from '@prisma/client'

export const getMyOrg = async (orgId: string) => {
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: { id: true, name: true, inviteCode: true, createdAt: true, _count: { select: { users: true } } },
  })
  if (!org) throw notFound('Org not found')
  return org
}

export const regenerateInviteCode = async (orgId: string, userId: string, role: Role) => {
  if (role !== 'ADMIN') throw forbidden()
  const { randomBytes } = await import('crypto')
  const newCode = randomBytes(6).toString('hex')
  return prisma.organization.update({
    where: { id: orgId },
    data: { inviteCode: newCode },
    select: { id: true, name: true, inviteCode: true },
  })
}