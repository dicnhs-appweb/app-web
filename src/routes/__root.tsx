import {AuthStore} from '@/features/auth/authenticate/auth-store'
import {QueryClient} from '@tanstack/react-query'
import {Outlet, createRootRouteWithContext} from '@tanstack/react-router'
import {TanStackRouterDevtools} from '@tanstack/router-devtools'

interface UserRouteContext {
  queryClient: QueryClient
  auth: AuthStore
}

export const Route = createRootRouteWithContext<UserRouteContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
