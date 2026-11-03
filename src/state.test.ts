import { describe, expect, it } from 'vitest'
import { initialState, reducer } from './state'

describe('initialState', () => {
  it('starts at step 0 with one empty window', () => {
    const s = initialState()
    expect(s.step).toBe(0)
    expect(s.windows).toHaveLength(1)
    expect(s.windows[0]).toMatchObject({ widthCm: '', heightCm: '', quantity: 1, opening: 'dreh-kipp' })
  })

  it('expands the first window by default', () => {
    const s = initialState()
    expect(s.expandedId).toBe(s.windows[0].id)
  })

  it('has no product selected and no floor chosen', () => {
    const s = initialState()
    expect(s.productId).toBeNull()
    expect(s.floor).toBeNull()
  })
})

describe('reducer — go', () => {
  it('sets direction to forward when the step increases', () => {
    const s = reducer(initialState(), { type: 'go', step: 1 })
    expect(s.step).toBe(1)
    expect(s.direction).toBe('forward')
  })

  it('sets direction to back when the step decreases', () => {
    const at2 = reducer(initialState(), { type: 'go', step: 2 })
    const back = reducer(at2, { type: 'go', step: 1 })
    expect(back.step).toBe(1)
    expect(back.direction).toBe('back')
  })

  it('sets direction to forward when the step stays the same', () => {
    const s = reducer(initialState(), { type: 'go', step: 0 })
    expect(s.direction).toBe('forward')
  })
})

describe('reducer — addWindow', () => {
  it('appends an empty draft and makes it two windows', () => {
    const added = reducer(initialState(), { type: 'addWindow' })
    expect(added.windows).toHaveLength(2)
    expect(added.windows[1]).toMatchObject({ widthCm: '', heightCm: '', quantity: 1 })
  })

  it('gives the new window a unique id', () => {
    const added = reducer(initialState(), { type: 'addWindow' })
    expect(added.windows[1].id).not.toBe(added.windows[0].id)
  })

  it('sets expandedId to the new window', () => {
    const added = reducer(initialState(), { type: 'addWindow' })
    expect(added.expandedId).toBe(added.windows[1].id)
  })
})

describe('reducer — updateWindow', () => {
  it('applies the patch to the right window', () => {
    const base = initialState()
    const s = reducer(base, { type: 'updateWindow', id: base.windows[0].id, patch: { widthCm: '120' } })
    expect(s.windows[0].widthCm).toBe('120')
  })
})

describe('reducer — removeWindow', () => {
  it('removes the window', () => {
    const base = reducer(initialState(), { type: 'addWindow' })
    const removed = reducer(base, { type: 'removeWindow', id: base.windows[0].id })
    expect(removed.windows).toHaveLength(1)
    expect(removed.windows[0].id).toBe(base.windows[1].id)
  })

  it('shifts expandedId to the last window when the expanded one is removed', () => {
    const base = reducer(initialState(), { type: 'addWindow' })
    const expanded = base.expandedId!
    const removed = reducer(base, { type: 'removeWindow', id: expanded })
    expect(removed.expandedId).toBe(base.windows[base.windows.length - 2].id)
  })

  it('keeps expandedId when a different window is removed', () => {
    const base = reducer(initialState(), { type: 'addWindow' })
    const other = base.windows[0].id
    const removed = reducer(base, { type: 'removeWindow', id: other })
    expect(removed.expandedId).toBe(base.expandedId)
  })
})

describe('reducer — reset', () => {
  it('returns to the initial state', () => {
    const changed = reducer(initialState(), { type: 'go', step: 4 })
    const reset = reducer(changed, { type: 'reset' })
    expect(reset.step).toBe(0)
    expect(reset.windows).toHaveLength(1)
  })
})
