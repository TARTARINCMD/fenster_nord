import { describe, expect, it } from 'vitest'
import { products, type Product } from './products'
import {
  SCAFFOLD_FROM_FLOOR,
  SERVICE_AREA,
  TWO_PERSON_AREA_MM2,
  checkGlobalHeight,
  checkGlobalWidth,
  checkSize,
  getNotices,
  getPostcodeStatus,
} from './validation'

const byId = (id: string): Product => {
  const p = products.find((x) => x.id === id)
  if (!p) throw new Error(`Product ${id} not found`)
  return p
}
const win = (widthMm: number, heightMm: number, quantity = 1) => ({ widthMm, heightMm, quantity })
const codes = (n: ReturnType<typeof getNotices>) => n.map((x) => x.code)

describe('constants from Montagebedingungen', () => {
  it('has the service area 20000 to 25999', () => {
    expect(SERVICE_AREA).toEqual({ min: 20000, max: 25999 })
  })

  it('has the two-person limit at 3,0 m²', () => {
    expect(TWO_PERSON_AREA_MM2).toBe(3_000_000)
  })

  it('has the scaffold hint from the 2nd floor', () => {
    expect(SCAFFOLD_FROM_FLOOR).toBe(2)
  })
})

describe('getPostcodeStatus', () => {
  it('rejects 19999 as outside the service area', () => {
    expect(getPostcodeStatus('19999')).toBe('outside-service-area')
  })

  it('accepts 20000', () => {
    expect(getPostcodeStatus('20000')).toBe('ok')
  })

  it('accepts 25999', () => {
    expect(getPostcodeStatus('25999')).toBe('ok')
  })

  it('rejects 26000 as outside the service area', () => {
    expect(getPostcodeStatus('26000')).toBe('outside-service-area')
  })

  it('accepts a postcode in Hamburg (20095)', () => {
    expect(getPostcodeStatus('20095')).toBe('ok')
  })

  it('ignores surrounding spaces', () => {
    expect(getPostcodeStatus(' 22305 ')).toBe('ok')
  })

  it('treats a leading zero postcode (01067) as outside the service area', () => {
    expect(getPostcodeStatus('01067')).toBe('outside-service-area')
  })

  it.each(['', '2009', '200950', 'abcde', '2009a', '20 095', '20095.5', '-2000'])(
    'treats "%s" as invalid',
    (value) => {
      expect(getPostcodeStatus(value)).toBe('invalid')
    },
  )
})

