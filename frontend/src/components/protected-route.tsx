import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/lib/auth'

export function ProtectedRoute() {
  const { token } = useAuth()
  return token ? <Outlet /> : <Navigate to="/login" replace />
}

export function PublicOnlyRoute() {
  const { token } = useAuth()
  return token ? <Navigate to="/profile" replace /> : <Outlet />
}
