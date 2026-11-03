import { describe, expect, it } from 'vitest'
import {
  MAX_QUANTITY,
  createDraft,
  isDraftValid,
  parseCm,
  toWindowItem,
  toWindowItems,
  windowErrors,
  type WindowDraft,
} from './drafts'

const valid = (partial: Partial<WindowDraft> = {}) => createDraft({ widthCm: '120', heightCm: '140', ...partial })

describe('createDraft', () => {
  it('starts with empty sizes, one tilt-and-turn window, no shutter, no sill', () => {
    const d = createDraft()
    expect(d).toMatchObject({
      widthCm: '',
      heightCm: '',
      quantity: 1,
      opening: 'dreh-kipp',
      shutter: false,
      sill: false,
    })
  })

  it('gives every draft its own id', () => {
    expect(createDraft().id).not.toBe(createDraft().id)
  })

  it('keeps a given id', () => {
    expect(createDraft({ id: 'abc' }).id).toBe('abc')
  })

  it('gives a fresh id if a copied draft has id undefined', () => {
    const d = createDraft({ ...valid(), id: undefined })
    expect(typeof d.id).toBe('string')
    expect(d.id.length).toBeGreaterThan(0)
  })

  it('applies overrides', () => {
    expect(createDraft({ opening: 'fest', quantity: 4 })).toMatchObject({ opening: 'fest', quantity: 4 })
  })
})

describe('parseCm', () => {
  it('converts "120" cm to 1200 mm', () => {
    expect(parseCm('120')).toBe(1200)
  })

  it('accepts a decimal comma: "120,5" to 1205 mm', () => {
    expect(parseCm('120,5')).toBe(1205)
  })

  it('accepts a decimal point: "120.5" to 1205 mm', () => {
    expect(parseCm('120.5')).toBe(1205)
  })

  it('ignores surrounding spaces', () => {
    expect(parseCm(' 140 ')).toBe(1400)
  })

  it('rounds to whole millimetres', () => {
    expect(parseCm('120,04')).toBe(1200)
  })

  it.each(['', '   ', '0', '-5', 'abc', '12a', 'Infinity'])('returns null for "%s"', (text) => {
    expect(parseCm(text)).toBeNull()
  })
})

describe('windowErrors', () => {
  it('shows no error for an empty field while the user has not tried to continue', () => {
    expect(windowErrors(createDraft(), false)).toEqual({})
  })

  it('asks for width and height if empty and showEmpty is set', () => {
    expect(windowErrors(createDraft(), true)).toEqual({
      width: 'Bitte geben Sie die Breite ein.',
      height: 'Bitte geben Sie die Höhe ein.',
    })
  })

  it('shows no error for 120 x 140 cm', () => {
    expect(windowErrors(valid(), true)).toEqual({})
  })

  it('asks for a number in cm if the width is text', () => {
    expect(windowErrors(valid({ widthCm: 'abc' }), false).width).toBe(
      'Bitte geben Sie eine Zahl in cm ein, zum Beispiel 120.',
    )
  })

  it('asks for a number in cm if the height is text', () => {
    expect(windowErrors(valid({ heightCm: 'abc' }), false).height).toBe(
      'Bitte geben Sie eine Zahl in cm ein, zum Beispiel 140.',
    )
  })

  it('treats width 0 as not a number', () => {
    expect(windowErrors(valid({ widthCm: '0' }), false).width).toContain('Zahl in cm')
  })

  it('accepts width 40 cm (400 mm) and rejects 39,9 cm', () => {
    expect(windowErrors(valid({ widthCm: '40' }), true).width).toBeUndefined()
    expect(windowErrors(valid({ widthCm: '39,9' }), true).width).toBe('Die Breite muss zwischen 40 und 240 cm liegen.')
  })

  it('accepts width 240 cm and rejects 240,1 cm', () => {
    expect(windowErrors(valid({ widthCm: '240' }), true).width).toBeUndefined()
    expect(windowErrors(valid({ widthCm: '240,1' }), true).width).toBeDefined()
  })

  it('accepts height 40 cm and rejects 39,9 cm', () => {
    expect(windowErrors(valid({ heightCm: '40' }), true).height).toBeUndefined()
    expect(windowErrors(valid({ heightCm: '39,9' }), true).height).toBe('Die Höhe muss zwischen 40 und 260 cm liegen.')
  })

  it('accepts height 260 cm and rejects 260,1 cm', () => {
    expect(windowErrors(valid({ heightCm: '260' }), true).height).toBeUndefined()
    expect(windowErrors(valid({ heightCm: '260,1' }), true).height).toBeDefined()
  })

  it('reports width and height independently', () => {
    const e = windowErrors(valid({ widthCm: '500' }), true)
    expect(e.width).toBeDefined()
    expect(e.height).toBeUndefined()
  })
})

describe('isDraftValid', () => {
  it('is true for 120 x 140 cm, quantity 1', () => {
    expect(isDraftValid(valid())).toBe(true)
  })

  it('is false for an empty draft', () => {
    expect(isDraftValid(createDraft())).toBe(false)
  })

  it('is false if the width is out of range', () => {
    expect(isDraftValid(valid({ widthCm: '300' }))).toBe(false)
  })

  it('is false for quantity 0', () => {
    expect(isDraftValid(valid({ quantity: 0 }))).toBe(false)
  })

  it('is true for the maximum quantity', () => {
    expect(isDraftValid(valid({ quantity: MAX_QUANTITY }))).toBe(true)
  })
})

describe('toWindowItem', () => {
  it('converts cm text to mm and keeps the options', () => {
    const d = valid({ id: 'x', quantity: 3, opening: 'stulp', shutter: true, sill: true, widthCm: '150,5' })
    expect(toWindowItem(d)).toEqual({
      id: 'x',
      widthMm: 1505,
      heightMm: 1400,
      quantity: 3,
      opening: 'stulp',
      shutter: true,
      sill: true,
    })
  })

  it('returns null for an incomplete draft', () => {
    expect(toWindowItem(createDraft({ widthCm: '120' }))).toBeNull()
  })

  it('returns null for a size outside all systems', () => {
    expect(toWindowItem(valid({ heightCm: '300' }))).toBeNull()
  })

  it('returns null for quantity 0', () => {
    expect(toWindowItem(valid({ quantity: 0 }))).toBeNull()
  })
})

describe('toWindowItems', () => {
  it('converts all drafts', () => {
    const items = toWindowItems([valid({ id: 'a' }), valid({ id: 'b', widthCm: '60', heightCm: '60' })])
    expect(items?.map((i) => i.id)).toEqual(['a', 'b'])
  })

  it('returns null if one draft is invalid', () => {
    expect(toWindowItems([valid(), createDraft()])).toBeNull()
  })

  it('returns null for an empty list', () => {
    expect(toWindowItems([])).toBeNull()
  })
})
