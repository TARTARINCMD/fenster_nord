import { describe, expect, it } from 'vitest'
import type { WindowItem } from './pricing'
import { products } from './products'
import { evaluateSystems } from './systems'

let counter = 0
function win(partial: Partial<WindowItem> = {}): WindowItem {
  return {
    id: `s${++counter}`,
    widthMm: 1200,
    heightMm: 1400,
    quantity: 1,
    opening: 'dreh-kipp',
    shutter: false,
    sill: false,
    ...partial,
  }
}

const find = (options: ReturnType<typeof evaluateSystems>, id: string) => {
  const o = options.find((x) => x.product.id === id)
  if (!o) throw new Error(`Option ${id} missing`)
  return o
}

describe('evaluateSystems', () => {
  it('returns one option per system', () => {
    expect(evaluateSystems(products, [win()], '20095', 0)).toHaveLength(products.length)
  })

  it('lets a 1200 x 1400 mm window fit every system', () => {
    expect(evaluateSystems(products, [win()], '20095', 0).every((o) => o.fits)).toBe(true)
  })

  it('prices Therm 82 for one window at gross 1.396,58', () => {
    // 663,60 + 510 = 1173,60 net; VAT 222,98
    expect(find(evaluateSystems(products, [win()], '20095', 0), 'FN-K82-3').quote?.gross).toBe(1396.58)
  })

  it('prices Classic 70 for one window at gross 1.226,65', () => {
    // 1,68 * 310 = 520,80; + 510 = 1030,80 net; VAT 195,85 (195,852); gross 1226,65
    expect(find(evaluateSystems(products, [win()], '20095', 0), 'FN-K70-2').quote?.gross).toBe(1226.65)
  })

  it('sorts fitting systems by gross price, cheapest first', () => {
    const grosses = evaluateSystems(products, [win()], '20095', 0).map((o) => o.quote?.gross ?? 0)
    expect(grosses).toEqual([...grosses].sort((a, b) => a - b))
    expect(grosses[0]).toBe(1226.65) // Classic 70, 310 EUR/m²
  })

  it('does not fit a system if the window is wider than its maximum', () => {
    // 2100 mm: Classic (1800), Therm (2000), Therm Plus (2000), Nordic (1800) are too narrow
    const options = evaluateSystems(products, [win({ widthMm: 2100 })], '20095', 0)
    expect(find(options, 'FN-K70-2').fits).toBe(false)
    expect(find(options, 'FN-K82-3').fits).toBe(false)
    expect(find(options, 'FN-K82-3P').fits).toBe(false)
    expect(find(options, 'FN-H68-3').fits).toBe(false)
    expect(find(options, 'FN-HA78-3').fits).toBe(true)
    expect(find(options, 'FN-A75-3').fits).toBe(true)
  })

  it('fits only Slim 75 for a window 2100 x 2500 mm', () => {
    // heights: Therm 2400, Duo 2400, Classic 2200, Nordic 2200; Slim 2600
    const fitting = evaluateSystems(products, [win({ widthMm: 2100, heightMm: 2500 })], '20095', 0).filter((o) => o.fits)
    expect(fitting.map((o) => o.product.id)).toEqual(['FN-A75-3'])
  })

  it('gives no quote for a system that does not fit', () => {
    const options = evaluateSystems(products, [win({ widthMm: 2100 })], '20095', 0)
    expect(find(options, 'FN-K70-2').quote).toBeUndefined()
  })

  it('names the first window that does not fit', () => {
    const options = evaluateSystems(products, [win(), win({ widthMm: 2100 })], '20095', 0)
    expect(find(options, 'FN-K70-2').reason).toMatch(/^Fenster 2 passt nicht\./)
  })

  it('puts systems that do not fit after those that fit', () => {
    const options = evaluateSystems(products, [win({ widthMm: 2100 })], '20095', 0)
    const flags = options.map((o) => o.fits)
    expect(flags).toEqual([true, true, false, false, false, false])
  })

  it('prices the whole order, including every window', () => {
    // 2 x 1200x1400 and 1 x 600x600 on Therm: 2 * 663,60 + 316 = 1643,20; + (450 + 180) = 2273,20 net
    // VAT 431,908 -> 431,91; gross 2705,11
    const options = evaluateSystems(products, [win({ quantity: 2 }), win({ widthMm: 600, heightMm: 600 })], '20095', 0)
    expect(find(options, 'FN-K82-3').quote?.gross).toBe(2705.11)
  })

  it('gives no quote for any system outside the service area', () => {
    const options = evaluateSystems(products, [win()], '26000', 0)
    for (const o of options) {
      expect(o.fits).toBe(false)
      expect(o.quote).toBeUndefined()
    }
  })

  it('passes the floor notice to the quote', () => {
    const q = find(evaluateSystems(products, [win()], '20095', 2), 'FN-K82-3').quote
    expect(q?.notices.map((n) => n.code)).toEqual(['scaffold'])
  })

  it('does not change the product list order of its input', () => {
    const before = products.map((p) => p.id)
    evaluateSystems(products, [win()], '20095', 0)
    expect(products.map((p) => p.id)).toEqual(before)
  })
})