describe('getNotices', () => {
  const ok = { postcode: '20095', floor: 0 }

  it('gives no notice for a normal order', () => {
    expect(getNotices({ ...ok, windows: [win(1200, 1400)] })).toEqual([])
  })

  it('gives no two-person notice at exactly 3,0 m²', () => {
    // 2000 x 1500 mm = 3,0 m²
    expect(codes(getNotices({ ...ok, windows: [win(2000, 1500)] }))).not.toContain('two-person')
  })

  it('gives a two-person notice just above 3,0 m²', () => {
    // 2001 x 1500 mm = 3,0015 m²
    expect(codes(getNotices({ ...ok, windows: [win(2001, 1500)] }))).toContain('two-person')
  })

  it('gives a two-person notice for 3,2 m²', () => {
    // 2000 x 1600 mm = 3,2 m²
    expect(codes(getNotices({ ...ok, windows: [win(2000, 1600)] }))).toEqual(['two-person'])
  })

  it('checks the area of one element, not the sum of all windows', () => {
    // 3 x 1,68 m² = 5,04 m² in total, but every element is below 3,0 m²
    expect(codes(getNotices({ ...ok, windows: [win(1200, 1400, 3)] }))).toEqual([])
  })

  it('ignores a big window with quantity 0', () => {
    expect(getNotices({ ...ok, windows: [win(2400, 2400, 0)] })).toEqual([])
  })

  it('gives no scaffold notice on the 1st floor', () => {
    expect(codes(getNotices({ postcode: '20095', floor: 1, windows: [win(1200, 1400)] }))).toEqual([])
  })

  it('gives a scaffold notice on the 2nd floor', () => {
    expect(codes(getNotices({ postcode: '20095', floor: 2, windows: [win(1200, 1400)] }))).toEqual(['scaffold'])
  })

  it('gives a scaffold notice above the 2nd floor', () => {
    expect(codes(getNotices({ postcode: '20095', floor: 3, windows: [win(1200, 1400)] }))).toEqual(['scaffold'])
  })

  it('gives an outside-service-area notice for 26000', () => {
    expect(codes(getNotices({ postcode: '26000', floor: 0, windows: [win(1200, 1400)] }))).toEqual([
      'outside-service-area',
    ])
  })

  it('gives an outside-service-area notice for 19999', () => {
    expect(codes(getNotices({ postcode: '19999', floor: 0, windows: [win(1200, 1400)] }))).toEqual([
      'outside-service-area',
    ])
  })

  it('gives no outside-service-area notice for 20000 and 25999', () => {
    for (const postcode of ['20000', '25999']) {
      expect(getNotices({ postcode, floor: 0, windows: [win(1200, 1400)] })).toEqual([])
    }
  })

  it('gives no outside-service-area notice for an invalid postcode', () => {
    expect(codes(getNotices({ postcode: '2009', floor: 0, windows: [win(1200, 1400)] }))).toEqual([])
  })

  it('can give all three notices together', () => {
    const notices = getNotices({ postcode: '26000', floor: 2, windows: [win(2000, 1600)] })
    expect(codes(notices).sort()).toEqual(['outside-service-area', 'scaffold', 'two-person'])
  })

  it('names no price in any notice text (missing prices are never invented)', () => {
    const notices = getNotices({ postcode: '26000', floor: 2, windows: [win(2000, 1600)] })
    for (const n of notices) expect(n.text).not.toMatch(/€|EUR|\d\s*Euro/)
  })

  it('says the scaffold is clarified at the measurement visit', () => {
    const [n] = getNotices({ postcode: '20095', floor: 2, windows: [win(1200, 1400)] })
    expect(n.text).toContain('beim Aufmaß geklärt')
  })

  it('says the two-person effort is not part of the Richtpreis', () => {
    const [n] = getNotices({ ...ok, windows: [win(2000, 1600)] })
    expect(n.text).toContain('im Richtpreis nicht enthalten')
  })
})

