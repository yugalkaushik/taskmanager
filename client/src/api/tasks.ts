import api from './axios'
import { Task } from '../types'

interface TaskFilters {
  projectId?: string
  assigneeId?: string
  status?: string
  priority?: string
  page?: number
  limit?: number
}

interface TasksResponse {
  tasks: Task[]
  total: number
  page: number
  limit: number
}

export const getTasksApi = (filters: TaskFilters = {}) => {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) params.set(k, String(v)) })
  return api.get<TasksResponse>(`/tasks?${params}`).then(r => r.data)
}

export const createTaskApi = (data: {
  title: string; description?: string; status?: string; priority?: string;
  projectId: string; assigneeId?: string; dueDate?: string
}) => api.post<Task>('/tasks', data).then(r => r.data)

export const updateTaskApi = (id: string, data: Partial<{
  title: string; description: string; status: string; priority: string;
  assigneeId: string | null; dueDate: string | null
}>) => api.patch<Task>(`/tasks/${id}`, data).then(r => r.data)

export const deleteTaskApi = (id: string) => api.delete(`/tasks/${id}`)