import { Router } from 'express'
import { getMyOrg, regenerateInviteCode } from './orgs.controller'
import { authenticate } from '../../middleware/authenticate'

const router = Router()
router.use(authenticate)
router.get('/', getMyOrg)
router.post('/invite/regenerate', regenerateInviteCode)

export default router