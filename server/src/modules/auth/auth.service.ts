import bcrypt from 'bcryptjs'
import prisma from '../../utils/prisma'
import { signAccessToken, signRefreshToken } from '../../utils/jwt'
import { conflict, unauthorized, badRequest } from '../../utils/errors'

export const register = async (
  name: string,
  email: string,
  password: string,
  orgName?: string,
  inviteCode?: string
) => {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw conflict('Email already in use')

  if (!orgName && !inviteCode) throw badRequest('Provide org name or invite code')

  const hashed = await bcrypt.hash(password, 12)

  let org
  let role: 'ADMIN' | 'MEMBER' = 'MEMBER'

  if (inviteCode) {
    org = await prisma.organization.findUnique({ where: { inviteCode } })
    if (!org) throw badRequest('Invalid invite code')
  } else {
    const normalizedOrgName = orgName?.trim()
    if (!normalizedOrgName) throw badRequest('Provide org name or invite code')

    try {
      org = await prisma.organization.create({ data: { name: normalizedOrgName } })
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw conflict('Organization name already taken')
      }
      throw error
    }
    role = 'ADMIN'
  }

  const user = await prisma.user.create({
    data: { name, email, password: hashed, role, orgId: org.id },
    select: { id: true, name: true, email: true, role: true, avatarUrl: true, createdAt: true, orgId: true,
      org: { select: { id: true, name: true, inviteCode: true } },
    },
  })
  const accessToken = signAccessToken({ userId: user.id, role: user.role, orgId: user.orgId })
  const refreshToken = signRefreshToken({ userId: user.id, role: user.role, orgId: user.orgId })
  return { user, accessToken, refreshToken }
}

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { org: { select: { id: true, name: true, inviteCode: true } } },
  })
  if (!user) throw unauthorized('Invalid credentials')

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) throw unauthorized('Invalid credentials')

  const { password: _, ...safeUser } = user
  const accessToken = signAccessToken({ userId: user.id, role: user.role, orgId: user.orgId })
  const refreshToken = signRefreshToken({ userId: user.id, role: user.role, orgId: user.orgId })
  return { user: safeUser, accessToken, refreshToken }
}