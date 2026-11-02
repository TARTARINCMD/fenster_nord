import { describe, expect, it } from 'vitest'
import { begHint, mayQualifyForBeg } from './funding'
import { calculateQuote, windowUnitNet, type Quote, type QuoteInput, type WindowItem } from './pricing'
import { products } from './products'
import { checkSize, getNotices, getPostcodeStatus } from './validation'

const byId = (id: string) => products.find((p) => p.id === id)!
const therm82 = byId('FN-K82-3')

let counter = 0
function win(partial: Partial<WindowItem> = {}): WindowItem {
  return {
    id: `w${++counter}`,
    widthMm: 1200,
    heightMm: 1400,
    quantity: 1,
    opening: 'dreh-kipp',
    shutter: false,
    sill: false,
    ...partial,
  }
}

function quote(windows: WindowItem[], extra: Partial<QuoteInput> = {}): Quote {
  const result = calculateQuote({ product: therm82, windows, postcode: '22000', floor: 0, ...extra })
  if (!result.available) throw new Error(`Quote unavailable: ${result.reason}`)
  return result
}

describe('fixtures from the documents', () => {
  it('fixture 1: 1200 × 1400 Therm 82 costs 663,60 € (Preise-und-Produkte, Beispiel)', () => {
    expect(windowUnitNet(therm82, 1200, 1400, 'dreh-kipp')).toBeCloseTo(663.6, 10)
    expect(quote([win()]).lines[0].windowNet).toBe(663.6)
  })

  it('fixture 2: mixed order, net 2.511,70, VAT 477,22, gross 2.988,92', () => {
    const q = quote([
      win({ widthMm: 1200, heightMm: 1400 }),
      win({ widthMm: 600, heightMm: 600, opening: 'fest' }),
      win({ widthMm: 1500, heightMm: 1400, opening: 'stulp' }),
    ])
    expect(q.lines.map((l) => l.windowNet)).toEqual([663.6, 268.6, 949.5])
    expect(q.windowsNet).toBe(1881.7)
    expect(q.installationNet).toBe(630)
    expect(q.net).toBe(2511.7)
    expect(q.vat).toBe(477.22)
    expect(q.gross).toBe(2988.92)
  })
})

describe('price rules', () => {
  it('bills windows under 0,8 m² as 0,8 m² (Nr. 2)', () => {
    const q = quote([win({ widthMm: 500, heightMm: 500 })])
    expect(q.lines[0].areaM2).toBe(0.25)
    expect(q.lines[0].billedAreaM2).toBe(0.8)
    expect(q.lines[0].windowNet).toBe(316) // 0,8 × 395
  })

  it('does not raise windows that are exactly 0,8 m²', () => {
    expect(quote([win({ widthMm: 1000, heightMm: 800 })]).lines[0].billedAreaM2).toBe(0.8)
  })

  it('applies the minimum area before the fixed-glazing discount (confirmed by Fenster Nord)', () => {
    const q = quote([win({ widthMm: 600, heightMm: 600, opening: 'fest' })])
    expect(q.lines[0].windowNet).toBe(268.6) // 0,8 × 395 × 0,85
  })

  it('fixed glazing: 15 % off the window price', () => {
    expect(quote([win({ opening: 'fest' })]).lines[0].windowNet).toBe(564.06) // 663,60 × 0,85
  })

  it('Stulp: +120 € per window, also per piece', () => {
    const q = quote([win({ widthMm: 1500, heightMm: 1400, opening: 'stulp', quantity: 2 })])
    expect(q.lines[0].unitNet).toBe(949.5)
    expect(q.lines[0].windowNet).toBe(1899)
  })

  it('uses the price per m² of the chosen system', () => {
    const duo = byId('FN-HA78-3')
    expect(windowUnitNet(duo, 1200, 1400, 'dreh-kipp')).toBeCloseTo(1.68 * 690, 10)
  })
})

