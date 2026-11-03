import { describe, expect, it } from 'vitest'
import { SLOTS, isoToDate, nextWeekdays, toIso } from './dates'

describe('toIso', () => {
  it('pads month and day with zeros', () => {
    expect(toIso(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('does not pad two-digit values', () => {
    expect(toIso(new Date(2026, 10, 23))).toBe('2026-11-23')
  })
})

describe('isoToDate', () => {
  it('reads year, month and day in local time', () => {
    const d = isoToDate('2026-11-03')
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2026, 10, 3])
  })

  it('round-trips with toIso', () => {
    expect(toIso(isoToDate('2027-02-28'))).toBe('2027-02-28')
  })
})

describe('nextWeekdays', () => {
  // 2026-11-03 is a Tuesday, 2026-11-06 a Friday.
  const isos = (count: number, from: Date) => nextWeekdays(count, from).map(toIso)

  it('starts tomorrow on a weekday', () => {
    expect(isos(2, new Date(2026, 10, 3))).toEqual(['2026-11-04', '2026-11-05'])
  })

  it('skips the weekend after a Friday', () => {
    expect(isos(2, new Date(2026, 10, 6))).toEqual(['2026-11-09', '2026-11-10'])
  })

  it('starts on Monday if today is Saturday', () => {
    expect(isos(1, new Date(2026, 10, 7))).toEqual(['2026-11-09'])
  })

  it('starts on Monday if today is Sunday', () => {
    expect(isos(1, new Date(2026, 10, 8))).toEqual(['2026-11-09'])
  })

  it('returns exactly the requested number of days', () => {
    expect(nextWeekdays(7, new Date(2026, 10, 3))).toHaveLength(7)
  })

  it('returns no weekend day', () => {
    for (const d of nextWeekdays(20, new Date(2026, 10, 3))) {
      expect([0, 6]).not.toContain(d.getDay())
    }
  })

  it('returns an empty list for zero days', () => {
    expect(nextWeekdays(0, new Date(2026, 10, 3))).toEqual([])
  })

  it('crosses a month end', () => {
    // 2026-11-27 is a Friday, 2026-11-30 a Monday
    expect(isos(1, new Date(2026, 10, 27))).toEqual(['2026-11-30'])
  })

  it('crosses a year end', () => {
    // 2026-12-31 is a Thursday, 2027-01-01 a Friday
    expect(isos(2, new Date(2026, 11, 31))).toEqual(['2027-01-01', '2027-01-04'])
  })

  it('ignores the time of day of the start date', () => {
    expect(isos(1, new Date(2026, 10, 3, 23, 59))).toEqual(['2026-11-04'])
  })

  it('does not change the date it was given', () => {
    const from = new Date(2026, 10, 3)
    nextWeekdays(3, from)
    expect(toIso(from)).toBe('2026-11-03')
  })
})

describe('SLOTS', () => {
  it('offers four two-hour slots from 8 to 16 Uhr', () => {
    expect(SLOTS).toEqual(['8–10 Uhr', '10–12 Uhr', '12–14 Uhr', '14–16 Uhr'])
  })
})
