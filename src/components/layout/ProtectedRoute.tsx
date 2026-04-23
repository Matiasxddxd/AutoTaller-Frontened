import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import type { UserRole } from '../../types'

interface Props {
  children?: React.ReactNode
  roles?: UserRole[]
}

export const ProtectedRoute = ({ children, roles }: Props) => {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/orders" replace />
  }

  return children ? <>{children}</> : <Outlet />
}