import { toWindowItems } from '../lib/drafts'
import { formatEUR, formatNumber } from '../lib/format'
import { mayQualifyForBeg } from '../lib/funding'
import { products } from '../lib/products'
import { evaluateSystems } from '../lib/systems'
import { Shell } from './Shell'
import type { StepProps } from './types'
import { ChoiceCard, Notice, StepTitle } from './ui'

export function StepSystem({ state, dispatch }: StepProps) {
  const items = toWindowItems(state.windows)
  const options = items ? evaluateSystems(products, items, state.postcode, state.floor ?? 0) : []
  const selected = options.find((o) => o.product.id === state.productId && o.fits)
  const anyFits = options.some((o) => o.fits)

  return (
    <Shell
      step={3}
      onBack={() => dispatch({ type: 'go', step: 2 })}
      primary={{ label: 'Richtpreis anzeigen', disabled: !selected, onClick: () => dispatch({ type: 'go', step: 4 }) }}
    >
      <StepTitle
        title="Welches Fenster passt zu Ihnen?"
        subtitle="Der Preis gilt für Ihre gesamte Bestellung mit diesem System, inklusive Montage und 19 % USt. Der Uw-Wert zeigt, wie viel Wärme das Fenster durchlässt: je kleiner, desto besser."
      />

      {!anyFits && (
        <Notice tone="warn">
          Mit diesen Maßen passt leider keines unserer Systeme für alle Fenster. Bitte prüfen Sie die Größen oder teilen Sie sehr große Fenster auf.
        </Notice>
      )}

      <div role="radiogroup" className="mt-4 space-y-3">
        {options.map(({ product: p, fits, reason, quote }) => (
          <ChoiceCard
            key={p.id}
            selected={selected?.product.id === p.id}
            disabled={!fits}
            onClick={() => dispatch({ type: 'patch', patch: { productId: p.id } })}
            title={
              <span className="flex items-start justify-between gap-3">
                <span>{p.name}</span>
                {quote && <span className="shrink-0 text-right">{formatEUR(quote.gross)}</span>}
              </span>
            }
          >
            <span className="block">
              {p.material} · {p.glazing} verglast · Uw {formatNumber(p.uw)}
            </span>
            {mayQualifyForBeg(p) && fits && (
              <span className="mt-2 inline-block rounded-full bg-brand-green/20 px-3 py-1 text-sm font-semibold">
                Kann BEG-förderfähig sein
              </span>
            )}
            {!fits && reason && <span className="mt-1 block font-semibold text-red-700">{reason}</span>}
          </ChoiceCard>
        ))}
      </div>
      <p className="mt-4 text-sm text-brand-teal/70">Alle Preise sind unverbindliche Richtpreise inklusive 19 % USt.</p>
    </Shell>
  )
}
