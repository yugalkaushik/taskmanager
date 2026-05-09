import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
let queue: ((token: string) => void)[] = []

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    original._retry = true
    const refreshToken = useAuthStore.getState().refreshToken

    if (!refreshToken) {
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        queue.push((token: string) => {
          original.headers.Authorization = `Bearer ${token}`
          resolve(api(original))
        })
      })
    }

    isRefreshing = true
    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken })
      const newToken = data.accessToken
      const { user } = useAuthStore.getState()
      if (user) useAuthStore.getState().setAuth(user, newToken, refreshToken)
      queue.forEach(cb => cb(newToken))
      queue = []
      original.headers.Authorization = `Bearer ${newToken}`
      return api(original)
    } catch {
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
      return Promise.reject(error)
    } finally {
      isRefreshing = false
    }
  }
)

export default api