import { Router } from 'express'
import { getProjects, getProjectById, createProject, updateProject, deleteProject, addMember, removeMember } from './projects.controller'
import { authenticate } from '../../middleware/authenticate'
import { authorize } from '../../middleware/authorize'
import { validate } from '../../middleware/validate'
import { createProjectSchema, updateProjectSchema, addMemberSchema } from './projects.schema'

const router = Router()
router.use(authenticate)

router.get('/', getProjects)
router.post('/', authorize('ADMIN', 'MANAGER'), validate(createProjectSchema), createProject)
router.get('/:id', getProjectById)
router.patch('/:id', validate(updateProjectSchema), updateProject)
router.delete('/:id', authorize('ADMIN'), deleteProject)
router.post('/:id/members', validate(addMemberSchema), addMember)
router.delete('/:id/members/:userId', removeMember)

export default router