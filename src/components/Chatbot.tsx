import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CHAT_GREETING, SUGGESTED_QUESTIONS, answerQuestion } from '../lib/chatbot'
import { Chip } from './ui'

interface Message {
  from: 'bot' | 'user'
  text: string
}

export function Chatbot() {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [messages, setMessages] = useState<Message[]>([{ from: 'bot', text: CHAT_GREETING }])
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages, open])

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('open-chat', handler)
    return () => window.removeEventListener('open-chat', handler)
  }, [])

  function ask(question: string) {
    const q = question.trim()
    if (!q) return
    setMessages((m) => [...m, { from: 'user', text: q }, { from: 'bot', text: answerQuestion(q) }])
    setText('')
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    ask(text)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      ask(text)
    }
  }

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-30 flex justify-center md:items-center md:bg-brand-teal/50 md:p-6">
    <div role="dialog" aria-modal="true" aria-label="Demo-Assistent" className="flex h-full w-full animate-slide-up flex-col overflow-hidden bg-white md:h-[40rem] md:max-h-full md:max-w-lg md:rounded-3xl md:shadow-xl">
      <div className="flex items-center justify-between bg-brand-teal px-4 py-3 text-white">
        <p className="font-extrabold">Assistent von Fenster Nord</p>
        <button type="button" onClick={() => setOpen(false)} className="-mr-2 flex size-12 items-center justify-center rounded-lg text-3xl opacity-60 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-teal" aria-label="Chat schließen">
          ✕
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] animate-fade-up rounded-2xl px-4 py-3 text-[0.9375rem] leading-relaxed ${
              m.from === 'bot' ? 'bg-brand-teal/5' : 'ml-auto bg-brand-yellow'
            }`}
          >
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="border-t border-line px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {SUGGESTED_QUESTIONS.map((q) => (
            <div key={q} className="shrink-0">
              <Chip onClick={() => ask(q)}>{q}</Chip>
            </div>
          ))}
        </div>
        <form onSubmit={submit} className="flex gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ihre Frage"
            rows={1}
            className="min-h-14 min-w-0 flex-1 resize-none rounded-xl border-2 border-line px-4 py-4 text-base outline-none focus-visible:border-brand-green focus-visible:ring-2 focus-visible:ring-brand-green/30"
          />
          <button type="submit" className="min-h-14 rounded-xl bg-brand-yellow px-5 font-extrabold">
            Senden
          </button>
        </form>
      </div>
    </div>
    </div>
  )
}
