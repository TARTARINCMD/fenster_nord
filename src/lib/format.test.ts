import { describe, expect, it } from 'vitest'
import { FLOOR_LABEL, OPENING_LABEL, cmText, formatEUR, formatNumber, withVat } from './format'

// Intl uses a no-break space before the euro sign. Compare with a normal space.
const plain = (s: string) => s.replace(/ /g, ' ')

describe('formatEUR', () => {
  it('formats fixture 1 as 663,60 €', () => {
    expect(plain(formatEUR(663.6))).toBe('663,60 €')
  })

  it('uses a point as thousands separator (fixture 2 gross)', () => {
    expect(plain(formatEUR(2988.92))).toBe('2.988,92 €')
  })

  it('always shows two decimals', () => {
    expect(plain(formatEUR(450))).toBe('450,00 €')
  })

  it('formats zero', () => {
    expect(plain(formatEUR(0))).toBe('0,00 €')
  })
})

describe('formatNumber', () => {
  it('uses two decimals with a comma by default', () => {
    expect(formatNumber(1.68)).toBe('1,68')
  })

  it('respects the number of digits', () => {
    expect(formatNumber(0.8, 1)).toBe('0,8')
  })

  it('formats zero digits without a decimal part', () => {
    expect(formatNumber(1200, 0)).toBe('1.200')
  })
})

describe('withVat', () => {
  it('turns net 2.511,70 into gross 2.988,92 (fixture 2)', () => {
    // 2511.70 * 1.19 = 2988.923 -> 2988.92
    expect(withVat(2511.7)).toBe(2988.92)
  })

  it('adds 19 % to 100 EUR', () => {
    expect(withVat(100)).toBe(119)
  })

  it('rounds to cents', () => {
    // 10.01 * 1.19 = 11.9119 -> 11.91
    expect(withVat(10.01)).toBe(11.91)
  })
})

describe('labels', () => {
  it('names the three opening types in German', () => {
    expect(OPENING_LABEL).toEqual({
      'dreh-kipp': 'Dreh-Kipp',
      fest: 'Festverglasung',
      stulp: 'Zweiflügelig mit Stulp',
    })
  })

  it('names floors 0 to 3', () => {
    expect(FLOOR_LABEL[0]).toBe('Erdgeschoss')
    expect(FLOOR_LABEL[1]).toBe('1. Obergeschoss')
    expect(FLOOR_LABEL[2]).toBe('2. Obergeschoss')
    expect(FLOOR_LABEL[3]).toBe('3. Obergeschoss oder höher')
  })
})

describe('cmText', () => {
  it('converts 1200 mm to "120"', () => {
    expect(cmText(1200)).toBe('120')
  })

  it('converts 1205 mm to "120,5" with a comma', () => {
    expect(cmText(1205)).toBe('120,5')
  })

  it('converts 450 mm to "45"', () => {
    expect(cmText(450)).toBe('45')
  })
})
