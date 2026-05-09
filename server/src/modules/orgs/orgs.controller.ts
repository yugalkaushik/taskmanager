import { Request, Response, NextFunction } from 'express'
import * as orgsService from './orgs.service'

export const getMyOrg = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const org = await orgsService.getMyOrg(req.user!.orgId)
    res.json(org)
  } catch (err) { next(err) }
}

export const regenerateInviteCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const org = await orgsService.regenerateInviteCode(req.user!.orgId, req.user!.userId, req.user!.role)
    res.json(org)
  } catch (err) { next(err) }
}