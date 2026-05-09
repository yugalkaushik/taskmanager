import api from './axios'
import { AuthResponse } from '../types'

export const registerApi = (data: { name: string; email: string; password: string; orgName?: string; inviteCode?: string }) =>
  api.post<AuthResponse>('/auth/register', data).then(r => r.data)

export const loginApi = (data: { email: string; password: string }) =>
  api.post<AuthResponse>('/auth/login', data).then(r => r.data)

export const logoutApi = () => api.post('/auth/logout')