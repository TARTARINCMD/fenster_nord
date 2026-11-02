import { createDraft, type WindowDraft } from './lib/drafts'

/** 1 Ort, 2 Fenster, 3 System, 4 Preis, 5 Anfrage, 6 Zusammenfassung */
export type Step = 1 | 2 | 3 | 4 | 5 | 6

export interface Contact {
  name: string
  phone: string
  email: string
  timeNote: string
}

export interface Appointment {
  /** ISO date, e.g. 2026-11-09 */
  date: string
  slot: string
}

export type RequestMode = 'request' | 'appointment'

export interface AppState {
  step: Step
  postcode: string
  /** 0 = Erdgeschoss ... 3 = 3. OG oder höher. Null until chosen. */
  floor: number | null
  windows: WindowDraft[]
  expandedId: string | null
  productId: string | null
  contact: Contact
  mode: RequestMode
  appointment: Appointment | null
}

export type Action =
  | { type: 'patch'; patch: Partial<AppState> }
  | { type: 'go'; step: Step }
  | { type: 'addWindow'; copyLast: boolean }
  | { type: 'updateWindow'; id: string; patch: Partial<WindowDraft> }
  | { type: 'removeWindow'; id: string }
  | { type: 'reset' }

export function initialState(): AppState {
  const first = createDraft()
  return {
    step: 1,
    postcode: '',
    floor: null,
    windows: [first],
    expandedId: first.id,
    productId: null,
    contact: { name: '', phone: '', email: '', timeNote: '' },
    mode: 'request',
    appointment: null,
  }
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'patch':
      return { ...state, ...action.patch }
    case 'go':
      return { ...state, step: action.step }
    case 'addWindow': {
      const last = state.windows[state.windows.length - 1]
      const draft =
        action.copyLast && last
          ? createDraft({ ...last, id: undefined })
          : createDraft()
      return { ...state, windows: [...state.windows, draft], expandedId: draft.id }
    }
    case 'updateWindow':
      return {
        ...state,
        windows: state.windows.map((w) => (w.id === action.id ? { ...w, ...action.patch } : w)),
      }
    case 'removeWindow': {
      const windows = state.windows.filter((w) => w.id !== action.id)
      return {
        ...state,
        windows,
        expandedId: state.expandedId === action.id ? (windows[windows.length - 1]?.id ?? null) : state.expandedId,
      }
    }
    case 'reset':
      return initialState()
  }
}
