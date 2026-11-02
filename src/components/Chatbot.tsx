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

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-6 z-20 min-h-14 animate-pop rounded-full bg-brand-teal px-5 font-extrabold text-white shadow-lg transition duration-150 active:scale-95"
        aria-label="Fragen zu Fenster Nord stellen (Demo-Assistent)"
      >
        Fragen? 💬
      </button>
    )
  }

  return (
    <div role="dialog" aria-label="Demo-Assistent" className="fixed inset-0 z-30 flex animate-slide-up flex-col bg-white sm:mx-auto sm:max-w-md">
      <div className="flex items-center justify-between bg-brand-teal px-4 py-3 text-white">
        <div>
          <p className="font-extrabold">Assistent von Fenster Nord</p>
          <p className="text-sm opacity-80">Demo · vorgefertigte Antworten, keine KI</p>
        </div>
        <button type="button" onClick={() => setOpen(false)} className="min-h-11 shrink-0 whitespace-nowrap px-3 font-semibold" aria-label="Chat schließen">
          Schließen ✕
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] animate-fade-up rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
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
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ihre Frage"
            className="h-14 min-w-0 flex-1 rounded-xl border-2 border-line px-4 text-base outline-none focus:border-brand-green"
          />
          <button type="submit" className="min-h-14 rounded-xl bg-brand-yellow px-5 font-extrabold">
            Senden
          </button>
        </form>
      </div>
    </div>
  )
}