describe('volume discount (Nr. 6)', () => {
  it('9 windows: no discount', () => {
    const q = quote([win({ quantity: 9 })])
    expect(q.windowCount).toBe(9)
    expect(q.volumeDiscountNet).toBe(0)
    expect(q.net).toBe(6962.4) // 9 × 663,60 + 450 + 9 × 60
  })

  it('10 windows: 5 % on the window prices, not on installation', () => {
    const q = quote([win({ quantity: 10 })])
    expect(q.windowsNet).toBe(6636)
    expect(q.volumeDiscountNet).toBe(331.8)
    expect(q.installationNet).toBe(1050) // 450 + 10 × 60, no discount
    expect(q.net).toBe(7354.2)
  })

  it('counts pieces, not line items (confirmed by Fenster Nord)', () => {
    const q = quote([win({ quantity: 5 }), win({ quantity: 5, widthMm: 1000 })])
    expect(q.windowCount).toBe(10)
    expect(q.volumeDiscountNet).toBeGreaterThan(0)
    expect(quote([win({ quantity: 1 }), win({ quantity: 1 })]).windowCount).toBe(2)
  })

  it('includes the Stulp surcharge in the discount base (confirmed by Fenster Nord)', () => {
    const q = quote([win({ opening: 'stulp', quantity: 10 })])
    expect(q.windowsNet).toBe(7836) // 10 × (663,60 + 120)
    expect(q.volumeDiscountNet).toBe(391.8)
  })

  it('does not discount shutters or sills', () => {
    const q = quote([win({ quantity: 10, shutter: true, sill: true })])
    expect(q.shuttersNet).toBe(1140) // 10 × 95 × 1,2
    expect(q.sillsNet).toBe(456) // 10 × 38 × 1,2
    expect(q.volumeDiscountNet).toBe(331.8)
  })
})

describe('shutters (Nr. 4) and sills (Montagebedingungen §2)', () => {
  it('shutter: 95 € per metre of window width', () => {
    const q = quote([win({ shutter: true })])
    expect(q.lines[0].shutterNet).toBe(114) // 95 × 1,2
    expect(q.shuttersNet).toBe(114)
    expect(q.net).toBe(663.6 + 114 + 450 + 60)
  })

  it('shutter is allowed on fixed glazing (decision in log.md)', () => {
    const q = quote([win({ opening: 'fest', shutter: true })])
    expect(q.shuttersNet).toBe(114)
  })

  it('sill is optional and priced by window width: 38 € per metre', () => {
    const without = quote([win()])
    const withSill = quote([win({ sill: true })])
    expect(without.sillsNet).toBe(0)
    expect(withSill.sillsNet).toBe(45.6) // 38 × 1,2
    expect(withSill.installationNet).toBe(450 + 60 + 45.6)
  })

  it('multiplies by quantity', () => {
    expect(quote([win({ shutter: true, quantity: 3 })]).shuttersNet).toBe(342)
  })
})

describe('installation (A1, confirmed): 450 € flat + 60 € per window, not 180 € per window', () => {
  it('8 windows: 930 €, not 1.440 €', () => {
    expect(quote([win({ quantity: 8 })]).installationNet).toBe(930)
  })
})

describe('totals', () => {
  it('rounds to cents once: gross = net + VAT', () => {
    const q = quote([win({ widthMm: 1234, heightMm: 987, quantity: 3 })])
    expect(q.vat).toBe(Math.round(q.net * 19) / 100)
    expect(q.gross).toBe(Math.round((q.net + q.vat) * 100) / 100)
  })

  it('returns no price without windows', () => {
    const r = calculateQuote({ product: therm82, windows: [], postcode: '22000', floor: 0 })
    expect(r).toMatchObject({ available: false, reason: 'no-windows' })
  })

  it('ignores line items with quantity 0', () => {
    expect(quote([win(), win({ quantity: 0 })]).windowCount).toBe(1)
  })
})

