import {useAuthStore} from '@/features/auth/authenticate/auth-store'
import {Outlet, createFileRoute, redirect} from '@tanstack/react-router'

export const Route = createFileRoute('/_public')({
  beforeLoad: async () => {
    const {isAuthenticated} = useAuthStore.getState()
    if (isAuthenticated) {
      throw redirect({
        to: '/dashboard',
      })
    }
    return null
  },
  component: () => (
    <div className="h-screen">
      <Outlet />
    </div>
  ),
})