describe('checkSize per system', () => {
  it.each(products.map((p) => [p.name, p] as const))('%s: limits are inclusive, one mm outside fails', (_name, p) => {
    const midW = p.widthMin
    const midH = p.heightMin
    expect(checkSize(p, p.widthMin, midH).ok).toBe(true)
    expect(checkSize(p, p.widthMax, midH).ok).toBe(true)
    expect(checkSize(p, midW, p.heightMin).ok).toBe(true)
    expect(checkSize(p, midW, p.heightMax).ok).toBe(true)
    expect(checkSize(p, p.widthMin - 1, midH).width).toBeDefined()
    expect(checkSize(p, p.widthMax + 1, midH).width).toBeDefined()
    expect(checkSize(p, midW, p.heightMin - 1).height).toBeDefined()
    expect(checkSize(p, midW, p.heightMax + 1).height).toBeDefined()
  })

  it('accepts Classic 70 at 400 x 400 mm (minimum)', () => {
    expect(checkSize(byId('FN-K70-2'), 400, 400).ok).toBe(true)
  })

  it('rejects Classic 70 at 399 mm width', () => {
    expect(checkSize(byId('FN-K70-2'), 399, 1000).ok).toBe(false)
  })

  it('accepts Classic 70 at 1800 mm width (maximum)', () => {
    expect(checkSize(byId('FN-K70-2'), 1800, 1000).ok).toBe(true)
  })

  it('rejects Classic 70 at 1801 mm width', () => {
    expect(checkSize(byId('FN-K70-2'), 1801, 1000).ok).toBe(false)
  })

  it('accepts Classic 70 at 2200 mm height and rejects 2201 mm', () => {
    expect(checkSize(byId('FN-K70-2'), 1000, 2200).ok).toBe(true)
    expect(checkSize(byId('FN-K70-2'), 1000, 2201).ok).toBe(false)
  })

  it('rejects Nordic 68 at 449 mm and accepts 450 mm (minimum 450 in both directions)', () => {
    const p = byId('FN-H68-3')
    expect(checkSize(p, 449, 1000).ok).toBe(false)
    expect(checkSize(p, 450, 1000).ok).toBe(true)
    expect(checkSize(p, 1000, 449).ok).toBe(false)
    expect(checkSize(p, 1000, 450).ok).toBe(true)
  })

  it('accepts Slim 75 at 2400 x 2600 mm, rejects 2601 mm height', () => {
    const p = byId('FN-A75-3')
    expect(checkSize(p, 2400, 2600).ok).toBe(true)
    expect(checkSize(p, 2400, 2601).ok).toBe(false)
  })

  it('rejects Therm 82 at 2001 mm width and accepts 2000 mm', () => {
    const p = byId('FN-K82-3')
    expect(checkSize(p, 2000, 1000).ok).toBe(true)
    expect(checkSize(p, 2001, 1000).ok).toBe(false)
  })

  it('reports only the width if only the width is wrong', () => {
    const r = checkSize(byId('FN-K70-2'), 1801, 1000)
    expect(r.width).toBeDefined()
    expect(r.height).toBeUndefined()
  })

  it('reports width and height if both are wrong', () => {
    const r = checkSize(byId('FN-K70-2'), 100, 100)
    expect(r.width).toBeDefined()
    expect(r.height).toBeDefined()
  })

  it('writes the width error in cm with the system name', () => {
    expect(checkSize(byId('FN-K70-2'), 1801, 1000).width).toBe(
      'Für Kunststofffenster Classic 70 muss die Breite zwischen 40 und 180 cm liegen.',
    )
  })

  it('writes the height error in cm with the system name', () => {
    expect(checkSize(byId('FN-K70-2'), 1000, 2201).height).toBe(
      'Für Kunststofffenster Classic 70 muss die Höhe zwischen 40 und 220 cm liegen.',
    )
  })

  it('writes a half centimetre with a comma (Nordic 68, 450 mm = 45 cm)', () => {
    expect(checkSize(byId('FN-H68-3'), 100, 1000).width).toContain('zwischen 45 und 180 cm')
  })

  it('rejects NaN sizes', () => {
    expect(checkSize(byId('FN-K70-2'), Number.NaN, Number.NaN).ok).toBe(false)
  })
})

describe('global size limits (any system)', () => {
  it('accepts 400 mm width (smallest minimum) and rejects 399 mm', () => {
    expect(checkGlobalWidth(products, 400)).toBeUndefined()
    expect(checkGlobalWidth(products, 399)).toBeDefined()
  })

  it('accepts 2400 mm width (largest maximum) and rejects 2401 mm', () => {
    expect(checkGlobalWidth(products, 2400)).toBeUndefined()
    expect(checkGlobalWidth(products, 2401)).toBeDefined()
  })

  it('accepts 400 mm height and rejects 399 mm', () => {
    expect(checkGlobalHeight(products, 400)).toBeUndefined()
    expect(checkGlobalHeight(products, 399)).toBeDefined()
  })

  it('accepts 2600 mm height (Slim 75) and rejects 2601 mm', () => {
    expect(checkGlobalHeight(products, 2600)).toBeUndefined()
    expect(checkGlobalHeight(products, 2601)).toBeDefined()
  })

  it('names the width range in cm', () => {
    expect(checkGlobalWidth(products, 100)).toBe('Die Breite muss zwischen 40 und 240 cm liegen.')
  })

  it('names the height range in cm', () => {
    expect(checkGlobalHeight(products, 100)).toBe('Die Höhe muss zwischen 40 und 260 cm liegen.')
  })
})
