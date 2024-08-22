import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {RouterProvider, createRouter} from '@tanstack/react-router'
import {StrictMode} from 'react'
import ReactDOM from 'react-dom/client'
import {AuthProvider} from './features/auth/authenticate/auth-context'
import {useAuthStore} from './features/auth/authenticate/use-auth-store'
import './index.css'
import {routeTree} from './routeTree.gen'

const queryClient = new QueryClient()

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: undefined!,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

function InnerApp() {
  const auth = useAuthStore()
  return (
    <RouterProvider
      router={router}
      context={{
        auth,
      }}
      defaultPreload="intent"
    />
  )
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <InnerApp />
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}
