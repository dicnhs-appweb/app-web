import {ModeToggle} from '@/components/mode-toggle'
import {QueryClient} from '@tanstack/react-query'
import {Outlet, createRootRouteWithContext} from '@tanstack/react-router'

interface UserRouteContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<UserRouteContext>()({
  component: () => (
    <div className="mx-6">
      <Outlet />
      <div className="fixed z-10 bottom-4 left-4 sm:bottom-6 sm:left-6">
        <ModeToggle />
      </div>
    </div>
  ),
})
