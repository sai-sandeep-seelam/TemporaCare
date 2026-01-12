import { NavLink } from 'react-router-dom'
import {
  FiHome,
  FiCalendar,
  FiPackage,
  FiBell,
  FiUser,
  FiX,
} from 'react-icons/fi'
import { useEffect } from 'react'

/**
 * Sidebar Component
 * Side navigation menu
 */
const Sidebar = ({ isOpen, onClose }) => {
  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: FiHome },
    { name: 'Appointments', to: '/appointments', icon: FiCalendar },
    { name: 'Medications', to: '/medications', icon: FiPackage },
    { name: 'Notifications', to: '/notifications', icon: FiBell },
  ]

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-secondary-200 z-20
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Close button (mobile) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 lg:hidden p-2 rounded-lg hover:bg-secondary-100 transition-colors"
          aria-label="Close sidebar"
        >
          <FiX className="h-6 w-6 text-secondary-600" />
        </button>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-secondary-700 hover:bg-secondary-50'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Help section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-secondary-200">
          <div className="bg-primary-50 rounded-lg p-4">
            <h4 className="font-medium text-primary-900 mb-2">Need Help?</h4>
            <p className="text-sm text-primary-700 mb-3">
              Contact our support team for assistance.
            </p>
            <a
              href="mailto:support@healthcare.com"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Get Support →
            </a>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
