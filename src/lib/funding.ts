import type { Product } from './products'

/**
 * BEG EM (Richtlinie vom 17.07.2026, in Kraft seit 21.07.2026), Anlage Technische Mindestanforderungen Nr. 1.1:
 * Fenster Uw <= 0,95 W/(m²K). The 1,1 exception (barrier-free or burglar-resistant) does not apply,
 * Fenster Nord does not offer those versions (confirmed in their reply).
 */
export const BEG_UW_LIMIT = 0.95

/** True if the system's Uw value is within the BEG limit. Not a funding promise. */
export function mayQualifyForBeg(product: Product): boolean {
  return product.uw <= BEG_UW_LIMIT
}

/**
 * Careful hint for systems within the limit, null otherwise.
 * No amount, no promise. Wording confirmed by Fenster Nord: application before project start, checked at measurement.
 */
export function begHint(product: Product): string | null {
  if (!mayQualifyForBeg(product)) return null
  return `Mit einem Uw-Wert von ${formatUw(product.uw)} W/(m²K) kann dieses Fenster die technischen Anforderungen der BEG-Förderung erfüllen. ${BEG_CAVEAT}`
}

/** General sentence with the limit, built from BEG_UW_LIMIT so the text cannot drift from the rule. */
export function begGeneralHint(): string {
  return `Fenster mit einem Uw-Wert von ≤ ${formatUw(BEG_UW_LIMIT)} W/(m²K) können die technischen Anforderungen der BEG-Förderung erfüllen. ${BEG_CAVEAT}`
}

const BEG_CAVEAT =
  'Eine Förderzusage ist das nicht: Der Antrag muss vor Vorhabenbeginn gestellt werden, und wir prüfen die Voraussetzungen beim Aufmaß.'

function formatUw(uw: number): string {
  return uw.toFixed(2).replace('.', ',')
}
