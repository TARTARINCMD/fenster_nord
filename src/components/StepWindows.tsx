import { useState } from 'react'
import { MAX_QUANTITY, isDraftValid, windowErrors, type WindowDraft } from '../lib/drafts'
import { OPENING_LABEL, formatEUR, withVat } from '../lib/format'
import { RULES, type Opening } from '../lib/pricing'
import { Shell } from './Shell'
import type { StepProps } from './types'
import { Chip, ChoiceCard, Field, StepTitle, TextInput, ToggleRow } from './ui'

const TYPICAL_SIZES: { w: number; h: number }[] = [
  { w: 60, h: 60 },
  { w: 100, h: 120 },
  { w: 120, h: 140 },
  { w: 180, h: 140 },
]

const OPENING_HELP: Record<Opening, string> = {
  'dreh-kipp': 'Lässt sich zur Seite drehen und oben kippen. Das ist der Standard und im Preis enthalten.',
  fest: `Lässt sich nicht öffnen. ${Math.round(RULES.fixedDiscount * 100)} % günstiger.`,
  stulp: `Zwei Flügel ohne feste Mittelstrebe (Stulp), beide lassen sich öffnen. Aufpreis ${formatEUR(withVat(RULES.stulpSurcharge))} je Fenster inkl. USt.`,
}

function windowSummary(d: WindowDraft): string {
  const size = d.widthCm && d.heightCm ? `${d.widthCm} × ${d.heightCm} cm` : 'Größe fehlt'
  const extras = [d.shutter && 'Rollladen', d.sill && 'Fensterbank'].filter(Boolean).join(', ')
  return `${size} · ${d.quantity}× · ${OPENING_LABEL[d.opening]}${extras ? ` · ${extras}` : ''}`
}

