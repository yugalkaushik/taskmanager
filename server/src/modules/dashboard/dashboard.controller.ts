import { Request, Response, NextFunction } from 'express'
import * as dashboardService from './dashboard.service'

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await dashboardService.getStats(req.user!.userId, req.user!.role, req.user!.orgId)
    res.json(stats)
  } catch (err) { next(err) }
}