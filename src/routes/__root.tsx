import {QueryClient} from '@tanstack/react-query'
import {Outlet, createRootRouteWithContext} from '@tanstack/react-router'

interface UserRouteContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<UserRouteContext>()({
  component: () => (
    <div className="mx-6">
      <Outlet />
    </div>
  ),
})
