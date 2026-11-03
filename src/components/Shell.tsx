import type { ReactNode } from 'react'
import { Button } from './ui'

export const TOTAL_STEPS = 5

interface ShellProps {
  /** 1..5, or undefined on the summary screen */
  step?: number
  onBack?: () => void
  onLogo?: () => void
  primary?: { label: string; onClick: () => void; disabled?: boolean }
  footerExtra?: ReactNode
  children: ReactNode
}

export function Shell({ step, onBack, onLogo, primary, footerExtra, children }: ShellProps) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col">
      <header className="sticky top-0 z-10 bg-white px-4 pt-3 pb-2">
        <div className="flex h-10 items-center justify-between">
          {onBack ? (
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
          {step && (
            <span className="text-sm font-semibold text-brand-teal/70">
              Schritt {step} von {TOTAL_STEPS}
            </span>
          )}
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

      <main className={`flex-1 px-4 pt-4 ${primary ? 'pb-36' : 'pb-24'}`}>{children}</main>

      {primary && (
        <footer className="fixed inset-x-0 bottom-0 z-10 bg-white before:pointer-events-none before:absolute before:inset-x-0 before:-top-8 before:h-8 before:bg-gradient-to-b before:from-transparent before:to-white before:content-['']">
          <div className="mx-auto max-w-md space-y-2 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {footerExtra}
            <Button onClick={primary.onClick} disabled={primary.disabled}>
              {primary.label}
            </Button>
          </div>
        </footer>
      )}
    </div>
  )
}
