import api from './axios'
import { DashboardStats } from '../types'

export const getStatsApi = () => api.get<DashboardStats>('/dashboard/stats').then(r => r.data)