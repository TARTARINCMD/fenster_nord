import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { StepProps } from './types'
import { Button } from './ui'

/** Every claim on this page comes from Fenster Nord's documents (Preise-und-Produkte, Montagebedingungen) or the task brief. */
const STEPS = [
  ['Ort', 'Postleitzahl und Stockwerk'],
  ['Fenster', 'Größe, Menge und Öffnungsart'],
  ['System', 'Das passende Fenster wählen'],
  ['Richtpreis', 'Mit nachvollziehbarer Aufschlüsselung'],
]

const FACTS = [
  ['Unverbindlich und nachvollziehbar', 'Sie sehen jeden Posten, vom Fenster bis zur Montage.'],
  ['Kostenloses Aufmaß vor Ort', 'Erst danach erhalten Sie einen verbindlichen Preis.'],
  ['Lieferzeit 6 bis 8 Wochen', 'In der Regel ab Aufmaß.'],
  ['Sechs Fenstersysteme', 'Aus Kunststoff, Holz, Holz-Aluminium und Aluminium.'],
]

/** True once the element has scrolled into view (and stays true). Without IntersectionObserver everything is shown. */
function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const el = ref.current
    if (!el || visible) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [visible, threshold])

  return [ref, visible] as const
}

/** Fades up when scrolled into view. Hidden state is a class that is swapped out, so reduced-motion users still see the content. */
function Reveal({
  as: Tag = 'div',
  delay = 0,
  className = '',
  style,
  children,
}: {
  as?: 'div' | 'li'
  delay?: number
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  const [ref, visible] = useInView<HTMLDivElement & HTMLLIElement>()
  return (
    <Tag
      ref={ref}
      className={`${visible ? 'animate-fade-up' : 'opacity-0'} ${className}`}
      style={{ animationDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  )
}

function scrollToAblauf() {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  document.getElementById('ablauf')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
}

export function StepLanding({ dispatch }: StepProps) {
  const [lineRef, lineVisible] = useInView<HTMLOListElement>(0.15)

  return (
    <main>
      {/* First screen: only the name and a slogan. */}
      <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-brand-teal px-6 text-center text-white">
        <img
          src="/favicon.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute -right-16 bottom-24 size-72 rotate-6 opacity-10"
        />
        <h1 className="relative animate-fade-up text-[44px] leading-none font-extrabold">Fenster Nord</h1>
        <p
          className="relative mt-5 animate-fade-up text-xl font-semibold text-brand-yellow"
          style={{ animationDelay: '200ms' }}
        >
          Neue Fenster. Klarer Preis.
        </p>
        <button
          type="button"
          onClick={scrollToAblauf}
          aria-label="Mehr erfahren"
          className="absolute bottom-8 flex min-h-11 animate-fade-up flex-col items-center gap-1 px-4 text-xl font-bold text-white"
          style={{ animationDelay: '700ms' }}
        >
          Mehr erfahren
          <span aria-hidden className="animate-bob text-5xl leading-none">
            ↓
          </span>
        </button>
      </section>

      <div className="mx-auto max-w-md px-4 pt-16 pb-16">
        <section id="ablauf" className="scroll-mt-8">
          <Reveal>
            <h2 className="text-2xl font-extrabold">Der Ablauf</h2>
          </Reveal>
          <ol ref={lineRef} className="relative mt-6 space-y-4">
            {/* The line draws itself when the section comes into view. */}
            <div
              aria-hidden
              className="absolute top-5 bottom-5 left-5 w-0.5 origin-top bg-brand-green/40 transition-transform duration-[1400ms] ease-out"
              style={{ transform: lineVisible ? 'scaleY(1)' : 'scaleY(0)' }}
            />
            {STEPS.map(([title, text], i) => (
              <Reveal key={title} as="li" delay={i * 120} className="relative flex items-center gap-4">
                <span className="relative z-[1] flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-green text-lg font-extrabold text-white">
                  {i + 1}
                </span>
                <span className="rounded-2xl bg-brand-green/10 px-4 py-3">
                  <span className="block font-extrabold">{title}</span>
                  <span className="block text-[15px] text-brand-teal/80">{text}</span>
                </span>
              </Reveal>
            ))}
          </ol>
        </section>

        <section className="mt-16">
          <Reveal>
            <h2 className="text-2xl font-extrabold">Das sollten Sie wissen</h2>
          </Reveal>
          <ul className="mt-6 space-y-3">
            {FACTS.map(([title, text], i) => (
              <Reveal
                key={title}
                as="li"
                delay={i * 100}
                className="rounded-2xl border-2 border-brand-yellow/60 bg-brand-yellow/10 p-4"
              >
                <span className="block font-extrabold">{title}</span>
                <span className="block text-[15px] text-brand-teal/80">{text}</span>
              </Reveal>
            ))}
          </ul>
        </section>

        <Reveal className="mt-12">
          <Button onClick={() => dispatch({ type: 'go', step: 1 })}>Richtpreis berechnen</Button>
          <p className="mt-6 text-center text-xs text-brand-teal/60">
            Demo für eine Bewerbungsaufgabe. Fenster Nord GmbH ist ein fiktives Unternehmen.
          </p>
        </Reveal>
      </div>
    </main>
  )
}
