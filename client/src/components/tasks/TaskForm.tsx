import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { User } from '../../types'

const fullSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assigneeId: z.string().optional(),
  dueDate: z.string().optional(),
})

const statusOnlySchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assigneeId: z.string().optional(),
  dueDate: z.string().optional(),
})

type FormData = {
  title?: string
  description?: string
  status?: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  assigneeId?: string
  dueDate?: string
}

interface Props {
  onSubmit: (data: FormData) => void
  loading: boolean
  members?: User[]
  defaultValues?: Partial<FormData>
  statusOnly?: boolean
}

export default function TaskForm({ onSubmit, loading, members = [], defaultValues, statusOnly = false }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(statusOnly ? statusOnlySchema : fullSchema) as Resolver<FormData>,
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {statusOnly ? (
        <div className="flex flex-col gap-1">
          <label className="field-label">Status</label>
          <select {...register('status')} className="field-select text-sm">
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="DONE">Done</option>
          </select>
        </div>
      ) : (
        <>
          <Input label="Task title" error={errors.title?.message} {...register('title')} placeholder="What needs to be done?" />
          <div className="flex flex-col gap-1">
            <label className="field-label">Description</label>
            <textarea
              {...register('description')}
              rows={2}
              className="field-textarea text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="field-label">Status</label>
              <select {...register('status')} className="field-select text-sm">
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="DONE">Done</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="field-label">Priority</label>
              <select {...register('priority')} className="field-select text-sm">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="field-label">Assignee</label>
            <select {...register('assigneeId')} className="field-select text-sm">
              <option value="">Unassigned</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <Input label="Due date" type="date" {...register('dueDate')} />
        </>
      )}
      <Button type="submit" loading={loading} className="mt-1">Save task</Button>
    </form>
  )
}