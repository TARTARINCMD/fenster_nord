import { describe, expect, it } from 'vitest'
import {
  RULES,
  areaM2,
  calculateQuote,
  roundCents,
  windowUnitNet,
  type Quote,
  type QuoteInput,
  type WindowItem,
} from './pricing'
import { products, type Product } from './products'

const byId = (id: string): Product => {
  const p = products.find((x) => x.id === id)
  if (!p) throw new Error(`Product ${id} not found`)
  return p
}
const therm = byId('FN-K82-3') // 395 EUR/m² net

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
  const result = calculateQuote({ product: therm, windows, postcode: '20095', floor: 0, ...extra })
  if (!result.available) throw new Error(`Quote unavailable: ${result.reason}`)
  return result
}

describe('RULES from the documents', () => {
  it('matches Preise-und-Produkte and Montagebedingungen', () => {
    expect(RULES).toEqual({
      minAreaM2: 0.8,
      fixedDiscount: 0.15,
      stulpSurcharge: 120,
      shutterPerMeter: 95,
      volumeThreshold: 10,
      volumeDiscount: 0.05,
      installationFlat: 450,
      removalPerWindow: 60,
      sillPerMeter: 38,
      vatRate: 0.19,
    })
  })
})

describe('fixtures', () => {
  it('fixture 1: Therm 82, 1200 x 1400 mm, tilt-and-turn costs 663,60 EUR', () => {
    // 1,2 * 1,4 = 1,68 m²; 1,68 * 395 = 663,60
    expect(quote([win()]).lines[0].windowNet).toBe(663.6)
  })

  it('fixture 2: windows 1.881,70, installation 630, net 2.511,70, VAT 477,22, gross 2.988,92', () => {
    const q = quote([
      win({ widthMm: 1200, heightMm: 1400, opening: 'dreh-kipp' }), // 1,68 * 395 = 663,60
      win({ widthMm: 600, heightMm: 600, opening: 'fest' }), // max(0,36; 0,8) * 395 * 0,85 = 268,60
      win({ widthMm: 1500, heightMm: 1400, opening: 'stulp' }), // 2,10 * 395 + 120 = 949,50
    ])
    expect(q.lines.map((l) => l.unitNet)).toEqual([663.6, 268.6, 949.5])
    expect(q.windowsNet).toBe(1881.7) // 663,60 + 268,60 + 949,50
    expect(q.installationNet).toBe(630) // 450 + 3 * 60
    expect(q.net).toBe(2511.7) // 1881,70 + 630
    expect(q.vat).toBe(477.22) // 2511,70 * 0,19 = 477,223
    expect(q.gross).toBe(2988.92) // 2511,70 + 477,22
  })
})

describe('helpers', () => {
  it('areaM2 converts mm x mm to m²', () => {
    expect(areaM2(1200, 1400)).toBeCloseTo(1.68, 10)
  })

  it('roundCents rounds to two decimals', () => {
    expect(roundCents(477.223)).toBe(477.22)
    expect(roundCents(477.226)).toBe(477.23)
  })
})

describe('minimum area 0,8 m²', () => {
  it('bills a 600 x 600 mm window as 0,8 m²', () => {
    // 0,36 m² -> 0,8 m²; 0,8 * 395 = 316
    expect(windowUnitNet(therm, 600, 600, 'dreh-kipp')).toBeCloseTo(316, 6)
  })

  it('bills exactly 0,8 m² as 0,8 m²', () => {
    // 1000 x 800 = 0,8 m²; 0,8 * 395 = 316
    expect(windowUnitNet(therm, 1000, 800, 'dreh-kipp')).toBeCloseTo(316, 6)
  })

  it('bills 0,81 m² with its real area', () => {
    // 1000 x 810 = 0,81 m²; 0,81 * 395 = 319,95
    expect(windowUnitNet(therm, 1000, 810, 'dreh-kipp')).toBeCloseTo(319.95, 6)
  })

  it('bills 0,79 m² as 0,8 m²', () => {
    // 1000 x 790 = 0,79 m² -> 0,8; 316
    expect(windowUnitNet(therm, 1000, 790, 'dreh-kipp')).toBeCloseTo(316, 6)
  })

  it('shows the real and the billed area on the line', () => {
    const [line] = quote([win({ widthMm: 600, heightMm: 600 })]).lines
    expect(line.areaM2).toBeCloseTo(0.36, 10)
    expect(line.billedAreaM2).toBe(0.8)
  })

  it('applies the minimum area to fixed glazing as well (confirmed by Fenster Nord)', () => {
    // 0,8 * 395 * 0,85 = 268,60
    expect(windowUnitNet(therm, 600, 600, 'fest')).toBeCloseTo(268.6, 6)
  })

  it('adds the Stulp surcharge after the minimum area', () => {
    // 0,8 * 395 + 120 = 436
    expect(windowUnitNet(therm, 600, 600, 'stulp')).toBeCloseTo(436, 6)
  })
})

