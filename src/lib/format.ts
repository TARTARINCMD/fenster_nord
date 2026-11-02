import { RULES, roundCents, type Opening } from './pricing'

const eur = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })

export const formatEUR = (value: number): string => eur.format(value)

export function formatNumber(value: number, digits = 2): string {
  return new Intl.NumberFormat('de-DE', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value)
}

/** Net -> gross with the VAT rate from RULES, rounded to cents. */
export const withVat = (net: number): number => roundCents(net * (1 + RULES.vatRate))

export const OPENING_LABEL: Record<Opening, string> = {
  'dreh-kipp': 'Dreh-Kipp',
  fest: 'Festverglasung',
  stulp: 'Zweiflügelig mit Stulp',
}

export const FLOOR_LABEL: Record<number, string> = {
  0: 'Erdgeschoss',
  1: '1. Obergeschoss',
  2: '2. Obergeschoss',
  3: '3. Obergeschoss oder höher',
}

/** mm -> "120" or "120,5" */
export function cmText(mm: number): string {
  return String(mm / 10).replace('.', ',')
}
