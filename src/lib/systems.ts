import { calculateQuote, type Quote, type WindowItem } from './pricing'
import type { Product } from './products'
import { checkSize } from './validation'

export interface SystemOption {
  product: Product
  /** True if every window is within the size limits of this system */
  fits: boolean
  /** Why it does not fit, naming the first window that is too big or too small */
  reason?: string
  /** Price of the whole order with this system. Only set if it fits. */
  quote?: Quote
}

/** Evaluates every system for the entered windows: fits or not, and the total price. Cheapest fitting systems first. */
export function evaluateSystems(
  all: Product[],
  windows: WindowItem[],
  postcode: string,
  floor: number,
): SystemOption[] {
  const options = all.map((product): SystemOption => {
    for (let i = 0; i < windows.length; i++) {
      const check = checkSize(product, windows[i].widthMm, windows[i].heightMm)
      if (!check.ok) {
        return { product, fits: false, reason: `Fenster ${i + 1} passt nicht. ${check.width ?? check.height}` }
      }
    }
    const result = calculateQuote({ product, windows, postcode, floor })
    return result.available ? { product, fits: true, quote: result } : { product, fits: false, reason: 'Kein Preis möglich.' }
  })
  return options.sort((a, b) => {
    if (a.fits !== b.fits) return a.fits ? -1 : 1
    return (a.quote?.gross ?? 0) - (b.quote?.gross ?? 0)
  })
}
