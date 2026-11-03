import { describe, expect, it } from 'vitest'
import { BEG_UW_LIMIT, begHint, mayQualifyForBeg } from './funding'
import { products, type Product } from './products'

const byId = (id: string): Product => {
  const p = products.find((x) => x.id === id)
  if (!p) throw new Error(`Product ${id} not found`)
  return p
}
const withUw = (uw: number): Product => ({ ...byId('FN-K82-3'), uw })

describe('BEG limit', () => {
  it('is 0,95 W/(m²K) (BEG EM Anlage TMA Nr. 1.1)', () => {
    expect(BEG_UW_LIMIT).toBe(0.95)
  })

  it('qualifies Uw 0,95 (limit included)', () => {
    expect(mayQualifyForBeg(withUw(0.95))).toBe(true)
  })

  it('does not qualify Uw 0,96', () => {
    expect(mayQualifyForBeg(withUw(0.96))).toBe(false)
  })

  it('does not qualify Uw 1,0', () => {
    expect(mayQualifyForBeg(withUw(1.0))).toBe(false)
  })

  it('qualifies Uw 0,72', () => {
    expect(mayQualifyForBeg(withUw(0.72))).toBe(true)
  })

  it('does not apply the 1,1 exception for barrier-free windows', () => {
    expect(mayQualifyForBeg(withUw(1.1))).toBe(false)
  })
})

describe('systems from the product list', () => {
  it.each([
    ['FN-K82-3P', true], // Therm 82 Plus, 0,72
    ['FN-HA78-3', true], // Duo 78, 0,82
    ['FN-K82-3', true], // Therm 82, 0,90
    ['FN-H68-3', true], // Nordic 68, 0,95 exactly on the limit
    ['FN-A75-3', false], // Slim 75, 1,0
    ['FN-K70-2', false], // Classic 70, 1,1 and 2-fold
  ])('%s qualifies: %s', (id, expected) => {
    expect(mayQualifyForBeg(byId(id))).toBe(expected)
  })
})

describe('begHint', () => {
  it('is null for Slim 75 (Uw 1,0)', () => {
    expect(begHint(byId('FN-A75-3'))).toBeNull()
  })

  it('is null for Classic 70 (Uw 1,1)', () => {
    expect(begHint(byId('FN-K70-2'))).toBeNull()
  })

  it('is given for Nordic 68 (Uw 0,95)', () => {
    expect(begHint(byId('FN-H68-3'))).not.toBeNull()
  })

  it('writes Uw 0,90 with two decimals and a comma', () => {
    expect(begHint(byId('FN-K82-3'))).toContain('0,90 W/(m²K)')
  })

  it('writes Uw 0,72 with a comma', () => {
    expect(begHint(byId('FN-K82-3P'))).toContain('0,72 W/(m²K)')
  })

  it('never uses a decimal point for the Uw value', () => {
    expect(begHint(byId('FN-K82-3'))).not.toContain('0.90')
  })

  it('says it is no funding promise', () => {
    expect(begHint(byId('FN-K82-3'))).toContain('Eine Förderzusage ist das nicht')
  })

  it('names the application before project start', () => {
    expect(begHint(byId('FN-K82-3'))).toContain('vor Vorhabenbeginn')
  })

  it('mentions the check at the measurement visit', () => {
    expect(begHint(byId('FN-K82-3'))).toContain('Aufmaß')
  })

  it('contains no funding amount in euro or percent', () => {
    const hint = begHint(byId('FN-K82-3')) ?? ''
    expect(hint).not.toMatch(/€|EUR|%|Prozent/)
  })
})
