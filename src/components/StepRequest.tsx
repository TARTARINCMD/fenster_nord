import { useMemo } from 'react'
import { SLOTS, dayFormat, isoToDate, longDayFormat, nextWeekdays, toIso } from '../lib/dates'
import { Shell } from './Shell'
import type { StepProps } from './types'
import { Chip, Field, Notice, RadioDot, StepTitle, TextInput } from './ui'

export function StepRequest({ state, dispatch }: StepProps) {
  const { contact, mode, appointment } = state
  const days = useMemo(() => nextWeekdays(10), [])

  const emailOk = contact.email.trim() === '' || /^\S+@\S+\.\S+$/.test(contact.email.trim())
  const contactOk = contact.name.trim() !== '' && contact.phone.trim() !== '' && emailOk
  const appointmentOk = mode === 'request' || (appointment !== null && appointment.date !== '' && appointment.slot !== '')
  const canSend = contactOk && appointmentOk

  const set = (patch: Partial<typeof contact>) => dispatch({ type: 'patch', patch: { contact: { ...contact, ...patch } } })

  return (
    <Shell
      step={5}
      onBack={() => dispatch({ type: 'go', step: 4 })}
      primary={{
        label: mode === 'appointment' ? 'Terminwunsch absenden' : 'Anfrage absenden',
        disabled: !canSend,
        onClick: () => dispatch({ type: 'go', step: 6 }),
      }}
    >
      <StepTitle title="Kostenloses Aufmaß" subtitle="Ein Mitarbeiter misst Ihre Fenster vor Ort aus. Das Aufmaß ist kostenlos und findet vor dem Auftrag statt." />

      <div className="mt-6 space-y-5">
        <Field label="Ihr Name">
          <TextInput autoComplete="name" value={contact.name} onChange={(e) => set({ name: e.target.value })} />
        </Field>
        <Field label="Telefon">
          <TextInput type="tel" autoComplete="tel" inputMode="tel" placeholder="z. B. 040 123 456 789" value={contact.phone} onChange={(e) => set({ phone: e.target.value })} />
        </Field>
        <Field
          label={
            <>
              E-Mail{' '}
              <span className="font-normal text-brand-teal/70">(optional)</span>
            </>
          }
          error={!emailOk ? 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' : undefined}
        >
          <TextInput
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="ihre@email.de"
            value={contact.email}
            invalid={!emailOk}
            onChange={(e) => set({ email: e.target.value })}
          />
        </Field>

        <fieldset>
          <legend className="mb-2 font-semibold">Wie möchten Sie fortfahren?</legend>
          <div role="radiogroup" className="grid grid-cols-2 gap-2">
            {(
              [
                ['request', 'Rückmeldung abwarten'],
                ['appointment', 'Termin wählen'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={mode === value}
                onClick={() => dispatch({ type: 'patch', patch: { mode: value } })}
                className={`flex min-h-14 items-center justify-between gap-3 rounded-2xl px-4 text-left font-semibold transition duration-100 active:scale-[0.98] active:duration-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 ${
                  mode === value ? 'bg-brand-green/15' : 'bg-gray-100'
                }`}
              >
                <span>{label}</span>
                <RadioDot selected={mode === value} />
              </button>
            ))}
          </div>
        </fieldset>

        {mode === 'request' ? (
          <Field label="Wunschzeitraum (optional)" hint="Zum Beispiel „vormittags“ oder „ab Dezember“.">
            <TextInput value={contact.timeNote} onChange={(e) => set({ timeNote: e.target.value })} />
          </Field>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="mb-2 font-semibold">Tag</p>
              <div className="flex flex-wrap gap-2">
                {days.map((d) => {
                  const iso = toIso(d)
                  return (
                    <Chip
                      key={iso}
                      selected={appointment?.date === iso}
                      onClick={() =>
                        dispatch({ type: 'patch', patch: { appointment: { date: iso, slot: appointment?.slot ?? '' } } })
                      }
                    >
                      {dayFormat.format(d)}
                    </Chip>
                  )
                })}
              </div>
            </div>
            <div>
              <p className="mb-2 font-semibold">Uhrzeit</p>
              <div className="flex flex-wrap gap-2">
                {SLOTS.map((slot) => (
                  <Chip
                    key={slot}
                    selected={appointment?.slot === slot}
                    onClick={() =>
                      dispatch({ type: 'patch', patch: { appointment: { date: appointment?.date ?? '', slot } } })
                    }
                  >
                    {slot}
                  </Chip>
                ))}
              </div>
            </div>
            {appointment?.date && appointment.slot && (
              <Notice tone="good">
                Gewählt: {longDayFormat.format(isoToDate(appointment.date))}, {appointment.slot}
              </Notice>
            )}
          </div>
        )}
      </div>

    </Shell>
  )
}
