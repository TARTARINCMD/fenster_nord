import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

const buttonStyles: Record<ButtonVariant, string> = {
  primary: 'bg-brand-yellow text-brand-teal font-extrabold hover:brightness-95',
  secondary: 'border-2 border-brand-teal text-brand-teal font-semibold bg-white',
  ghost: 'text-brand-teal font-semibold underline underline-offset-4',
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      type="button"
      className={`min-h-14 w-full rounded-xl px-5 text-lg transition disabled:cursor-not-allowed disabled:opacity-40 ${buttonStyles[variant]} ${className}`}
      {...props}
    />
  )
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-semibold">{label}</span>
      {hint && <span className="mb-2 block text-sm text-brand-teal/70">{hint}</span>}
      {children}
      {error && (
        <span role="alert" className="mt-1 block text-sm font-semibold text-red-700">
          {error}
        </span>
      )}
    </label>
  )
}

export function TextInput({ invalid, className = '', ...props }: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      className={`h-14 w-full rounded-xl border-2 bg-white px-4 text-base outline-none focus:border-brand-green ${
        invalid ? 'border-red-600' : 'border-line'
      } ${className}`}
      aria-invalid={invalid || undefined}
      {...props}
    />
  )
}

export function Notice({ tone = 'info', children }: { tone?: 'info' | 'warn' | 'good'; children: ReactNode }) {
  const tones = {
    info: 'border-brand-teal/20 bg-brand-teal/5',
    warn: 'border-brand-yellow bg-brand-yellow/20',
    good: 'border-brand-green/40 bg-brand-green/10',
  }
  return <div className={`rounded-xl border-2 p-4 text-[15px] leading-relaxed ${tones[tone]}`}>{children}</div>
}

/** Big tappable option, used like a radio button. */
export function ChoiceCard({
  selected,
  disabled,
  onClick,
  title,
  children,
}: {
  selected: boolean
  disabled?: boolean
  onClick: () => void
  title: ReactNode
  children?: ReactNode
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onClick}
      className={`block min-h-14 w-full rounded-xl border-2 p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
        selected ? 'border-brand-green bg-brand-green/10' : 'border-line bg-white'
      }`}
    >
      <span className="block font-extrabold">{title}</span>
      {children && <span className="mt-1 block text-[15px] leading-snug text-brand-teal/80">{children}</span>}
    </button>
  )
}

export function Chip({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-11 rounded-full border-2 border-line bg-white px-4 text-[15px] font-semibold active:bg-brand-yellow/30"
    >
      {children}
    </button>
  )
}

export function ToggleRow({
  checked,
  onChange,
  title,
  children,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  title: string
  children?: ReactNode
}) {
  return (
    <label className="flex min-h-14 cursor-pointer items-start gap-3 rounded-xl border-2 border-line bg-white p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-6 shrink-0 accent-brand-green"
      />
      <span>
        <span className="block font-semibold">{title}</span>
        {children && <span className="block text-[15px] text-brand-teal/80">{children}</span>}
      </span>
    </label>
  )
}

export function StepTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-[28px] font-extrabold leading-tight">{title}</h1>
      {subtitle && <p className="mt-2 text-[17px] leading-relaxed text-brand-teal/80">{subtitle}</p>}
    </div>
  )
}
