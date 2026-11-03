import type { ReactNode } from 'react'
import { isoToDate, longDayFormat } from '../lib/dates'
import { toWindowItems } from '../lib/drafts'
import { formatEUR } from '../lib/format'
import { begHint } from '../lib/funding'
import { RULES, calculateQuote } from '../lib/pricing'
import { products } from '../lib/products'
import { Shell } from './Shell'
import { Breakdown } from './StepPrice'
import type { StepProps } from './types'
import { Button, Notice, StepTitle } from './ui'

function FaqItem({ question, children }: { question: string; children: ReactNode }) {
  return (
    <details className="group overflow-hidden rounded-2xl bg-gray-100">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-4 font-semibold [&::-webkit-details-marker]:hidden">
        <span>{question}</span>
        <span className="ml-4 shrink-0 text-xl font-light text-brand-teal/50 transition-transform duration-200 group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="px-4 pb-4 text-[0.9375rem] leading-relaxed text-brand-teal/80">{children}</div>
    </details>
  )
}

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
    <Shell width="wide" onLogo={() => dispatch({ type: 'reset' })}>
      <StepTitle
        title={mode === 'appointment' ? 'Terminwunsch geschickt!' : 'Anfrage verschickt!'}
        subtitle={mode === 'appointment' ? 'Ihr Wunschtermin wurde vorgemerkt.' : 'Wir melden uns in Kürze bei Ihnen.'}
      />

      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-10">
      <div>
      <section className="mt-5 space-y-1 rounded-2xl border-2 border-line p-4 lg:mt-0">
        <h2 className="font-extrabold text-brand-teal">Kontakt</h2>
        <p>{contact.name}</p>
        {contact.phone && <p>Telefon: {contact.phone}</p>}
        {contact.email && <p>E-Mail: {contact.email}</p>}
        {mode === 'appointment' && appointment ? (
          <p className="pt-1 font-semibold">
            Rückruftermin: {longDayFormat.format(isoToDate(appointment.date))}, {appointment.slot}
          </p>
        ) : (
          contact.timeNote && <p>Wunschzeitraum: {contact.timeNote}</p>
        )}
      </section>

      <section className="mt-3 rounded-2xl border-2 border-line p-4">
        <h2 className="font-extrabold text-brand-teal">Richtpreis (unverbindlich)</h2>
        <p className="mt-1 text-[2rem] font-extrabold leading-tight">{formatEUR(result.gross)}</p>
        <p className="text-[0.9375rem] text-brand-teal/80">
          inkl. {Math.round(RULES.vatRate * 100)} % USt. · netto {formatEUR(result.net)} · {product.name}
        </p>
        <details className="mt-3">
          <summary className="min-h-11 cursor-pointer font-semibold">Aufschlüsselung</summary>
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
      </div>

      </div>

      <section className="mt-12 lg:mt-0">
        <h2 className="mb-4 text-[1.75rem] font-extrabold text-brand-teal">FAQ</h2>
        <div className="space-y-2">
          <FaqItem question="Wurde meine Anfrage wirklich verschickt?">
            Dies ist eine Demo-Anwendung. Es wurde nichts verschickt und kein Termin gebucht. So würde Ihre Anfrage bei Fenster Nord ankommen.
          </FaqItem>

          <FaqItem question="Was passiert als Nächstes?">
            Ein Mitarbeiter meldet sich bei Ihnen, um einen Termin für das kostenlose Aufmaß zu vereinbaren. Erst danach erhalten Sie ein verbindliches Angebot.
          </FaqItem>

          <FaqItem question="Wie lange dauert die Lieferung?">
            Die Lieferzeit beträgt in der Regel 6 bis 8 Wochen ab Aufmaß.
          </FaqItem>

          <FaqItem question="Was ist der Uw-Wert?">
            Der Uw-Wert gibt an, wie viel Wärme durch ein komplettes Fenster (Rahmen und Glas) verloren geht – gemessen in W/(m²K). Je niedriger der Wert, desto besser dämmt das Fenster und desto weniger Heizenergie geht verloren. Als Orientierung: Neue Fenster müssen laut Gebäudeenergiegesetz mindestens 1,3 W/(m²K) erreichen. Gute Zweifachverglasung liegt bei bis zu 1,2 W/(m²K), Dreifachverglasung schafft Werte bis zu 0,79 W/(m²K).
          </FaqItem>

          <FaqItem question="Kann ich BEG-Förderung beantragen?">
            {hint ?? 'Fenster mit einem Uw-Wert von ≤ 0,95 W/(m²K) können die technischen Anforderungen der BEG-Förderung erfüllen. Eine Förderzusage ist das nicht: Der Antrag muss vor Vorhabenbeginn gestellt werden, und wir prüfen die Voraussetzungen beim Aufmaß.'}
          </FaqItem>

          <FaqItem question="Welche Farben und Dekore gibt es?">
            Weiß ist Standard. Andere Farben und Dekore sind auf Anfrage erhältlich.
          </FaqItem>

          <FaqItem question="Was ist nicht im Preis enthalten?">
            Malerarbeiten sind nicht enthalten. Der Richtpreis umfasst Fensterlieferung, Ausbau der alten Fenster, Entsorgung und Einbau.
          </FaqItem>

          <FaqItem question="Was muss ich für die Montage vorbereiten?">
            Wir brauchen freien Zugang zu den Fenstern – Möbel bitte mindestens 1,5 m abrücken – sowie einen Stromanschluss (230 V) in der Nähe.
          </FaqItem>
        </div>
      </section>
      </div>

      <div className="mt-6 lg:mx-auto lg:max-w-sm">
        <Button variant="secondary" onClick={() => window.dispatchEvent(new Event('open-chat'))}>
          Im Chat fragen 💬
        </Button>
        <p className="mt-4 text-center text-[0.9375rem] text-brand-teal/60">
          Oder einfach anrufen:{' '}
          <a href="tel:+491111111111" className="font-semibold text-brand-teal underline-offset-2 hover:underline">
            +49 111 1111 111
          </a>
        </p>
      </div>
    </Shell>
  )
}
