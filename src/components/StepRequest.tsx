import { useMemo } from 'react'
import { SLOTS, dayFormat, isoToDate, longDayFormat, nextWeekdays, toIso } from '../lib/dates'
import { Shell } from './Shell'
import type { StepProps } from './types'
import { Chip, Field, Notice, StepTitle, TextInput } from './ui'

export function StepRequest({ state, dispatch }: StepProps) {
  const { contact, mode, appointment } = state
  const days = useMemo(() => nextWeekdays(10), [])

  const hasContactWay = contact.phone.trim() !== '' || contact.email.trim() !== ''
  const emailOk = contact.email.trim() === '' || /^\S+@\S+\.\S+$/.test(contact.email.trim())
  const contactOk = contact.name.trim() !== '' && hasContactWay && emailOk
  const appointmentOk = mode === 'request' || (appointment !== null && appointment.date !== '' && appointment.slot !== '')
  const canSend = contactOk && appointmentOk

  const set = (patch: Partial<typeof contact>) => dispatch({ type: 'patch', patch: { contact: { ...contact, ...patch } } })

  return (
    <Shell
      step={5}
      onBack={() => dispatch({ type: 'go', step: 4 })}
      primary={{
        label: mode === 'appointment' ? 'Termin verbindlich buchen (Vorschau)' : 'Anfrage absenden (Vorschau)',
        disabled: !canSend,
        onClick: () => dispatch({ type: 'go', step: 6 }),
      }}
    >
      <StepTitle title="Kostenloses Aufmaß" subtitle="Ein Mitarbeiter misst Ihre Fenster vor Ort aus. Erst danach erhalten Sie einen verbindlichen Preis." />

      <Notice tone="info">
        <strong>Vorschau:</strong> In dieser Demo wird nichts verschickt oder gebucht. Am Ende sehen Sie eine Zusammenfassung.
      </Notice>

      <div className="mt-6 space-y-5">
        <Field label="Ihr Name">
          <TextInput autoComplete="name" value={contact.name} onChange={(e) => set({ name: e.target.value })} />
        </Field>
        <Field label="Telefon" hint="Telefon oder E-Mail genügt.">
          <TextInput type="tel" autoComplete="tel" inputMode="tel" value={contact.phone} onChange={(e) => set({ phone: e.target.value })} />
        </Field>
        <Field label="E-Mail" error={!emailOk ? 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' : undefined}>
          <TextInput
            type="email"
            autoComplete="email"
            inputMode="email"
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
                className={`min-h-14 rounded-xl border-2 px-3 font-semibold ${
                  mode === value ? 'border-brand-green bg-brand-green/10' : 'border-line bg-white'
                }`}
              >
                {label}
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
                      onClick={() =>
                        dispatch({ type: 'patch', patch: { appointment: { date: iso, slot: appointment?.slot ?? '' } } })
                      }
                    >
                      <span className={appointment?.date === iso ? 'underline decoration-brand-green decoration-4 underline-offset-4' : ''}>
                        {dayFormat.format(d)}
                      </span>
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
                    onClick={() =>
                      dispatch({ type: 'patch', patch: { appointment: { date: appointment?.date ?? '', slot } } })
                    }
                  >
                    <span className={appointment?.slot === slot ? 'underline decoration-brand-green decoration-4 underline-offset-4' : ''}>
                      {slot}
                    </span>
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
