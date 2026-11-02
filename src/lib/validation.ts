import type { Product } from './products'

/** Montagebedingungen §4: service area without surcharge */
export const SERVICE_AREA = { min: 20000, max: 25999 } as const
/** Montagebedingungen §3: elements above this area are installed by two people (mm²) */
export const TWO_PERSON_AREA_MM2 = 3_000_000
/** Montagebedingungen §5: scaffold may be needed from this floor (2 = 2. Obergeschoss) */
export const SCAFFOLD_FROM_FLOOR = 2

export type PostcodeStatus = 'ok' | 'invalid' | 'outside-service-area'

export function getPostcodeStatus(postcode: string): PostcodeStatus {
  const value = postcode.trim()
  if (!/^\d{5}$/.test(value)) return 'invalid'
  const n = Number(value)
  return n >= SERVICE_AREA.min && n <= SERVICE_AREA.max ? 'ok' : 'outside-service-area'
}

export interface Notice {
  code: 'two-person' | 'scaffold' | 'outside-service-area'
  text: string
}

interface NoticeInput {
  windows: { widthMm: number; heightMm: number; quantity: number }[]
  postcode: string
  floor: number
}

/** Cases for which Fenster Nord gave no price. They are never priced, only announced (assumption A4, confirmed). */
export function getNotices({ windows, postcode, floor }: NoticeInput): Notice[] {
  const notices: Notice[] = []
  if (getPostcodeStatus(postcode) === 'outside-service-area') {
    notices.push({
      code: 'outside-service-area',
      text: 'Ihre Postleitzahl liegt außerhalb unseres Einsatzgebiets (20000 bis 25999). Für Aufträge dort berechnen wir einen Anfahrtszuschlag nach Absprache. Bitte fragen Sie uns direkt.',
    })
  }
  if (windows.some((w) => w.quantity > 0 && w.widthMm * w.heightMm > TWO_PERSON_AREA_MM2)) {
    notices.push({
      code: 'two-person',
      text: 'Fenster über 3,0 m² werden zu zweit eingebaut. Ein möglicher Mehraufwand wird beim Aufmaß geklärt und ist im Richtpreis nicht enthalten.',
    })
  }
  if (floor >= SCAFFOLD_FROM_FLOOR) {
    notices.push({
      code: 'scaffold',
      text: 'Ab dem 2. Obergeschoss kann ein Gerüst nötig sein. Das wird beim Aufmaß geklärt und ist im Richtpreis nicht enthalten.',
    })
  }
  return notices
}

export interface SizeCheck {
  ok: boolean
  /** Human-readable errors in German, sizes in cm */
  width?: string
  height?: string
}

function cm(mm: number): string {
  return String(mm / 10).replace('.', ',')
}

/** Checks the window size against the limits of the chosen system (outer frame, mm). */
export function checkSize(product: Product, widthMm: number, heightMm: number): SizeCheck {
  const result: SizeCheck = { ok: true }
  if (!(widthMm >= product.widthMin && widthMm <= product.widthMax)) {
    result.ok = false
    result.width = `Für ${product.name} muss die Breite zwischen ${cm(product.widthMin)} und ${cm(product.widthMax)} cm liegen.`
  }
  if (!(heightMm >= product.heightMin && heightMm <= product.heightMax)) {
    result.ok = false
    result.height = `Für ${product.name} muss die Höhe zwischen ${cm(product.heightMin)} und ${cm(product.heightMax)} cm liegen.`
  }
  return result
}
