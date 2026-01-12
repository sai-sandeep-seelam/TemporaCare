/**
 * Badge Component
 * Displays status badges with different variants
 */
const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variantClasses = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
  }

  const classes = `badge ${variantClasses[variant]} ${className}`

  return <span className={classes}>{children}</span>
}

export default Badge
