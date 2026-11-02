import csv from '../../data/produktliste.csv?raw'

export interface Product {
  id: string
  name: string
  material: string
  glazing: string
  /** Heat transfer coefficient Uw in W/(m²K) */
  uw: number
  /** Net price per m² in EUR */
  pricePerM2: number
  /** Outer frame (Blendrahmen) limits in mm */
  widthMin: number
  widthMax: number
  heightMin: number
  heightMax: number
}

/** Parses a German number: "0,90" -> 0.9, "1,0" -> 1, "310" -> 310. */
export function parseGermanNumber(value: string): number {
  const n = Number(value.trim().replace(',', '.'))
  if (!Number.isFinite(n)) throw new Error(`Invalid number in product list: "${value}"`)
  return n
}

/** Parses the semicolon-separated product CSV from Fenster Nord. */
export function parseProducts(source: string): Product[] {
  const [header, ...rows] = source
    .replace(/^﻿/, '')
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '')
  const columns = header.split(';').map((c) => c.trim())
  const col = (cells: string[], name: string): string => {
    const i = columns.indexOf(name)
    if (i === -1) throw new Error(`Column "${name}" missing in product list`)
    return cells[i]
  }
  return rows.map((row) => {
    const cells = row.split(';')
    return {
      id: col(cells, 'artikelnr'),
      name: col(cells, 'bezeichnung'),
      material: col(cells, 'material'),
      glazing: col(cells, 'verglasung'),
      uw: parseGermanNumber(col(cells, 'uw_w_m2k')),
      pricePerM2: parseGermanNumber(col(cells, 'preis_netto_eur_m2')),
      widthMin: parseGermanNumber(col(cells, 'breite_min_mm')),
      widthMax: parseGermanNumber(col(cells, 'breite_max_mm')),
      heightMin: parseGermanNumber(col(cells, 'hoehe_min_mm')),
      heightMax: parseGermanNumber(col(cells, 'hoehe_max_mm')),
    }
  })
}

export const products: Product[] = parseProducts(csv)