describe('opening types', () => {
  it('prices tilt-and-turn without surcharge or discount', () => {
    expect(windowUnitNet(therm, 1200, 1400, 'dreh-kipp')).toBeCloseTo(663.6, 6)
  })

  it('gives 15 % off fixed glazing', () => {
    // 663,60 * 0,85 = 564,06
    expect(windowUnitNet(therm, 1200, 1400, 'fest')).toBeCloseTo(564.06, 6)
  })

  it('adds 120 EUR for a Stulp window', () => {
    // 663,60 + 120 = 783,60
    expect(windowUnitNet(therm, 1200, 1400, 'stulp')).toBeCloseTo(783.6, 6)
  })

  it('does not discount the Stulp surcharge like fixed glazing', () => {
    // fixed: 15 % off the window price; Stulp: flat +120, nothing is discounted
    const base = windowUnitNet(therm, 1200, 1400, 'dreh-kipp')
    expect(windowUnitNet(therm, 1200, 1400, 'stulp') - base).toBeCloseTo(120, 6)
  })

  it('uses the price per m² of the chosen system', () => {
    // Duo 78: 690 EUR/m²; 1,68 * 690 = 1159,20
    expect(windowUnitNet(byId('FN-HA78-3'), 1200, 1400, 'dreh-kipp')).toBeCloseTo(1159.2, 6)
  })
})

describe('quantity', () => {
  it('multiplies the window price by the quantity', () => {
    const q = quote([win({ quantity: 3 })])
    expect(q.lines[0].windowNet).toBe(1990.8) // 3 * 663,60
    expect(q.windowCount).toBe(3)
  })

  it('windowNet = unitNet * quantity for stulp opening', () => {
    // 1500 x 1400 stulp: unitNet = 2,10 * 395 + 120 = 949,50; windowNet = 2 * 949,50 = 1899
    const q = quote([win({ widthMm: 1500, heightMm: 1400, opening: 'stulp', quantity: 2 })])
    expect(q.lines[0].unitNet).toBe(949.5)
    expect(q.lines[0].windowNet).toBe(1899)
  })

  it('charges removal per piece', () => {
    expect(quote([win({ quantity: 3 })]).removalNet).toBe(180) // 3 * 60
  })

  it('charges the flat fee once per order', () => {
    expect(quote([win(), win()]).installationFlatNet).toBe(450)
  })

  it('counts pieces across several lines', () => {
    expect(quote([win({ quantity: 2 }), win({ quantity: 3 })]).windowCount).toBe(5)
  })

  it('ignores lines with quantity 0', () => {
    const q = quote([win({ quantity: 0, widthMm: 2400, heightMm: 2400 }), win()])
    expect(q.lines).toHaveLength(1)
    expect(q.windowCount).toBe(1)
  })
})

describe('installation (A1)', () => {
  it('charges 450 flat + 60 per window for one window', () => {
    const q = quote([win()])
    expect(q.installationNet).toBe(510) // 450 + 60
    expect(q.net).toBe(1173.6) // 663,60 + 510
  })

  it('does not use the outdated 180 EUR per window', () => {
    // 8 windows: 450 + 8 * 60 = 930 (not 8 * 180 = 1440)
    expect(quote([win({ quantity: 8 })]).installationNet).toBe(930)
  })

  it('gives the totals for one window: VAT 222,98 and gross 1.396,58', () => {
    const q = quote([win()])
    expect(q.vat).toBe(222.98) // 1173,60 * 0,19 = 222,984
    expect(q.gross).toBe(1396.58) // 1173,60 + 222,98
  })
})

