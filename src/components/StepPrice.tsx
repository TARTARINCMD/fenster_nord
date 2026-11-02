import type { ReactNode } from 'react'
import { toWindowItems } from '../lib/drafts'
import { OPENING_LABEL, cmText, formatEUR, formatNumber } from '../lib/format'
import { begHint } from '../lib/funding'
import { RULES, calculateQuote, type Quote } from '../lib/pricing'
import { products } from '../lib/products'
import { Shell } from './Shell'
import type { StepProps } from './types'
import { Button, Notice, StepTitle } from './ui'

export function Row({ label, sub, value, bold }: { label: ReactNode; sub?: ReactNode; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-start justify-between gap-4 py-2 ${bold ? 'font-extrabold' : ''}`}>
      <div>
        <div>{label}</div>
        {sub && <div className="text-sm font-normal text-brand-teal/70">{sub}</div>}
      </div>
      <div className="shrink-0 text-right">{value}</div>
    </div>
  )
}

/** Traceable breakdown. All single items net, then VAT, then gross. */
export function Breakdown({ quote, pricePerM2 }: { quote: Quote; pricePerM2: number }) {
  return (
    <div className="divide-y divide-line">
      {quote.lines.map((l) => (
        <Row
          key={l.windowId}
          label={`${l.quantity}× ${cmText(l.widthMm)} × ${cmText(l.heightMm)} cm, ${OPENING_LABEL[l.opening]}`}
          sub={[
            `${formatNumber(l.billedAreaM2)} m² × ${formatNumber(pricePerM2, 0)} €/m²`,
            l.billedAreaM2 > l.areaM2 ? `(Mindestfläche ${formatNumber(RULES.minAreaM2, 1)} m²)` : '',
            l.opening === 'fest' ? `− ${Math.round(RULES.fixedDiscount * 100)} %` : '',
            l.opening === 'stulp' ? `+ ${formatEUR(RULES.stulpSurcharge)} Stulp` : '',
          ]
            .filter(Boolean)
            .join(' ')}
          value={formatEUR(l.windowNet)}
        />
      ))}
      {quote.volumeDiscountNet > 0 && (
        <Row
          label={`Mengenrabatt ${Math.round(RULES.volumeDiscount * 100)} %`}
          sub={`ab ${RULES.volumeThreshold} Fenstern, nur auf die Fenster`}
          value={`− ${formatEUR(quote.volumeDiscountNet)}`}
        />
      )}
      {quote.shuttersNet > 0 && (
        <Row label="Rollläden" sub={`${formatEUR(RULES.shutterPerMeter)} je Meter Breite`} value={formatEUR(quote.shuttersNet)} />
      )}
      <Row
        label="Montagepauschale"
        sub="Anfahrt, Baustelleneinrichtung, Abdeckarbeiten"
        value={formatEUR(quote.installationFlatNet)}
      />
      <Row
        label="Ausbau und Entsorgung der alten Fenster"
        sub={`${quote.windowCount} × ${formatEUR(RULES.removalPerWindow)}`}
        value={formatEUR(quote.removalNet)}
      />
      {quote.sillsNet > 0 && (
        <Row label="Fensterbank innen" sub={`${formatEUR(RULES.sillPerMeter)} je Meter`} value={formatEUR(quote.sillsNet)} />
      )}
      <Row label="Summe netto" value={formatEUR(quote.net)} bold />
      <Row label={`Umsatzsteuer ${Math.round(RULES.vatRate * 100)} %`} value={formatEUR(quote.vat)} />
      <Row label="Gesamt brutto" value={formatEUR(quote.gross)} bold />
    </div>
  )
}

export function GoodToKnow() {
  return (
    <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed">
      <li>Das Aufmaß vor Ort ist kostenlos. Erst danach gibt es einen verbindlichen Preis.</li>
      <li>Die Lieferzeit beträgt in der Regel 6 bis 8 Wochen ab Aufmaß.</li>
      <li>Weiß ist Standard. Andere Farben und Dekore gibt es auf Anfrage.</li>
      <li>Malerarbeiten sind nicht enthalten.</li>
      <li>Für die Montage brauchen wir freien Zugang zu den Fenstern, Möbel mindestens 1,5 m abgerückt und einen Stromanschluss (230 V) in der Nähe.</li>
    </ul>
  )
}

export function StepPrice({ state, dispatch }: StepProps) {
  const items = toWindowItems(state.windows)
  const product = products.find((p) => p.id === state.productId)
  const result =
    items && product ? calculateQuote({ product, windows: items, postcode: state.postcode, floor: state.floor ?? 0 }) : null

  if (!result || !result.available || !product) {
    return (
      <Shell step={4} onBack={() => dispatch({ type: 'go', step: 3 })}>
        <Notice tone="warn">Für diese Angaben ist kein Richtpreis möglich. Bitte prüfen Sie Ihre Eingaben.</Notice>
      </Shell>
    )
  }

  const hint = begHint(product)

  return (
    <Shell
      step={4}
      onBack={() => dispatch({ type: 'go', step: 3 })}
      primary={{ label: 'Kostenloses Aufmaß anfragen', onClick: () => dispatch({ type: 'go', step: 5 }) }}
    >
      <StepTitle title="Ihr Richtpreis" />
      <div className="rounded-2xl bg-brand-teal p-5 text-white">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-yellow">Unverbindlicher Richtpreis</p>
        <p className="mt-1 text-[40px] font-extrabold leading-tight">{formatEUR(result.gross)}</p>
        <p className="mt-1 text-[15px]">
          inkl. {Math.round(RULES.vatRate * 100)} % USt. · netto {formatEUR(result.net)}
        </p>
        <p className="mt-3 text-[15px] opacity-90">
          {result.windowCount} Fenster mit {product.name}, inklusive Ausbau, Entsorgung und Einbau.
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {result.notices.map((n) => (
          <Notice key={n.code} tone="warn">
            {n.text}
          </Notice>
        ))}
        {hint && <Notice tone="good">{hint}</Notice>}
      </div>

      <details className="mt-5 rounded-xl border-2 border-line p-4" open>
        <summary className="min-h-8 cursor-pointer font-extrabold">So setzt sich der Preis zusammen</summary>
        <div className="mt-2">
          <Breakdown quote={result} pricePerM2={product.pricePerM2} />
        </div>
      </details>

      <details className="mt-3 rounded-xl border-2 border-line p-4">
        <summary className="min-h-8 cursor-pointer font-extrabold">Gut zu wissen</summary>
        <div className="mt-3">
          <GoodToKnow />
        </div>
      </details>

      <div className="mt-4">
        <Button variant="ghost" onClick={() => dispatch({ type: 'go', step: 2 })}>
          Angaben ändern
        </Button>
      </div>
    </Shell>
  )
}
