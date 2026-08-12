import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react'

export function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: ReactNode
  hint?: string
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium tracking-[0.12em] text-muted uppercase">
        {label}
      </span>
      {children}
      {hint ? <span className="block text-xs text-muted">{hint}</span> : null}
    </label>
  )
}

const inputClass =
  'w-full min-h-[48px] rounded-xl border border-line bg-warm px-3.5 py-3 text-sm text-navy-800 outline-none transition placeholder:text-muted/50 focus:border-navy-800 focus:ring-2 focus:ring-navy-800/10'

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={inputClass} {...props} />
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${inputClass} min-h-24 resize-y`} {...props} />
}
