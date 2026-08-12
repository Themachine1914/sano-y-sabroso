import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'whatsapp' | 'ghost' | 'accent'

const variants: Record<Variant, string> = {
  primary:
    'bg-navy-800 text-white shadow-sm shadow-navy-800/15 hover:bg-navy-900 active:bg-navy-900',
  secondary:
    'bg-white text-navy-800 border border-line hover:bg-warm active:bg-warm',
  whatsapp:
    'bg-[#25D366] text-white shadow-sm shadow-[#25D366]/25 hover:bg-[#1ebe57]',
  ghost: 'bg-transparent text-navy-800 hover:bg-warm',
  accent:
    'bg-accent-500 text-white shadow-sm shadow-accent-500/25 hover:bg-accent-600 active:bg-accent-700',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  icon?: ReactNode
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  icon,
  fullWidth,
  className = '',
  children,
  type = 'button',
  ...rest
}: Props) {
  return (
    <button
      type={type}
      className={[
        'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}
