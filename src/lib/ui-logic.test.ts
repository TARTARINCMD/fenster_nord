import { describe, expect, it } from 'vitest'
import { answerQuestion } from './chatbot'
import { createDraft, isDraftValid, parseCm, toWindowItems, windowErrors } from './drafts'
import { products } from './products'
import { evaluateSystems } from './systems'
import { reducer, initialState } from '../state'

describe('parseCm', () => {
  it('converts cm text to mm, accepts decimal comma', () => {
    expect(parseCm('120')).toBe(1200)
    expect(parseCm('120,5')).toBe(1205)
    expect(parseCm(' 60 ')).toBe(600)
  })
  it('rejects empty, zero, negative and text', () => {
    for (const v of ['', '  ', '0', '-5', 'abc']) expect(parseCm(v), v).toBeNull()
  })
})

describe('window drafts', () => {
  it('errors in cm against the limits of all systems (40 to 240 cm wide, 40 to 260 cm high)', () => {
    expect(windowErrors(createDraft({ widthCm: '30', heightCm: '100' }), false).width).toContain('40 und 240 cm')
    expect(windowErrors(createDraft({ widthCm: '100', heightCm: '270' }), false).height).toContain('40 und 260 cm')
    expect(windowErrors(createDraft({ widthCm: '240', heightCm: '260' }), false)).toEqual({ width: undefined, height: undefined })
  })
  it('empty fields only show errors once the customer tried to continue', () => {
    expect(windowErrors(createDraft(), false)).toEqual({})
    expect(windowErrors(createDraft(), true).width).toBeDefined()
  })
  it('converts valid drafts to items, null if any is invalid', () => {
    const ok = createDraft({ widthCm: '120', heightCm: '140' })
    expect(isDraftValid(ok)).toBe(true)
    expect(toWindowItems([ok])![0]).toMatchObject({ widthMm: 1200, heightMm: 1400, quantity: 1 })
    expect(toWindowItems([ok, createDraft()])).toBeNull()
    expect(toWindowItems([])).toBeNull()
  })
  it('copying a draft gives it a new id', () => {
    const state = initialState()
    const filled = reducer(state, { type: 'updateWindow', id: state.windows[0].id, patch: { widthCm: '100', heightCm: '120' } })
    const copied = reducer(filled, { type: 'addWindow', copyLast: true })
    expect(copied.windows).toHaveLength(2)
    expect(copied.windows[1].id).not.toBe(copied.windows[0].id)
    expect(copied.windows[1]).toMatchObject({ widthCm: '100', heightCm: '120' })
    expect(copied.expandedId).toBe(copied.windows[1].id)
  })
})

describe('evaluateSystems (step 3)', () => {
  const item = (widthMm: number, heightMm: number) => ({
    id: 'a', widthMm, heightMm, quantity: 1, opening: 'dreh-kipp' as const, shutter: false, sill: false,
  })

  it('all six fit a normal window, cheapest first', () => {
    const options = evaluateSystems(products, [item(1200, 1400)], '22000', 0)
    expect(options.every((o) => o.fits)).toBe(true)
    expect(options[0].product.id).toBe('FN-K70-2')
    const prices = options.map((o) => o.quote!.gross)
    expect([...prices].sort((a, b) => a - b)).toEqual(prices)
  })

  it('a 190 cm wide window excludes Classic 70 (max 180 cm) and Nordic 68 (max 180 cm) with a reason', () => {
    const options = evaluateSystems(products, [item(1900, 1000)], '22000', 0)
    const classic = options.find((o) => o.product.id === 'FN-K70-2')!
    expect(classic.fits).toBe(false)
    expect(classic.reason).toContain('Fenster 1 passt nicht')
    expect(classic.reason).toContain('180 cm')
    expect(options.find((o) => o.product.id === 'FN-H68-3')!.fits).toBe(false)
    expect(options.find((o) => o.product.id === 'FN-K82-3')!.fits).toBe(true)
    expect(options.slice(-2).every((o) => !o.fits)).toBe(true) // non-fitting sorted last
  })

  it('a 250 cm high window only fits Slim 75 (max 260 cm)', () => {
    const fitting = evaluateSystems(products, [item(1000, 2500)], '22000', 0).filter((o) => o.fits)
    expect(fitting.map((o) => o.product.id)).toEqual(['FN-A75-3'])
  })
})

describe('chatbot (scripted demo)', () => {
  it('answers from the documents', () => {
    expect(answerQuestion('Ist das Aufmaß kostenlos?')).toContain('kostenlos')
    expect(answerQuestion('Wie lange dauert die Lieferung?')).toContain('6 bis 8 Wochen')
    expect(answerQuestion('Gibt es Förderung?')).toContain('vor Vorhabenbeginn')
    expect(answerQuestion('Muss ich selbst streichen?')).toContain('Malerarbeiten')
  })
  it('funding answer lists only systems with Uw ≤ 0,95 and promises nothing', () => {
    const a = answerQuestion('Kann ich BAFA Zuschuss bekommen?')
    expect(a).toContain('Therm 82 Plus')
    expect(a).toContain('Nordic 68')
    expect(a).not.toContain('Slim 75')
    expect(a).not.toContain('Classic 70')
    expect(a).toContain('Förderzusage oder einen Betrag können wir hier nicht nennen')
  })
  it('"Beginn" does not trigger the BEG answer, unknown questions get the fallback', () => {
    expect(answerQuestion('Wann ist Baubeginn?')).not.toContain('BEG')
    expect(answerQuestion('Wie ist das Wetter?')).toContain('Aufmaß')
  })
})
