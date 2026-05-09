import { useAuthStore } from '../store/authStore'
import { useMutation } from '@tanstack/react-query'
import { loginApi, registerApi, logoutApi } from '../api/auth'
import { useNavigate } from 'react-router-dom'

export const useAuth = () => {
  const { user, accessToken, setAuth, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken)
      navigate('/dashboard')
      setTimeout(() => window.location.reload(), 1)
    },
  })

  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken)
      navigate('/dashboard')
      setTimeout(() => window.location.reload(), 1)
    },
  })

  const logout = async () => {
    await logoutApi().catch(() => null)
    clearAuth()
    navigate('/login')
  }

  return { user, isAuthenticated: !!accessToken, loginMutation, registerMutation, logout }
}