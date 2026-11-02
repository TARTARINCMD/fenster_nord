import { useState } from 'react'
import {
  MAX_QUANTITY,
  isDraftValid,
  parseCm,
  windowErrors,
  type WindowDraft,
} from '../lib/drafts'
import { OPENING_LABEL, formatEUR, withVat } from '../lib/format'
import { RULES, type Opening } from '../lib/pricing'
import { Shell } from './Shell'
import type { StepProps } from './types'
import { Button, Chip, ChoiceCard, Field, StepTitle, TextInput, ToggleRow } from './ui'

/** Typical sizes in cm. Only a shortcut that prefills the form, no pricing impact. */
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

function summary(d: WindowDraft): string {
  const size = d.widthCm && d.heightCm ? `${d.widthCm} × ${d.heightCm} cm` : 'Größe fehlt'
  const extras = [d.shutter && 'Rollladen', d.sill && 'Fensterbank'].filter(Boolean).join(', ')
  return `${size} · ${d.quantity}× · ${OPENING_LABEL[d.opening]}${extras ? ` · ${extras}` : ''}`
}

interface CardProps {
  draft: WindowDraft
  index: number
  expanded: boolean
  attempted: boolean
  canRemove: boolean
  onToggle: () => void
  onChange: (patch: Partial<WindowDraft>) => void
  onRemove: () => void
}

function WindowCard({ draft, index, expanded, attempted, canRemove, onToggle, onChange, onRemove }: CardProps) {
  const errors = windowErrors(draft, attempted)
  const valid = isDraftValid(draft)

  if (!expanded) {
    return (
      <div className={`rounded-2xl border-2 p-4 ${valid ? 'border-line' : 'border-red-600'}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-extrabold">Fenster {index + 1}</p>
            <p className="text-[15px] text-brand-teal/80">{summary(draft)}</p>
            {!valid && <p className="mt-1 text-sm font-semibold text-red-700">Bitte vervollständigen Sie dieses Fenster.</p>}
          </div>
          <button type="button" onClick={onToggle} className="min-h-11 shrink-0 px-2 font-semibold underline underline-offset-4">
            Bearbeiten
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 rounded-2xl border-2 border-brand-green p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Fenster {index + 1}</h2>
        {canRemove && (
          <button type="button" onClick={onRemove} className="min-h-11 px-2 font-semibold text-red-700 underline underline-offset-4">
            Entfernen
          </button>
        )}
      </div>

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
            className="size-14 rounded-xl border-2 border-brand-teal text-2xl font-extrabold disabled:opacity-30"
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
            className="size-14 rounded-xl border-2 border-brand-teal text-2xl font-extrabold disabled:opacity-30"
          >
            +
          </button>
        </div>
      </div>

      <fieldset>
        <legend className="mb-2 font-semibold">Wie soll sich das Fenster öffnen?</legend>
        <div role="radiogroup" className="space-y-2">
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

      {valid && (
        <Button variant="secondary" onClick={onToggle}>
          Fertig
        </Button>
      )}
    </div>
  )
}

export function StepWindows({ state, dispatch }: StepProps) {
  const [attempted, setAttempted] = useState(false)
  const allValid = state.windows.length > 0 && state.windows.every(isDraftValid)

  function next() {
    if (!allValid) {
      setAttempted(true)
      // open the first window that needs attention
      const bad = state.windows.find((w) => !isDraftValid(w))
      if (bad) dispatch({ type: 'patch', patch: { expandedId: bad.id } })
      return
    }
    dispatch({ type: 'go', step: 3 })
  }

  const last = state.windows[state.windows.length - 1]
  const lastSize = last && parseCm(last.widthCm) && parseCm(last.heightCm) ? `${last.widthCm} × ${last.heightCm} cm` : null

  return (
    <Shell step={2} onBack={() => dispatch({ type: 'go', step: 1 })} primary={{ label: 'Weiter zur Systemwahl', onClick: next }}>
      <StepTitle title="Ihre Fenster" subtitle="Geben Sie jedes Fenster einmal an. Gleiche Fenster fassen Sie mit der Menge zusammen." />
      <div className="space-y-3">
        {state.windows.map((w, i) => (
          <WindowCard
            key={w.id}
            draft={w}
            index={i}
            expanded={state.expandedId === w.id}
            attempted={attempted}
            canRemove={state.windows.length > 1}
            onToggle={() => dispatch({ type: 'patch', patch: { expandedId: state.expandedId === w.id ? null : w.id } })}
            onChange={(patch) => dispatch({ type: 'updateWindow', id: w.id, patch })}
            onRemove={() => dispatch({ type: 'removeWindow', id: w.id })}
          />
        ))}
      </div>
      <div className="mt-4 space-y-2">
        <Button variant="secondary" onClick={() => dispatch({ type: 'addWindow', copyLast: false })}>
          + Weiteres Fenster
        </Button>
        {lastSize && (
          <Button variant="ghost" onClick={() => dispatch({ type: 'addWindow', copyLast: true })}>
            Wie Fenster {state.windows.length} ({lastSize}) noch einmal hinzufügen
          </Button>
        )}
      </div>
    </Shell>
  )
}
