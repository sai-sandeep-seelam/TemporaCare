import { Link } from 'react-router-dom'
import { FiMenu, FiBell, FiUser, FiLogOut } from 'react-icons/fi'
import { useState, useRef, useEffect } from 'react'

/**
 * Header Component
 * Top navigation bar with user menu and notifications
 */
const Header = ({ onMenuClick }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const userMenuRef = useRef(null)
  const notificationRef = useRef(null)

  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null')
  
  const unreadCount = 0

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    window.location.href = '/login'
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-secondary-200 z-30">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left side - Logo and menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary-100 transition-colors"
            aria-label="Toggle menu"
          >
            <FiMenu className="h-6 w-6 text-secondary-600" />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
  <img
    src="/temporacare.png"
    alt="TemporaCare Logo"
    className="h-12 w-12 object-contain"
  />
</div>

            <span className="hidden sm:block text-xl font-bold text-secondary-900">
              TemporaCare
            </span>
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg hover:bg-secondary-100 transition-colors"
                  aria-label="Notifications"
                >
                  <FiBell className="h-6 w-6 text-secondary-600" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 bg-error rounded-full text-xs text-white flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-secondary-200 py-2">
                    <div className="px-4 py-2 border-b border-secondary-200">
                      <h3 className="font-semibold text-secondary-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {unreadCount > 0 ? (
                        <div className="px-4 py-2">
                          <p className="text-sm text-secondary-600">
                            You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                          </p>
                        </div>
                      ) : (
                        <div className="px-4 py-8 text-center">
                          <p className="text-sm text-secondary-500">No new notifications</p>
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-2 border-t border-secondary-200">
                      <Link
                        to="/notifications"
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        onClick={() => setShowNotifications(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary-100 transition-colors"
                  aria-label="User menu"
                >
                  <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <FiUser className="h-5 w-5 text-primary-600" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-secondary-900">
                    {user?.firstName} {user?.lastName}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 max-w-xs bg-white rounded-lg shadow-lg border border-secondary-200 py-2">
                    <div className="px-4 py-2 border-b border-secondary-200 space-y-0.5">
                      <p className="font-medium text-secondary-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-sm text-secondary-500 break-all leading-snug">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FiUser className="h-4 w-4" />
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-error hover:bg-red-50 transition-colors"
                    >
                      <FiLogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
