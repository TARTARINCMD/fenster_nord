import { useEffect, useReducer } from 'react'
import { Chatbot } from './components/Chatbot'
import { StepLanding } from './components/StepLanding'
import { StepLocation } from './components/StepLocation'
import { StepPrice } from './components/StepPrice'
import { StepRequest } from './components/StepRequest'
import { StepSummary } from './components/StepSummary'
import { StepSystem } from './components/StepSystem'
import { StepWindows } from './components/StepWindows'
import { initialState, reducer } from './state'

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [state.step])

  const props = { state, dispatch }

  return (
    <>
      {/* New element per step, so the slide animation (index.css, [data-dir]) runs on every step change. */}
      <div key={state.step} data-dir={state.direction}>
        {state.step === 0 && <StepLanding {...props} />}
        {state.step === 1 && <StepLocation {...props} />}
        {state.step === 2 && <StepWindows {...props} />}
        {state.step === 3 && <StepSystem {...props} />}
        {state.step === 4 && <StepPrice {...props} />}
        {state.step === 5 && <StepRequest {...props} />}
        {state.step === 6 && <StepSummary {...props} />}
      </div>
      {state.step === 6 && <Chatbot />}
    </>
  )
}
