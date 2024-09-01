import './global-polyfill'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {RouterProvider, createRouter} from '@tanstack/react-router'
import {StrictMode} from 'react'
import ReactDOM from 'react-dom/client'
import {ThemeProvider} from './components/theme-provider'
import './index.css'
import {routeTree} from './routeTree.gen'
const queryClient = new QueryClient()

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

function InnerApp() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} defaultPreload="intent" />
    </ThemeProvider>
  )
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <InnerApp />
      </QueryClientProvider>
    </StrictMode>
  )
}
