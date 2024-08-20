import {useAuthStore} from '@/features/auth/authenticate/auth-store'
import {Outlet, createFileRoute, redirect} from '@tanstack/react-router'

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
  component: () => (
    <div className="container h-screen">
      <Outlet />
    </div>
  ),
})
