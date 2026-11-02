import { FLOOR_LABEL } from '../lib/format'
import { getNotices, getPostcodeStatus } from '../lib/validation'
import { Shell } from './Shell'
import type { StepProps } from './types'
import { ChoiceCard, Field, Notice, StepTitle, TextInput } from './ui'

export function StepLocation({ state, dispatch }: StepProps) {
  const status = getPostcodeStatus(state.postcode)
  const notices = getNotices({ windows: [], postcode: state.postcode, floor: state.floor ?? 0 })
  const outside = notices.find((n) => n.code === 'outside-service-area')
  const scaffold = notices.find((n) => n.code === 'scaffold')
  const canContinue = status === 'ok' && state.floor !== null

  return (
    <Shell
      step={1}
      onBack={() => dispatch({ type: 'go', step: 0 })}
      primary={{ label: 'Weiter', disabled: !canContinue, onClick: () => dispatch({ type: 'go', step: 2 }) }}
    >
      <StepTitle
        title="Wo sollen die Fenster eingebaut werden?"
        subtitle="Damit wir wissen, ob wir bei Ihnen montieren und ob ein Gerüst nötig sein könnte."
      />
      <div className="space-y-6">
        <Field label="Postleitzahl" error={state.postcode.length === 5 && status === 'invalid' ? 'Bitte geben Sie eine gültige 5-stellige Postleitzahl ein.' : undefined}>
          <TextInput
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            placeholder="z. B. 22000"
            value={state.postcode}
            invalid={state.postcode.length === 5 && status === 'invalid'}
            onChange={(e) => dispatch({ type: 'patch', patch: { postcode: e.target.value.replace(/\D/g, '') } })}
          />
        </Field>

        {outside && <Notice tone="warn">{outside.text}</Notice>}

        <fieldset>
          <legend className="mb-2 font-semibold">In welchem Stockwerk liegen die Fenster?</legend>
          <div role="radiogroup" className="space-y-2">
            {Object.entries(FLOOR_LABEL).map(([value, label]) => (
              <ChoiceCard
                key={value}
                selected={state.floor === Number(value)}
                onClick={() => dispatch({ type: 'patch', patch: { floor: Number(value) } })}
                title={label}
              />
            ))}
          </div>
        </fieldset>

        {scaffold && <Notice>{scaffold.text}</Notice>}
      </div>
    </Shell>
  )
}
