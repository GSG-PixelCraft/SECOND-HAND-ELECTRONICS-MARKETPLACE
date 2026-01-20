// Smart component - Handles auth logic
import { useAuth } from '@/hooks/queries'
import { LoginForm } from '@/components/forms'

export const AuthContainer = () => {
  const { login, isLoading } = useAuth()

  const handleLogin = (data) => {
    login(data)
  }

  return <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
}