describe('volume discount (5 % from 10 windows, by pieces)', () => {
  it('gives no discount for 9 windows', () => {
    const q = quote([win({ quantity: 9 })])
    expect(q.volumeDiscountNet).toBe(0)
    expect(q.net).toBe(6962.4) // 9 * 663,60 = 5972,40 + (450 + 540) = 6962,40
  })

  it('gives 5 % for 10 windows', () => {
    const q = quote([win({ quantity: 10 })])
    expect(q.windowsNet).toBe(6636) // 10 * 663,60
    expect(q.volumeDiscountNet).toBe(331.8) // 6636 * 0,05
    expect(q.net).toBe(7354.2) // 6636 - 331,80 + (450 + 600) = 7354,20
    expect(q.vat).toBe(1397.3) // 7354,20 * 0,19 = 1397,298
    expect(q.gross).toBe(8751.5) // 7354,20 + 1397,30
  })

  it('counts pieces, not line items: 5 + 5 windows get the discount', () => {
    const q = quote([win({ quantity: 5 }), win({ quantity: 5 })])
    expect(q.volumeDiscountNet).toBe(331.8)
  })

  it('does not give the discount for 9 line items split as 8 + 1 pieces', () => {
    expect(quote([win({ quantity: 8 }), win({ quantity: 1 })]).volumeDiscountNet).toBe(0)
  })

  it('gives the discount for 10 single line items', () => {
    const windows = Array.from({ length: 10 }, () => win())
    expect(quote(windows).volumeDiscountNet).toBe(331.8)
  })

  it('also discounts the Stulp surcharge (confirmed: window price incl. opening type)', () => {
    // 10 * (2,10 * 395 + 120) = 10 * 949,50 = 9495; discount 474,75
    const q = quote([win({ widthMm: 1500, heightMm: 1400, opening: 'stulp', quantity: 10 })])
    expect(q.windowsNet).toBe(9495)
    expect(q.volumeDiscountNet).toBe(474.75)
  })

  it('does not discount shutters', () => {
    // 10 windows, each with shutter: 10 * 95 * 1,2 = 1140
    const q = quote([win({ quantity: 10, shutter: true })])
    expect(q.shuttersNet).toBe(1140)
    // 6636 - 331,80 + 1140 + (450 + 600) = 8494,20
    expect(q.net).toBe(8494.2)
  })

  it('does not discount installation or sills', () => {
    // 10 windows with sill: sills 10 * 38 * 1,2 = 456; installation 450 + 600 + 456 = 1506
    const q = quote([win({ quantity: 10, sill: true })])
    expect(q.sillsNet).toBe(456)
    expect(q.installationNet).toBe(1506)
  })
})

describe('roller shutters (95 EUR per metre of width)', () => {
  it('charges 95 EUR per metre of window width', () => {
    // 1,2 m * 95 = 114
    expect(quote([win({ shutter: true })]).shuttersNet).toBe(114)
  })

  it('uses the width, not the height', () => {
    // 1000 x 2000 mm: 1,0 m * 95 = 95
    expect(quote([win({ widthMm: 1000, heightMm: 2000, shutter: true })]).shuttersNet).toBe(95)
  })

  it('multiplies by quantity', () => {
    // 2 * 114 = 228
    expect(quote([win({ shutter: true, quantity: 2 })]).shuttersNet).toBe(228)
  })

  it('adds nothing without shutter', () => {
    expect(quote([win()]).shuttersNet).toBe(0)
  })

  it('is not affected by the fixed glazing discount', () => {
    const q = quote([win({ opening: 'fest', shutter: true })])
    expect(q.shuttersNet).toBe(114) // 1,2 * 95, no 15 % off
  })

  it('is allowed on fixed glazing (log.md: reversed decision)', () => {
    // 663,60 * 0,85 = 564,06; + 114 + 510 = 1188,06
    expect(quote([win({ opening: 'fest', shutter: true })]).net).toBe(1188.06)
  })

  it('is not raised to the minimum area (600 mm wide window: 0,6 * 95 = 57)', () => {
    expect(quote([win({ widthMm: 600, heightMm: 600, shutter: true })]).shuttersNet).toBe(57)
  })

  it('adds up to the net total', () => {
    // 663,60 + 114 + 510 = 1287,60
    expect(quote([win({ shutter: true })]).net).toBe(1287.6)
  })
})

describe('inside sills (38 EUR per metre, optional)', () => {
  it('charges 38 EUR per metre of window width', () => {
    // 1,2 * 38 = 45,60
    expect(quote([win({ sill: true })]).sillsNet).toBe(45.6)
  })

  it('is part of the installation price', () => {
    // 450 + 60 + 45,60 = 555,60
    expect(quote([win({ sill: true })]).installationNet).toBe(555.6)
  })

  it('multiplies by quantity', () => {
    // 2 * 45,60 = 91,20
    expect(quote([win({ sill: true, quantity: 2 })]).sillsNet).toBe(91.2)
  })

  it('adds nothing without sill', () => {
    expect(quote([win()]).sillsNet).toBe(0)
  })

  it('adds up to the net total', () => {
    // 663,60 + 555,60 = 1219,20
    expect(quote([win({ sill: true })]).net).toBe(1219.2)
  })

  it('is independent of the shutter choice', () => {
    // shutter 114 + sill 45,60 + windows 663,60 + installation (450 + 60 + 45,60) = 1333,20
    expect(quote([win({ sill: true, shutter: true })]).net).toBe(1333.2)
  })
})

