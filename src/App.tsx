// Root component - Wrap with all providers
import { RouterProvider } from 'react-router-dom'
import { QueryProvider } from './providers'
import { ThemeProvider } from './providers'
import { AuthProvider } from './providers'
import { router } from './routes'

function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}

export default App