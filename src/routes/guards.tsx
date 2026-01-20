// Route guards
import { Navigate } from 'react-router-dom'
import { useAuthContext } from '@/providers'

export const AuthGuard = ({ children }) => {
  const { isAuthenticated } = useAuthContext()
  return isAuthenticated ? children : <Navigate to="/login" />
}

export const RoleGuard = ({ children, allowedRoles }) => {
  const { user } = useAuthContext()
  return allowedRoles.includes(user?.role) ? children : <Navigate to="/403" />
}