import type { Opening, WindowItem } from './pricing'
import { products } from './products'
import { checkGlobalHeight, checkGlobalWidth } from './validation'

/** A window as the customer is typing it: sizes in cm as text. */
export interface WindowDraft {
  id: string
  widthCm: string
  heightCm: string
  quantity: number
  opening: Opening
  shutter: boolean
  sill: boolean
}

export const MAX_QUANTITY = 50

function newId(): string {
  return globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)
}

export function createDraft(partial: Partial<WindowDraft> = {}): WindowDraft {
  return {
    widthCm: '',
    heightCm: '',
    quantity: 1,
    opening: 'dreh-kipp',
    shutter: false,
    sill: false,
    ...partial,
    // After the spread: `{ ...other, id: undefined }` must still get a fresh id.
    id: partial.id ?? newId(),
  }
}

/** "120" or "120,5" (cm) -> mm. Null if empty or not a positive number. */
export function parseCm(text: string): number | null {
  const n = Number(text.trim().replace(',', '.'))
  return text.trim() !== '' && Number.isFinite(n) && n > 0 ? Math.round(n * 10) : null
}

export interface DraftErrors {
  width?: string
  height?: string
}

/** Errors against the limits of ALL systems. Whether one specific system fits is checked in step 3. */
export function windowErrors(draft: WindowDraft, showEmpty: boolean): DraftErrors {
  const errors: DraftErrors = {}
  const w = parseCm(draft.widthCm)
  const h = parseCm(draft.heightCm)
  if (draft.widthCm.trim() === '') {
    if (showEmpty) errors.width = 'Bitte geben Sie die Breite ein.'
  } else if (w === null) {
    errors.width = 'Bitte geben Sie eine Zahl in cm ein, zum Beispiel 120.'
  } else {
    errors.width = checkGlobalWidth(products, w)
  }
  if (draft.heightCm.trim() === '') {
    if (showEmpty) errors.height = 'Bitte geben Sie die Höhe ein.'
  } else if (h === null) {
    errors.height = 'Bitte geben Sie eine Zahl in cm ein, zum Beispiel 140.'
  } else {
    errors.height = checkGlobalHeight(products, h)
  }
  return errors
}

export function isDraftValid(draft: WindowDraft): boolean {
  const e = windowErrors(draft, true)
  return !e.width && !e.height && draft.quantity >= 1
}

export function toWindowItem(draft: WindowDraft): WindowItem | null {
  const widthMm = parseCm(draft.widthCm)
  const heightMm = parseCm(draft.heightCm)
  if (widthMm === null || heightMm === null || !isDraftValid(draft)) return null
  return {
    id: draft.id,
    widthMm,
    heightMm,
    quantity: draft.quantity,
    opening: draft.opening,
    shutter: draft.shutter,
    sill: draft.sill,
  }
}

/** All items, or null if any window is incomplete or invalid. */
export function toWindowItems(drafts: WindowDraft[]): WindowItem[] | null {
  const items = drafts.map(toWindowItem)
  return items.every((i): i is WindowItem => i !== null) && items.length > 0 ? items : null
}
