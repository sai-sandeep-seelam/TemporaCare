import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

/**
 * PrivateRoute Component
 * Protects routes that require authentication
 * Redirects to login if user is not authenticated
 */
const PrivateRoute = () => {
  const { isAuthenticated } = useAuthStore()

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute
