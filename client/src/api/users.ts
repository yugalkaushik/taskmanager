import api from './axios'
import { User } from '../types'

interface UsersResponse {
  users: User[]
  total: number
  page: number
  limit: number
}

export const getMeApi = () => api.get<User>('/users/me').then(r => r.data)

export const updateMeApi = (data: { name?: string; avatarUrl?: string }) =>
  api.patch<User>('/users/me', data).then(r => r.data)

export const getAllUsersApi = (page = 1, limit = 20) =>
  api.get<UsersResponse>(`/users?page=${page}&limit=${limit}`).then(r => r.data)

export const updateUserRoleApi = (id: string, role: string) =>
  api.patch<User>(`/users/${id}/role`, { role }).then(r => r.data)