describe('size limits per system (Produktliste)', () => {
  it('Therm 82: width 400 to 2000 mm, height 400 to 2400 mm', () => {
    expect(checkSize(therm82, 400, 400).ok).toBe(true)
    expect(checkSize(therm82, 2000, 2400).ok).toBe(true)
    expect(checkSize(therm82, 399, 1000).width).toBeDefined()
    expect(checkSize(therm82, 2001, 1000).width).toBeDefined()
    expect(checkSize(therm82, 1000, 2401).height).toBeDefined()
  })

  it('limits differ per system: Classic 70 only up to 1800 mm wide, Duo 78 up to 2400 mm', () => {
    expect(checkSize(byId('FN-K70-2'), 1900, 1000).ok).toBe(false)
    expect(checkSize(byId('FN-HA78-3'), 2400, 2400).ok).toBe(true)
    expect(checkSize(byId('FN-H68-3'), 420, 1000).ok).toBe(false) // min 450
  })

  it('gives human messages in cm, not raw numbers', () => {
    expect(checkSize(therm82, 2100, 1000).width).toBe(
      'Für Kunststofffenster Therm 82 muss die Breite zwischen 40 und 200 cm liegen.',
    )
    expect(checkSize(byId('FN-H68-3'), 1000, 400).height).toContain('45 und 220 cm')
  })
})

describe('notices for cases without a price (A4, confirmed)', () => {
  const base = { windows: [{ widthMm: 1200, heightMm: 1400, quantity: 1 }], postcode: '22000', floor: 0 }
  const codes = (input: Parameters<typeof getNotices>[0]) => getNotices(input).map((n) => n.code)

  it('no notices for a normal order', () => {
    expect(codes(base)).toEqual([])
  })

  it('two-person installation above 3,0 m² (not at exactly 3,0 m²)', () => {
    expect(codes({ ...base, windows: [{ widthMm: 2000, heightMm: 1600, quantity: 1 }] })).toContain('two-person')
    expect(codes({ ...base, windows: [{ widthMm: 2000, heightMm: 1500, quantity: 1 }] })).not.toContain('two-person')
  })

  it('scaffold from the 2nd floor', () => {
    expect(codes({ ...base, floor: 1 })).not.toContain('scaffold')
    expect(codes({ ...base, floor: 2 })).toContain('scaffold')
  })

  it('postcode range 20000 to 25999', () => {
    expect(getPostcodeStatus('20000')).toBe('ok')
    expect(getPostcodeStatus('25999')).toBe('ok')
    expect(getPostcodeStatus('19999')).toBe('outside-service-area')
    expect(getPostcodeStatus('26000')).toBe('outside-service-area')
    expect(getPostcodeStatus('2200')).toBe('invalid')
    expect(getPostcodeStatus('abcde')).toBe('invalid')
  })

  it('outside the service area: notice instead of a price', () => {
    const r = calculateQuote({ product: therm82, windows: [win()], postcode: '30159', floor: 0 })
    expect(r).toMatchObject({ available: false, reason: 'outside-service-area' })
    expect(r.notices.map((n) => n.code)).toContain('outside-service-area')
  })

  it('does not add a price for scaffold or two-person installation', () => {
    const plain = quote([win({ widthMm: 2000, heightMm: 1600 })], { floor: 0 })
    const scaffold = quote([win({ widthMm: 2000, heightMm: 1600 })], { floor: 3 })
    expect(scaffold.net).toBe(plain.net)
    expect(scaffold.notices.map((n) => n.code).sort()).toEqual(['scaffold', 'two-person'])
  })
})

describe('BEG hint (BEG EM 17.07.2026, Uw ≤ 0,95)', () => {
  it('qualifying systems: Therm 82 Plus, Duo 78, Therm 82, Nordic 68 (exactly 0,95)', () => {
    for (const id of ['FN-K82-3P', 'FN-HA78-3', 'FN-K82-3', 'FN-H68-3']) {
      expect(mayQualifyForBeg(byId(id)), id).toBe(true)
    }
  })

  it('not qualifying: Slim 75 (1,0) and Classic 70 (1,1)', () => {
    expect(mayQualifyForBeg(byId('FN-A75-3'))).toBe(false)
    expect(mayQualifyForBeg(byId('FN-K70-2'))).toBe(false)
    expect(begHint(byId('FN-A75-3'))).toBeNull()
  })

  it('hint makes no promise and names no amount', () => {
    const hint = begHint(therm82)!
    expect(hint).toContain('vor Vorhabenbeginn')
    expect(hint).toContain('Aufmaß')
    expect(hint).toContain('Eine Förderzusage ist das nicht')
    expect(hint).not.toMatch(/€|\d\s?%/)
  })
})
