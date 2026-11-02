/** Fake appointment slots for the preview. Not from Fenster Nord's documents. */
export const SLOTS = ['8–10 Uhr', '10–12 Uhr', '12–14 Uhr', '14–16 Uhr']

export const dayFormat = new Intl.DateTimeFormat('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })
export const longDayFormat = new Intl.DateTimeFormat('de-DE', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function toIso(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** The next `count` weekdays, starting tomorrow. */
export function nextWeekdays(count: number, from = new Date()): Date[] {
  const days: Date[] = []
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  while (days.length < count) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0 && d.getDay() !== 6) days.push(new Date(d))
  }
  return days
}

export function isoToDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}
