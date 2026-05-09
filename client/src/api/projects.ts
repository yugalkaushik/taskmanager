import api from './axios'
import { Project } from '../types'

export const getProjectsApi = () => api.get<Project[]>('/projects').then(r => r.data)

export const getProjectApi = (id: string) => api.get<Project>(`/projects/${id}`).then(r => r.data)

export const createProjectApi = (data: { name: string; description?: string }) =>
  api.post<Project>('/projects', data).then(r => r.data)

export const updateProjectApi = (id: string, data: Partial<{ name: string; description: string; status: string }>) =>
  api.patch<Project>(`/projects/${id}`, data).then(r => r.data)

export const deleteProjectApi = (id: string) => api.delete(`/projects/${id}`)

export const addMemberApi = (projectId: string, userId: string) =>
  api.post(`/projects/${projectId}/members`, { userId }).then(r => r.data)

export const removeMemberApi = (projectId: string, userId: string) =>
  api.delete(`/projects/${projectId}/members/${userId}`)