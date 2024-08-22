import React, {createContext, useContext, useEffect, useState} from 'react'
import {useAuthStore, useCheckAuth} from './use-auth-store'

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!isInitialized) {
    return <AuthenticationLoading />
  }

  return (
    <AuthContext.Provider value={authStore}>{children}</AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default function AuthenticationLoading() {
  return (
    <div className="flex flex-row items-center justify-center h-screen transition-all duration-300 animate-fadeOut">
      <img src="/app-web.png" width={100} height={100} />
    </div>
  )
}
