import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'

// Layout Components
import Layout from './components/layout/Layout'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import Medications from './pages/Medications'
import Notifications from './pages/Notifications'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

/**
 * Main App Component
 * Handles routing
 */
function App() {
  return (
    <Router>
      {/* Toast notifications for user feedback */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#334155',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Landing page as root */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* App Routes */}
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/appointments"
            element={
              <RequireAuth>
                <Appointments />
              </RequireAuth>
            }
          />
          <Route
            path="/medications"
            element={
              <RequireAuth>
                <Medications />
              </RequireAuth>
            }
          />
          <Route
            path="/notifications"
            element={
              <RequireAuth>
                <Notifications />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

function RequireAuth({ children }) {
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null')

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default App
