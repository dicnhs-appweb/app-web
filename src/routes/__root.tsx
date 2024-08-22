import {AuthStore} from '@/features/auth/authenticate/use-auth-store'
import {QueryClient} from '@tanstack/react-query'
import {Outlet, createRootRouteWithContext} from '@tanstack/react-router'

interface UserRouteContext {
  queryClient: QueryClient
  auth: AuthStore
}

export const Route = createRootRouteWithContext<UserRouteContext>()({
  component: () => (
    <>
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
})
