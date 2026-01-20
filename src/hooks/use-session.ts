// Manage user session/auth state
import { useEffect } from 'react'
import { useAuth } from './queries'

export const useSession = () => {
  const { user, isLoading } = useAuth()

  useEffect(() => {
    // Session tracking logic
  }, [user])

  return { user, isLoading, isAuthenticated: !!user }
}