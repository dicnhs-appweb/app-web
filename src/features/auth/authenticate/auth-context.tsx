import React, {createContext, useContext, useEffect, useState} from 'react'
import {useAuthStore, useCheckAuth} from './auth-store'

export const AuthContext = createContext<
  ReturnType<typeof useAuthStore> | undefined
>(undefined)

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const authStore = useAuthStore()
  const [isInitialized, setIsInitialized] = useState(false)
  const checkAuth = useCheckAuth()

  useEffect(() => {
    const initializeAuth = async () => {
      const startTime = Date.now()
      await checkAuth()
      const elapsedTime = Date.now() - startTime
      const minimumLoadingTime = 1000

      if (elapsedTime < minimumLoadingTime) {
        await new Promise(resolve =>
          setTimeout(resolve, minimumLoadingTime - elapsedTime)
        )
      }
      setIsInitialized(true)
    }
    initializeAuth()
  }, [])

  if (!isInitialized) {
    return <AuthenticationLoading />
  }

  return (
    <AuthContext.Provider value={authStore}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default function AuthenticationLoading() {
  return (
    <div className="flex flex-row h-screen justify-center items-center transition-all duration-300 animate-fadeOut">
      <img src="/app-web.png" width={100} height={100} />
    </div>
  )
}
