import { ButtonHTMLAttributes } from 'react'
import Spinner from './Spinner'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md'
  loading?: boolean
}

export default function Button({ variant = 'primary', size = 'md', loading, disabled, children, className = '', ...props }: Props) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50'
  const variants = {
    primary: 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 hover:shadow-xl hover:bg-blue-700',
    secondary: 'border border-slate-200 bg-white/80 text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50/70',
    danger: 'bg-red-600 text-white shadow-lg shadow-red-600/20 hover:-translate-y-0.5 hover:shadow-xl hover:bg-red-700',
    ghost: 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900',
  }
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2.5 text-sm' }

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled || loading} {...props}>
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
}