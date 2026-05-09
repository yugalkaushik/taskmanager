import { Router } from 'express'
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from './tasks.controller'
import { authenticate } from '../../middleware/authenticate'
import { validate } from '../../middleware/validate'
import { createTaskSchema, updateTaskSchema } from './tasks.schema'

const router = Router()
router.use(authenticate)

router.get('/', getTasks)
router.post('/', validate(createTaskSchema), createTask)
router.get('/:id', getTaskById)
router.patch('/:id', validate(updateTaskSchema), updateTask)
router.delete('/:id', deleteTask)

export default router