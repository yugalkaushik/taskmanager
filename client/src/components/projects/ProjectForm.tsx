import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '../ui/Input'
import Button from '../ui/Button'

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  onSubmit: (data: FormData) => void
  loading: boolean
  defaultValues?: Partial<FormData>
}

export default function ProjectForm({ onSubmit, loading, defaultValues }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="Project name" error={errors.name?.message} {...register('name')} placeholder="My project" />
      <div className="flex flex-col gap-1">
        <label className="field-label">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          placeholder="What is this project about?"
          className="field-textarea text-sm"
        />
        {errors.description && <p className="text-xs text-rose-600">{errors.description.message}</p>}
      </div>
      <Button type="submit" loading={loading} className="mt-1">
        Save project
      </Button>
    </form>
  )
}