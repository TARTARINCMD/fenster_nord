import type { Dispatch } from 'react'
import type { Action, AppState } from '../state'

export interface StepProps {
  state: AppState
  dispatch: Dispatch<Action>
}
