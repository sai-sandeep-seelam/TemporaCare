import { Fragment } from 'react'
import { FiX } from 'react-icons/fi'

/**
 * Modal Component
 * Reusable modal dialog with backdrop
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
}) => {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  }

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 items-center justify-center p-4 overflow-y-auto">
        <div className="w-full flex items-center justify-center">
          <div
            className={`relative bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} animate-fade-in max-h-[90vh] overflow-y-auto`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header - Sticky */}
            {title && (
              <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-secondary-200 z-10">
                <h3 id="modal-title" className="text-xl font-semibold text-secondary-900">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="text-secondary-400 hover:text-secondary-600 transition-colors flex-shrink-0"
                  aria-label="Close modal"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="px-6 py-4">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="sticky bottom-0 bg-secondary-50 flex items-center justify-end gap-3 px-6 py-4 border-t border-secondary-200">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default Modal
