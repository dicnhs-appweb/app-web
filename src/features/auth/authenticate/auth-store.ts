import { useQueryClient } from '@tanstack/react-query'
import { create } from 'zustand'
import { checkAuthStatus, login, logout, register } from './authenticate'

interface User {
  id: string
  email: string
}

export interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: Error | null
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated'
  setUser: (user: User | null) => void
  setIsAuthenticated: (isAuthenticated: boolean) => void
  setIsLoading: (isLoading: boolean) => void
  setError: (error: Error | null) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  status: 'idle',
  setUser: (user) => set({ user }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}))

export const useLogin = () => {
  const { setUser, setIsAuthenticated, setIsLoading, setError } = useAuthStore()
  return async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const user = await login({ email, password })
      setUser(user)
      setIsAuthenticated(true)
    } catch (error) {
      setError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  const { setUser, setIsAuthenticated, setIsLoading, setError } = useAuthStore()
  return async () => {
    setIsLoading(true)
    setError(null)
    try {
      await logout()
      setUser(null)
      setIsAuthenticated(false)
      queryClient.invalidateQueries()
    } catch (error) {
      setError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }
}

export const useRegister = () => {
  const { setUser, setIsAuthenticated, setIsLoading, setError } = useAuthStore()
  return async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const user = await register({ email, password })
      setUser(user)
      setIsAuthenticated(true)
    } catch (error) {
      setError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }
}

export const useCheckAuth = () => {
  const { setUser, setIsAuthenticated, setIsLoading, setError } = useAuthStore()
  return async () => {
    setIsLoading(true)
    setError(null)
    try {
      const user = await checkAuthStatus()
      setUser(user)
      setIsAuthenticated(!!user)
    } catch (error) {
      setUser(null)
      setIsAuthenticated(false)
      setError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }
}