import { forwardRef } from 'react'

/**
 * Input Component
 * Reusable input field with label and error handling
 */
const Input = forwardRef(
  (
    {
      label,
      type = 'text',
      error,
      helperText,
      required = false,
      fullWidth = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const widthClass = fullWidth ? 'w-full' : ''

    return (
      <div className={`${widthClass} ${className}`}>
        {label && (
          <label className="label">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={`input ${error ? 'input-error' : ''}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${props.id}-error`}
            className="mt-1 text-sm text-error"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-secondary-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
