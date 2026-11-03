import type { ReactNode } from 'react'
import { Button } from './ui'

export const TOTAL_STEPS = 5

interface ShellProps {
  /** 1..5, or undefined on the summary screen */
  step?: number
  onBack?: () => void
  onLogo?: () => void
  /** Renders a × button on the top-left with title centered. */
  onClose?: () => void
  /** Title shown in the header bar when onClose is set. */
  headerTitle?: string
  /** Optional action rendered on the top-right when onClose is set (e.g. a delete button). */
  headerAction?: ReactNode
  primary?: { label: string; onClick: () => void; disabled?: boolean }
  footerExtra?: ReactNode
  /** Content width from 768 px up. Phones always use the full column (max-w-md). */
  width?: 'form' | 'medium' | 'wide'
  children: ReactNode
}

/** Full class names, so Tailwind can see them. The footer uses the same width as the page surface. */
const WIDTH: Record<NonNullable<ShellProps['width']>, string> = {
  form: 'max-w-md md:max-w-2xl',
  medium: 'max-w-md md:max-w-3xl',
  wide: 'max-w-md md:max-w-3xl lg:max-w-5xl',
}

export function Shell({ width = 'form', step, onBack, onLogo, onClose, headerTitle, headerAction, primary, footerExtra, children }: ShellProps) {
  return (
    <div className="min-h-dvh md:bg-gray-100">
    <div className={`mx-auto flex min-h-dvh flex-col bg-white md:shadow-sm ${WIDTH[width]}`}>
      <header className="sticky top-0 z-10 bg-white px-4 pt-3 pb-2 md:px-8 md:pt-5">
        <div className="flex h-10 items-center justify-between">
          {onClose ? (
            headerAction ?? <div className="size-12" />
          ) : onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="-ml-2 flex min-h-11 items-center gap-1 px-2 font-semibold rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
              aria-label="Zurück"
            >
              <span aria-hidden>←</span> Zurück
            </button>
          ) : onLogo ? (
            <button
              type="button"
              onClick={onLogo}
              className="-ml-1 rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
              aria-label="Zur Startseite"
            >
              <img src="/mvn-logo.svg" alt="mvn.energy" width={66} height={36} className="h-9 w-auto" />
            </button>
          ) : (
            <img src="/mvn-logo.svg" alt="mvn.energy" width={66} height={36} className="h-9 w-auto" />
          )}

          {onClose ? (
            <span className="text-[1.625rem] font-extrabold text-brand-teal">{headerTitle}</span>
          ) : null}

          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="-mr-2 flex size-12 items-center justify-center rounded-lg text-3xl text-brand-teal/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
              aria-label="Schließen"
            >
              ✕
            </button>
          ) : step ? (
            <span className="text-sm font-semibold text-brand-teal/70">
              Schritt {step} von {TOTAL_STEPS}
            </span>
          ) : null}
        </div>
        {step && (
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-line"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={TOTAL_STEPS}
            aria-valuenow={step}
            aria-valuetext={`Schritt ${step} von ${TOTAL_STEPS}`}
          >
            <div className="h-full rounded-full bg-brand-green transition-all" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
          </div>
        )}
      </header>

      <main className={`flex-1 px-4 pt-4 md:px-8 md:pt-6 ${primary ? 'pb-36' : 'pb-24'}`}>{children}</main>

      {primary && (
        <footer className="fixed inset-x-0 bottom-0 z-10 bg-white md:bg-transparent md:before:hidden before:pointer-events-none before:absolute before:inset-x-0 before:-top-8 before:h-8 before:bg-gradient-to-b before:from-transparent before:to-white before:content-['']">
          <div className={`mx-auto space-y-2 bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:border-t md:border-line md:px-8 ${WIDTH[width]}`}>
            {footerExtra}
            <div className="md:mx-auto md:w-80">
              <Button onClick={primary.onClick} disabled={primary.disabled}>
                {primary.label}
              </Button>
            </div>
          </div>
        </footer>
      )}
    </div>
    </div>
  )
}
