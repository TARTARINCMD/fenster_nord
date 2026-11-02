import { describe, expect, it } from 'vitest'
import { parseGermanNumber, parseProducts, products } from './products'

describe('parseGermanNumber', () => {
  it('handles decimal commas and inconsistent formats', () => {
    expect(parseGermanNumber('0,90')).toBe(0.9)
    expect(parseGermanNumber('1,0')).toBe(1)
    expect(parseGermanNumber('310')).toBe(310)
  })

  it('throws on garbage instead of returning NaN', () => {
    expect(() => parseGermanNumber('abc')).toThrow()
  })
})

describe('product list (data/produktliste.csv)', () => {
  it('contains the six systems', () => {
    expect(products).toHaveLength(6)
  })

  it('reads Therm 82 correctly', () => {
    const p = products.find((x) => x.id === 'FN-K82-3')!
    expect(p).toMatchObject({
      name: 'Kunststofffenster Therm 82',
      uw: 0.9,
      pricePerM2: 395,
      widthMin: 400,
      widthMax: 2000,
      heightMin: 400,
      heightMax: 2400,
    })
  })

  it('reads the only 2-fach system and the Uw 1,0 value', () => {
    expect(products.find((x) => x.id === 'FN-K70-2')).toMatchObject({ glazing: '2-fach', uw: 1.1 })
    expect(products.find((x) => x.id === 'FN-A75-3')!.uw).toBe(1)
  })

  it('tolerates CRLF line endings and a BOM', () => {
    const csv = '﻿artikelnr;bezeichnung;material;verglasung;uw_w_m2k;preis_netto_eur_m2;breite_min_mm;breite_max_mm;hoehe_min_mm;hoehe_max_mm\r\nX;Y;Z;3-fach;0,8;100;400;1000;400;1000\r\n'
    expect(parseProducts(csv)[0]).toMatchObject({ id: 'X', uw: 0.8, pricePerM2: 100 })
  })
})
