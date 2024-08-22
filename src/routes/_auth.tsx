import {useAuthStore} from '@/features/auth/authenticate/use-auth-store'
import {Outlet, createFileRoute, redirect} from '@tanstack/react-router'
import Lenis from 'lenis'
import {useEffect} from 'react'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({location}) => {
    const {isAuthenticated} = useAuthStore.getState()
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
    return null
  },
  component: AuthenticatedView,
})

function AuthenticatedView() {
  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    })
    function raf(time: number) {
      lenisInstance.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => {
      lenisInstance.destroy()
    }
  }, [])
  return (
    <div className="h-screen px-6 py-6 sm:container">
      <Outlet />
    </div>
  )
}
