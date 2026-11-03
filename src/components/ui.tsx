import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

const buttonStyles: Record<ButtonVariant, string> = {
  primary: 'bg-brand-yellow text-brand-teal font-extrabold hover:brightness-95',
  secondary: 'bg-brand-teal text-white font-bold hover:brightness-125',
  ghost: 'bg-brand-green/15 text-brand-teal font-bold hover:bg-brand-green/25',
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      type="button"
      className={`min-h-14 w-full rounded-full px-5 text-lg transition duration-100 active:scale-95 active:duration-75 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 ${buttonStyles[variant]} ${className}`}
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
  label: ReactNode
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
      className={`h-14 w-full rounded-2xl bg-gray-100 px-4 text-base outline-none transition placeholder:text-gray-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-brand-green ${
        invalid ? 'ring-2 ring-red-500' : ''
      } ${className}`}
      aria-invalid={invalid || undefined}
      {...props}
    />
  )
}

export function Notice({ tone = 'info', children }: { tone?: 'info' | 'warn' | 'good'; children: ReactNode }) {
  const tones = {
    info: 'bg-brand-yellow/25',
    warn: 'bg-brand-yellow/40',
    good: 'bg-brand-green/15',
  }
  return <div className={`animate-fade-up rounded-xl p-4 text-[0.9375rem] leading-relaxed ${tones[tone]}`}>{children}</div>
}

/** Radio circle: empty ring when not selected, filled green with a check when selected. */
export function RadioDot({ selected }: { selected: boolean; muted?: boolean }) {
  return (
    <span
      aria-hidden
      className={`flex size-7 shrink-0 items-center justify-center rounded-full text-sm leading-none font-extrabold transition-all duration-200 ${
        selected ? 'bg-brand-green text-white' : 'bg-white text-transparent'
      }`}
    >
      <span className={`transition-transform duration-200 ${selected ? 'scale-100' : 'scale-0'}`}>✓</span>
    </span>
  )
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
      className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl p-4 text-left transition duration-100 active:scale-[0.98] active:duration-75 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 ${
        selected ? 'bg-brand-green/15' : 'bg-gray-100'
      }`}
    >
      <span className="min-w-0 flex-1">
        <span className="block font-extrabold">{title}</span>
        {children && <span className="mt-1 block text-[0.9375rem] leading-snug text-brand-teal/80">{children}</span>}
      </span>
      <RadioDot selected={selected} muted={disabled} />
    </button>
  )
}

export function Chip({ onClick, selected = false, children }: { onClick: () => void; selected?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`min-h-11 rounded-full px-4 text-[0.9375rem] font-semibold transition duration-100 active:scale-95 active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 ${
        selected ? 'bg-brand-yellow text-brand-teal' : 'bg-gray-100'
      }`}
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
    <label className="flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-2xl bg-gray-100 p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span>
        <span className="block font-semibold">{title}</span>
        {children && <span className="block text-[0.9375rem] text-brand-teal/80">{children}</span>}
      </span>
      <span aria-hidden className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold transition-all duration-200 ${checked ? 'bg-brand-green text-white' : 'bg-white text-transparent'}`}>
        <span className={`transition-transform duration-200 ${checked ? 'scale-100' : 'scale-0'}`}>✓</span>
      </span>
    </label>
  )
}

export function StepTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-[1.75rem] font-extrabold leading-tight text-brand-teal">{title}</h1>
      {subtitle && <p className="mt-2 text-[1.0625rem] leading-relaxed text-brand-teal/80">{subtitle}</p>}
    </div>
  )
}
