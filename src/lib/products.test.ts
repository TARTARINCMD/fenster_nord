import { describe, expect, it } from 'vitest'
import { parseGermanNumber, parseProducts, products } from './products'

const HEADER =
  'artikelnr;bezeichnung;material;verglasung;uw_w_m2k;preis_netto_eur_m2;breite_min_mm;breite_max_mm;hoehe_min_mm;hoehe_max_mm'

describe('parseGermanNumber', () => {
  it('reads a decimal comma', () => {
    expect(parseGermanNumber('0,90')).toBe(0.9)
  })

  it('reads "1,0" as 1', () => {
    expect(parseGermanNumber('1,0')).toBe(1)
  })

  it('reads an integer without decimals', () => {
    expect(parseGermanNumber('310')).toBe(310)
  })

  it('ignores surrounding whitespace', () => {
    expect(parseGermanNumber(' 395 ')).toBe(395)
  })

  it('throws for text', () => {
    expect(() => parseGermanNumber('abc')).toThrow()
  })

  it('throws for an empty value', () => {
    expect(() => parseGermanNumber('')).toThrow()
  })
})

describe('parseProducts', () => {
  const row = 'X-1;Test Fenster;Kunststoff;3-fach;0,90;395;400;2000;450;2400'

  it('maps every column to the right field', () => {
    const [p] = parseProducts(`${HEADER}\n${row}`)
    expect(p).toEqual({
      id: 'X-1',
      name: 'Test Fenster',
      material: 'Kunststoff',
      glazing: '3-fach',
      uw: 0.9,
      pricePerM2: 395,
      widthMin: 400,
      widthMax: 2000,
      heightMin: 450,
      heightMax: 2400,
    })
  })

  it('handles Windows line endings and blank lines', () => {
    const list = parseProducts(`${HEADER}\r\n${row}\r\n\r\n${row.replace('X-1', 'X-2')}\r\n`)
    expect(list.map((p) => p.id)).toEqual(['X-1', 'X-2'])
  })

  it('ignores a byte order mark in front of the header', () => {
    expect(parseProducts(`﻿${HEADER}\n${row}`)).toHaveLength(1)
  })

  it('finds columns by name, not by position', () => {
    const swapped =
      'bezeichnung;artikelnr;material;verglasung;uw_w_m2k;preis_netto_eur_m2;breite_min_mm;breite_max_mm;hoehe_min_mm;hoehe_max_mm'
    const [p] = parseProducts(`${swapped}\nName;ID;Holz;3-fach;0,95;560;450;1800;450;2200`)
    expect(p.id).toBe('ID')
    expect(p.name).toBe('Name')
  })

  it('throws if a column is missing', () => {
    expect(() => parseProducts('artikelnr;bezeichnung\nA;B')).toThrow(/missing/)
  })

  it('throws if a number is not readable', () => {
    expect(() => parseProducts(`${HEADER}\n${row.replace('395', 'x')}`)).toThrow()
  })

  it('returns an empty list for a header only', () => {
    expect(parseProducts(HEADER)).toEqual([])
  })
})

describe('product list from data/produktliste.csv', () => {
  const byId = (id: string) => {
    const p = products.find((x) => x.id === id)
    if (!p) throw new Error(`Product ${id} not found`)
    return p
  }

  it('contains the 6 systems of the documents', () => {
    expect(products).toHaveLength(6)
  })

  it('has unique article numbers', () => {
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length)
  })

  it('has a lower limit below the upper limit for width and height of every system', () => {
    for (const p of products) {
      expect(p.widthMin).toBeLessThan(p.widthMax)
      expect(p.heightMin).toBeLessThan(p.heightMax)
    }
  })

  it('has a positive net price per m² for every system', () => {
    for (const p of products) expect(p.pricePerM2).toBeGreaterThan(0)
  })

  it('reads Therm 82 with 395 EUR/m² and Uw 0,90 (documents example)', () => {
    const p = byId('FN-K82-3')
    expect(p.name).toBe('Kunststofffenster Therm 82')
    expect(p.pricePerM2).toBe(395)
    expect(p.uw).toBe(0.9)
  })

  it('reads the Uw values on the BEG limit and above it as numbers', () => {
    expect(byId('FN-H68-3').uw).toBe(0.95) // Nordic 68, exactly on the limit
    expect(byId('FN-A75-3').uw).toBe(1) // Slim 75, "1,0" in the CSV
    expect(byId('FN-K70-2').uw).toBe(1.1) // Classic 70
  })

  it('reads the Classic 70 limits from the documents (400 to 1800 x 400 to 2200 mm)', () => {
    const p = byId('FN-K70-2')
    expect([p.widthMin, p.widthMax, p.heightMin, p.heightMax]).toEqual([400, 1800, 400, 2200])
  })

  it('reads the Duo 78 limits from the documents (450 to 2400 x 450 to 2400 mm)', () => {
    const p = byId('FN-HA78-3')
    expect([p.widthMin, p.widthMax, p.heightMin, p.heightMax]).toEqual([450, 2400, 450, 2400])
  })
})
