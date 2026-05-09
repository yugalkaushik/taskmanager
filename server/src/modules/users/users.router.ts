import { Router } from 'express'
import { getMe, updateMe, getAllUsers, updateUserRole } from './users.controller'
import { authenticate } from '../../middleware/authenticate'
import { authorize } from '../../middleware/authorize'

const router = Router()

router.use(authenticate)
router.get('/me', getMe)
router.patch('/me', updateMe)
router.get('/', authorize('ADMIN'), getAllUsers)
router.patch('/:id/role', authorize('ADMIN'), updateUserRole)

export default router