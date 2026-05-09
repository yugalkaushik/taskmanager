import { Router } from 'express'
import { getStats } from './dashboard.controller'
import { authenticate } from '../../middleware/authenticate'

const router = Router()
router.use(authenticate)
router.get('/stats', getStats)

export default router