function WindowForm({
  draft,
  attempted,
  onChange,
}: {
  draft: WindowDraft
  attempted: boolean
  onChange: (patch: Partial<WindowDraft>) => void
}) {
  const errors = windowErrors(draft, attempted)

  return (
    <div className="space-y-5 pt-2 md:grid md:grid-cols-2 md:items-start md:gap-8 md:space-y-0">
      <div className="space-y-5">
      <div>
        <p className="mb-1 font-semibold">Wie groß ist das Fenster?</p>
        <p className="mb-3 text-sm text-brand-teal/70">
          Messen Sie den Rahmen Ihres alten Fensters von außen (Breite × Höhe, in cm). Das genaue Maß prüfen wir beim Aufmaß.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Breite (cm)" error={errors.width}>
            <TextInput
              inputMode="decimal"
              placeholder="120"
              value={draft.widthCm}
              invalid={!!errors.width}
              onChange={(e) => onChange({ widthCm: e.target.value })}
            />
          </Field>
          <Field label="Höhe (cm)" error={errors.height}>
            <TextInput
              inputMode="decimal"
              placeholder="140"
              value={draft.heightCm}
              invalid={!!errors.height}
              onChange={(e) => onChange({ heightCm: e.target.value })}
            />
          </Field>
        </div>
        <div className="mt-3">
          <p className="mb-2 text-sm text-brand-teal/70">Typische Größen:</p>
          <div className="flex flex-wrap gap-2">
            {TYPICAL_SIZES.map((s) => (
              <Chip key={`${s.w}x${s.h}`} onClick={() => onChange({ widthCm: String(s.w), heightCm: String(s.h) })}>
                {s.w} × {s.h}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 font-semibold">Wie viele gleiche Fenster?</p>
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Eins weniger"
            disabled={draft.quantity <= 1}
            onClick={() => onChange({ quantity: draft.quantity - 1 })}
            className="size-14 rounded-xl bg-brand-teal text-2xl font-extrabold text-white transition duration-100 active:scale-95 active:duration-75 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
          >
            −
          </button>
          <span className="min-w-10 text-center text-2xl font-extrabold" aria-live="polite">
            {draft.quantity}
          </span>
          <button
            type="button"
            aria-label="Eins mehr"
            disabled={draft.quantity >= MAX_QUANTITY}
            onClick={() => onChange({ quantity: draft.quantity + 1 })}
            className="size-14 rounded-xl bg-brand-teal text-2xl font-extrabold text-white transition duration-100 active:scale-95 active:duration-75 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
          >
            +
          </button>
        </div>
      </div>

      </div>

      <div className="space-y-5">
      <fieldset>
        <legend className="mb-2 font-semibold">Wie soll sich das Fenster öffnen?</legend>
        <div className="space-y-2">
          {(Object.keys(OPENING_LABEL) as Opening[]).map((o) => (
            <ChoiceCard key={o} selected={draft.opening === o} onClick={() => onChange({ opening: o })} title={OPENING_LABEL[o]}>
              {OPENING_HELP[o]}
            </ChoiceCard>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <p className="font-semibold">Zusätzlich gewünscht? (optional)</p>
        <ToggleRow checked={draft.shutter} onChange={(shutter) => onChange({ shutter })} title="Rollladen">
          Aufsatzrollladen mit Gurtwickler, {formatEUR(withVat(RULES.shutterPerMeter))} je Meter Fensterbreite inkl. USt.
        </ToggleRow>
        <ToggleRow checked={draft.sill} onChange={(sill) => onChange({ sill })} title="Fensterbank innen">
          {formatEUR(withVat(RULES.sillPerMeter))} je Meter inkl. USt. Wir rechnen mit der Fensterbreite, die genaue Länge klären wir beim Aufmaß.
        </ToggleRow>
      </div>
      </div>
    </div>
  )
}

export function StepWindows({ state, dispatch }: StepProps) {
  const [attempted, setAttempted] = useState(false)


  const openWindow = state.windows.find((w) => w.id === state.expandedId) ?? null
  const openIndex = openWindow ? state.windows.indexOf(openWindow) : -1

  function close() {
    dispatch({ type: 'patch', patch: { expandedId: null } })
  }

  function next() {
    const allValid = state.windows.length > 0 && state.windows.every(isDraftValid)
    if (!allValid) {
      setAttempted(true)
      const bad = state.windows.find((w) => !isDraftValid(w))
      if (bad) dispatch({ type: 'patch', patch: { expandedId: bad.id } })
      return
    }
    dispatch({ type: 'go', step: 3 })
  }

  // Full-screen edit view
  if (openWindow !== null) {
    const valid = isDraftValid(openWindow)
    return (
      <Shell
        width="medium"
        onClose={close}
        headerTitle={`Fenster ${openIndex + 1}`}
        headerAction={state.windows.length > 1 ? (
          <button
            type="button"
            onClick={() => { dispatch({ type: 'removeWindow', id: openWindow.id }); close() }}
            aria-label={`Fenster ${openIndex + 1} entfernen`}
            className="-ml-2 min-h-11 rounded-lg px-2 text-sm font-semibold text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
          >
            Entfernen
          </button>
        ) : <div className="size-12" />}
        primary={{ label: 'Fenster speichern', onClick: close, disabled: !valid }}
      >
        <WindowForm
          draft={openWindow}
          attempted={attempted}
          onChange={(patch) => dispatch({ type: 'updateWindow', id: openWindow.id, patch })}
        />
      </Shell>
    )
  }

  return (
    <Shell width="medium" step={2} onBack={() => dispatch({ type: 'go', step: 1 })} primary={{ label: 'Weiter zur Systemwahl', onClick: next }}>
      <StepTitle title="Ihre Fenster" subtitle="Geben Sie jede Fenstergröße einmal an. Gleiche Fenster fassen Sie mit der Menge zusammen." />

      <div className="space-y-4">
        {state.windows.map((w, i) => {
          const valid = isDraftValid(w)
          return (
            <button
              key={w.id}
              type="button"
              onClick={() => dispatch({ type: 'patch', patch: { expandedId: w.id } })}
              aria-label={`Fenster ${i + 1} bearbeiten`}
              className="flex w-full items-center justify-between gap-3 rounded-2xl bg-gray-100 px-4 py-3 text-left transition duration-100 active:scale-[0.98] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
            >
              <div className="min-w-0">
                <p className="font-extrabold">Fenster {i + 1}</p>
                {valid
                  ? <p className="truncate text-[0.9375rem] text-brand-teal/70">{windowSummary(w)}</p>
                  : attempted && <p className="text-[0.9375rem] text-red-400">Angaben unvollständig</p>
                }
              </div>
              <span aria-hidden className="shrink-0 text-xl text-brand-teal/40">›</span>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => dispatch({ type: 'addWindow' })}
        className="mt-3 mx-auto flex items-center gap-2 rounded-2xl bg-gray-100 px-5 py-3 font-bold text-brand-teal transition duration-100 active:scale-[0.98] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
      >
        <span className="text-xl leading-none">+</span> Weiteres Fenster
      </button>
    </Shell>
  )
}
