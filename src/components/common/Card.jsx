/**
 * Card Component
 * Reusable card container for content
 */
const Card = ({ children, className = '', title, subtitle, actions }) => {
  return (
    <div className={`card ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && <h3 className="text-xl font-semibold text-secondary-900">{title}</h3>}
            {subtitle && <p className="text-sm text-secondary-500 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

export default Card
