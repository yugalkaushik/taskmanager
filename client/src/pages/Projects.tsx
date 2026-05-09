import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProjectsApi, createProjectApi } from '../api/projects'
import ProjectCard from '../components/projects/ProjectCard'
import ProjectForm from '../components/projects/ProjectForm'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonCard } from '../components/ui/Skeleton'
import { useAuthStore } from '../store/authStore'

export default function Projects() {
  const [open, setOpen] = useState(false)
  const { user } = useAuthStore()
  const qc = useQueryClient()

  const { data: projects, isLoading } = useQuery({ queryKey: ['projects'], queryFn: getProjectsApi })

  const createMutation = useMutation({
    mutationFn: createProjectApi,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['projects'] }); setOpen(false) },
  })

  const canCreate = user?.role === 'ADMIN' || user?.role === 'MANAGER'

  return (
    <div className="flex max-w-[1180px] flex-col gap-6">
      <div className="surface-card-strong flex flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-6">
        <div>
          <p className="page-kicker mb-2">Portfolio</p>
          <h1 className="page-title">Project spaces</h1>
          <p className="page-subtitle mt-2">Create, organize and track progress across every team initiative.</p>
        </div>
        {canCreate && <Button onClick={() => setOpen(true)}>Create project</Button>}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : projects?.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
      ) : (
        <EmptyState
          message="No projects yet"
          action={canCreate ? <Button onClick={() => setOpen(true)}>Create first project</Button> : undefined}
        />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="New project">
        <ProjectForm onSubmit={d => createMutation.mutate(d)} loading={createMutation.isPending} />
      </Modal>
    </div>
  )
}