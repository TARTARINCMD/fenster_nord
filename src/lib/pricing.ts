import type { Product } from './products'
import { getNotices, getPostcodeStatus, type Notice, type PostcodeStatus } from './validation'

/**
 * Pricing rules. All amounts net, in EUR.
 * Sources: Fenster-Nord_Preise-und-Produkte.pdf (rules 1-6), Fenster-Nord_Montagebedingungen.pdf §2,
 * confirmed by Fenster Nord's reply (see log.md, "Fenster Nord answered the clarification email").
 */
export const RULES = {
  /** Preise-und-Produkte Nr. 2: windows below this area are billed as this area */
  minAreaM2: 0.8,
  /** Nr. 3: fixed glazing discount on the window price */
  fixedDiscount: 0.15,
  /** Nr. 3: surcharge per two-sash window with Stulp */
  stulpSurcharge: 120,
  /** Nr. 4: Aufsatzrollladen, per running metre of window width */
  shutterPerMeter: 95,
  /** Nr. 6: from this number of windows (pieces) ... */
  volumeThreshold: 10,
  /** ... this discount applies on the window prices only */
  volumeDiscount: 0.05,
  /** Montagebedingungen §2: flat fee per order (travel, site setup, covering) */
  installationFlat: 450,
  /** Montagebedingungen §2: removal and disposal per old window */
  removalPerWindow: 60,
  /** Montagebedingungen §2: inside sill per running metre (optional) */
  sillPerMeter: 38,
  /** 19 % VAT, confirmed by Fenster Nord */
  vatRate: 0.19,
} as const

export type Opening = 'dreh-kipp' | 'fest' | 'stulp'

export interface WindowItem {
  id: string
  widthMm: number
  heightMm: number
  quantity: number
  opening: Opening
  shutter: boolean
  /** Optional inside sill, length = window width (assumption, checked at measurement) */
  sill: boolean
}

export interface QuoteInput {
  product: Product
  windows: WindowItem[]
  postcode: string
  /** 0 = Erdgeschoss, 1 = 1. Obergeschoss, ... */
  floor: number
}

export interface QuoteLine {
  windowId: string
  quantity: number
  widthMm: number
  heightMm: number
  opening: Opening
  /** Real area of one window in m² */
  areaM2: number
  /** Area used for pricing (minimum 0,8 m²) */
  billedAreaM2: number
  /** Price of one window incl. opening type, before volume discount */
  unitNet: number
  /** unitNet × quantity */
  windowNet: number
  shutterNet: number
  sillNet: number
}

export interface Quote {
  available: true
  lines: QuoteLine[]
  windowCount: number
  /** Sum of window prices before volume discount */
  windowsNet: number
  /** Volume discount as a positive amount (0 if not applicable) */
  volumeDiscountNet: number
  shuttersNet: number
  sillsNet: number
  installationFlatNet: number
  removalNet: number
  installationNet: number
  net: number
  vat: number
  gross: number
  notices: Notice[]
}

export interface UnavailableQuote {
  available: false
  reason: Exclude<PostcodeStatus, 'ok'> | 'no-windows'
  notices: Notice[]
}

export type QuoteResult = Quote | UnavailableQuote

/** Rounds to cents. Used for display values and the final totals only. */
export function roundCents(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function areaM2(widthMm: number, heightMm: number): number {
  return (widthMm * heightMm) / 1_000_000
}

/** Price of one window (net), before volume discount. Rule order: Nr. 2, Nr. 1, Nr. 3. */
export function windowUnitNet(product: Product, widthMm: number, heightMm: number, opening: Opening): number {
  const billed = Math.max(areaM2(widthMm, heightMm), RULES.minAreaM2)
  let price = billed * product.pricePerM2
  if (opening === 'fest') price *= 1 - RULES.fixedDiscount
  if (opening === 'stulp') price += RULES.stulpSurcharge
  return price
}

export function calculateQuote(input: QuoteInput): QuoteResult {
  const { product, windows, postcode, floor } = input
  const notices = getNotices({ windows, postcode, floor })

  const postcodeStatus = getPostcodeStatus(postcode)
  if (postcodeStatus !== 'ok') return { available: false, reason: postcodeStatus, notices }

  const items = windows.filter((w) => w.quantity > 0)
  if (items.length === 0) return { available: false, reason: 'no-windows', notices }

  const windowCount = items.reduce((sum, w) => sum + w.quantity, 0)

  // Full precision inside the loop. Rounding happens once at the end.
  const raw = items.map((w) => {
    const widthM = w.widthMm / 1000
    const unit = windowUnitNet(product, w.widthMm, w.heightMm, w.opening)
    return {
      item: w,
      unit,
      window: unit * w.quantity,
      shutter: w.shutter ? RULES.shutterPerMeter * widthM * w.quantity : 0,
      sill: w.sill ? RULES.sillPerMeter * widthM * w.quantity : 0,
    }
  })

  const windowsRaw = raw.reduce((s, r) => s + r.window, 0)
  const discountRaw = windowCount >= RULES.volumeThreshold ? windowsRaw * RULES.volumeDiscount : 0
  const shuttersRaw = raw.reduce((s, r) => s + r.shutter, 0)
  const sillsRaw = raw.reduce((s, r) => s + r.sill, 0)
  const removalRaw = RULES.removalPerWindow * windowCount
  const installationRaw = RULES.installationFlat + removalRaw + sillsRaw

  const netRaw = windowsRaw - discountRaw + shuttersRaw + installationRaw
  const net = roundCents(netRaw)
  const vat = roundCents(net * RULES.vatRate)

  const lines: QuoteLine[] = raw.map((r) => ({
    windowId: r.item.id,
    quantity: r.item.quantity,
    widthMm: r.item.widthMm,
    heightMm: r.item.heightMm,
    opening: r.item.opening,
    areaM2: areaM2(r.item.widthMm, r.item.heightMm),
    billedAreaM2: Math.max(areaM2(r.item.widthMm, r.item.heightMm), RULES.minAreaM2),
    unitNet: roundCents(r.unit),
    windowNet: roundCents(r.window),
    shutterNet: roundCents(r.shutter),
    sillNet: roundCents(r.sill),
  }))

  return {
    available: true,
    lines,
    windowCount,
    windowsNet: roundCents(windowsRaw),
    volumeDiscountNet: roundCents(discountRaw),
    shuttersNet: roundCents(shuttersRaw),
    sillsNet: roundCents(sillsRaw),
    installationFlatNet: RULES.installationFlat,
    removalNet: roundCents(removalRaw),
    installationNet: roundCents(installationRaw),
    net,
    vat,
    gross: roundCents(net + vat),
    notices,
  }
}
