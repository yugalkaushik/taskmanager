import { InputHTMLAttributes, forwardRef } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, Props>(({ label, error, className = '', ...props }, ref) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && <label className="field-label">{label}</label>}
    <input
      ref={ref}
      className={`field-input ${error ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/15' : ''}`}
      {...props}
    />
    {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
  </div>
))

Input.displayName = 'Input'
export default Input