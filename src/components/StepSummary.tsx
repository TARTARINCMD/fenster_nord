import { isoToDate, longDayFormat } from '../lib/dates'
import { toWindowItems } from '../lib/drafts'
import { FLOOR_LABEL, formatEUR } from '../lib/format'
import { begHint } from '../lib/funding'
import { RULES, calculateQuote } from '../lib/pricing'
import { products } from '../lib/products'
import { Shell } from './Shell'
import { Breakdown, GoodToKnow } from './StepPrice'
import type { StepProps } from './types'
import { Button, Notice, StepTitle } from './ui'

export function StepSummary({ state, dispatch }: StepProps) {
  const items = toWindowItems(state.windows)
  const product = products.find((p) => p.id === state.productId)
  const result =
    items && product ? calculateQuote({ product, windows: items, postcode: state.postcode, floor: state.floor ?? 0 }) : null
  const { contact, appointment, mode } = state

  if (!result || !result.available || !product) {
    return (
      <Shell>
        <Notice tone="warn">Die Zusammenfassung ist nicht mehr verfügbar.</Notice>
        <Button className="mt-4" onClick={() => dispatch({ type: 'reset' })}>
          Neu starten
        </Button>
      </Shell>
    )
  }

  const hint = begHint(product)

  return (
    <Shell>
      <StepTitle
        title={mode === 'appointment' ? 'Ihr Terminwunsch' : 'Ihre Anfrage'}
        subtitle="Zusammenfassung Ihrer Angaben."
      />

      <Notice tone="warn">
        <strong>Vorschau:</strong> Es wurde nichts verschickt und kein Termin gebucht. So würde Ihre Anfrage bei Fenster Nord ankommen.
      </Notice>

      <section className="mt-5 space-y-1 rounded-2xl border-2 border-line p-4">
        <h2 className="font-extrabold">Kontakt</h2>
        <p>{contact.name}</p>
        {contact.phone && <p>Telefon: {contact.phone}</p>}
        {contact.email && <p>E-Mail: {contact.email}</p>}
        {mode === 'appointment' && appointment ? (
          <p className="pt-1 font-semibold">
            Termin für das Aufmaß: {longDayFormat.format(isoToDate(appointment.date))}, {appointment.slot}
          </p>
        ) : (
          contact.timeNote && <p>Wunschzeitraum: {contact.timeNote}</p>
        )}
      </section>

      <section className="mt-3 space-y-1 rounded-2xl border-2 border-line p-4">
        <h2 className="font-extrabold">Ort</h2>
        <p>
          PLZ {state.postcode}, {FLOOR_LABEL[state.floor ?? 0]}
        </p>
      </section>

      <section className="mt-3 rounded-2xl border-2 border-line p-4">
        <h2 className="font-extrabold">Richtpreis (unverbindlich)</h2>
        <p className="mt-1 text-[32px] font-extrabold leading-tight">{formatEUR(result.gross)}</p>
        <p className="text-[15px] text-brand-teal/80">
          inkl. {Math.round(RULES.vatRate * 100)} % USt. · netto {formatEUR(result.net)} · {product.name}
        </p>
        <details className="mt-3">
          <summary className="min-h-8 cursor-pointer font-semibold">Aufschlüsselung</summary>
          <div className="mt-2">
            <Breakdown quote={result} pricePerM2={product.pricePerM2} />
          </div>
        </details>
      </section>

      <div className="mt-3 space-y-3">
        {result.notices.map((n) => (
          <Notice key={n.code} tone="warn">
            {n.text}
          </Notice>
        ))}
        {hint && <Notice tone="good">{hint}</Notice>}
      </div>

      <section className="mt-5">
        <h2 className="mb-2 font-extrabold">So geht es weiter</h2>
        <GoodToKnow />
      </section>

      <div className="mt-6 space-y-2">
        <Button variant="secondary" onClick={() => dispatch({ type: 'go', step: 2 })}>
          Angaben ändern
        </Button>
        <Button variant="ghost" onClick={() => dispatch({ type: 'reset' })}>
          Neu starten
        </Button>
      </div>
    </Shell>
  )
}