describe('rounding only at the end', () => {
  it('rounds the sum, not each window: 3 x 1111 x 1111 mm', () => {
    // 1,111² = 1,234321 m²; * 395 = 487,556795 per window; * 3 = 1462,670385 -> 1462,67
    // (rounding per window first would give 3 * 487,56 = 1462,68)
    const q = quote([win({ widthMm: 1111, heightMm: 1111, quantity: 3 })])
    expect(q.windowsNet).toBe(1462.67)
  })

  it('rounds net from the full precision sum', () => {
    // 1462,670385 + 450 + 180 = 2092,670385 -> 2092,67
    const q = quote([win({ widthMm: 1111, heightMm: 1111, quantity: 3 })])
    expect(q.net).toBe(2092.67)
  })

  it('computes VAT from the rounded net and gross as net + VAT', () => {
    // 2092,67 * 0,19 = 397,6073 -> 397,61; gross = 2092,67 + 397,61 = 2490,28
    const q = quote([win({ widthMm: 1111, heightMm: 1111, quantity: 3 })])
    expect(q.vat).toBe(397.61)
    expect(q.gross).toBe(2490.28)
  })

  it('keeps gross = net + vat for every fixture', () => {
    const q = quote([win({ opening: 'fest', widthMm: 777, heightMm: 1333, quantity: 7, shutter: true, sill: true })])
    expect(q.gross).toBe(roundCents(q.net + q.vat))
  })
})

describe('size limits are not enforced by calculateQuote', () => {
  it('still returns a number for a size outside the system limits (the system check lives in systems.ts)', () => {
    // Therm 82 maximum width is 2000 mm; 2100 x 1000 = 2,1 m² * 395 = 829,50
    expect(quote([win({ widthMm: 2100, heightMm: 1000 })]).lines[0].windowNet).toBe(829.5)
  })
})

describe('notices and missing prices', () => {
  it('shows the two-person notice above 3,0 m² and adds no price for it', () => {
    // 2000 x 1600 = 3,2 m²; 3,2 * 395 = 1264; + 510 = 1774
    const q = quote([win({ widthMm: 2000, heightMm: 1600 })])
    expect(q.notices.map((n) => n.code)).toEqual(['two-person'])
    expect(q.net).toBe(1774)
  })

  it('shows no two-person notice at exactly 3,0 m²', () => {
    // 2000 x 1500 = 3,0 m²
    expect(quote([win({ widthMm: 2000, heightMm: 1500 })]).notices).toEqual([])
  })

  it('shows the scaffold notice from the 2nd floor and keeps the price unchanged', () => {
    const q0 = quote([win()], { floor: 0 })
    const q2 = quote([win()], { floor: 2 })
    expect(q2.notices.map((n) => n.code)).toEqual(['scaffold'])
    expect(q2.net).toBe(q0.net)
  })

  it('shows no scaffold notice on the 1st floor', () => {
    expect(quote([win()], { floor: 1 }).notices).toEqual([])
  })

  it('gives no notice for a standard order', () => {
    expect(quote([win()]).notices).toEqual([])
  })
})

describe('service area', () => {
  const windows = () => [win()]

  it.each(['20000', '25999', '22305'])('prices postcode %s', (postcode) => {
    expect(calculateQuote({ product: therm, windows: windows(), postcode, floor: 0 }).available).toBe(true)
  })

  it.each(['19999', '26000'])('gives no price for postcode %s', (postcode) => {
    const r = calculateQuote({ product: therm, windows: windows(), postcode, floor: 0 })
    expect(r.available).toBe(false)
    if (!r.available) {
      expect(r.reason).toBe('outside-service-area')
      expect(r.notices.map((n) => n.code)).toContain('outside-service-area')
    }
  })

  it('contains no price fields outside the service area', () => {
    const r = calculateQuote({ product: therm, windows: windows(), postcode: '26000', floor: 0 })
    expect(r).not.toHaveProperty('gross')
    expect(r).not.toHaveProperty('net')
  })

  it('gives no price for an invalid postcode', () => {
    const r = calculateQuote({ product: therm, windows: windows(), postcode: '2009', floor: 0 })
    expect(r.available).toBe(false)
    if (!r.available) expect(r.reason).toBe('invalid')
  })

  it('gives no price for an empty window list', () => {
    const r = calculateQuote({ product: therm, windows: [], postcode: '20095', floor: 0 })
    expect(r.available).toBe(false)
    if (!r.available) expect(r.reason).toBe('no-windows')
  })

  it('gives no price if all windows have quantity 0', () => {
    const r = calculateQuote({ product: therm, windows: [win({ quantity: 0 })], postcode: '20095', floor: 0 })
    expect(r.available).toBe(false)
  })

  it('checks the postcode before the windows', () => {
    const r = calculateQuote({ product: therm, windows: [], postcode: '26000', floor: 0 })
    if (!r.available) expect(r.reason).toBe('outside-service-area')
  })
})
