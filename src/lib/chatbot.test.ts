import { describe, expect, it } from 'vitest'
import { CHAT_GREETING, SUGGESTED_QUESTIONS, answerQuestion } from './chatbot'
import { products } from './products'

const plain = (s: string) => s.replace(/ /g, ' ')
const FALLBACK_START = 'Dazu kann ich Ihnen hier leider nichts Verlässliches sagen'

describe('answerQuestion topics', () => {
  it('says the measurement visit is free', () => {
    expect(answerQuestion('Ist das Aufmaß kostenlos?')).toContain('kostenlos')
  })

  it('answers "Aufmass" written with ss', () => {
    expect(answerQuestion('Wie läuft das Aufmass ab?')).toContain('Das Aufmaß vor Ort ist kostenlos')
  })

  it('gives the delivery time of 6 to 8 weeks after the measurement', () => {
    expect(answerQuestion('Wie lange dauert die Lieferung?')).toBe(
      'Die Lieferzeit beträgt in der Regel 6 bis 8 Wochen ab Aufmaß.',
    )
  })

  it('answers the price question with "unverbindlich"', () => {
    expect(answerQuestion('Ist der Preis verbindlich?')).toContain('unverbindlicher Richtpreis')
  })

  it('answers a question that uses the word "unverbindlich"', () => {
    expect(answerQuestion('Ist der Preis unverbindlich?')).toContain('unverbindlicher Richtpreis')
  })

  it('answers the plural "Rollläden" with the shutter price', () => {
    expect(plain(answerQuestion('Was kosten Rollläden?'))).toContain('95,00 €')
  })

  it('says painting is not included', () => {
    expect(answerQuestion('Wer macht die Malerarbeiten?')).toContain('nicht enthalten')
  })

  it('says a scaffold may be needed from the 2nd floor', () => {
    const a = answerQuestion('Brauche ich ein Gerüst?')
    expect(a).toContain('ab dem 2. Obergeschoss')
    expect(a).toContain('nicht enthalten')
  })

  it('names the installation prices 450 EUR flat and 60 EUR per old window', () => {
    const a = plain(answerQuestion('Was ist in der Montage enthalten?'))
    expect(a).toContain('450,00 €')
    expect(a).toContain('60,00 €')
  })

  it('names the sill price 38 EUR per metre', () => {
    expect(plain(answerQuestion('Was kostet eine Fensterbank?'))).toContain('38,00 €')
  })

  it('names the shutter price 95 EUR per metre', () => {
    expect(plain(answerQuestion('Was kostet ein Rollladen?'))).toContain('95,00 €')
  })

  it('says white is the standard colour', () => {
    expect(answerQuestion('Gibt es andere Farben?')).toContain('Weiß ist Standard')
  })

  it('names the service area 20000 to 25999', () => {
    expect(answerQuestion('Kommen Sie auch nach Berlin? Meine PLZ ist 10115')).toContain('20000 bis 25999')
  })

  it('says prices are net and VAT is 19 %', () => {
    const a = answerQuestion('Ist das netto oder brutto?')
    expect(a).toContain('19 %')
    expect(a).toContain('Nettopreise')
  })

  it('names the customer prerequisites: 1,5 m, power socket', () => {
    const a = answerQuestion('Was muss ich vorbereiten, Voraussetzung?')
    expect(a).toContain('1,5 m')
    expect(a).toContain('Stromanschluss')
  })

  it('mentions two-person installation above 3,0 m² without a price', () => {
    const a = answerQuestion('Was ist mit 3,0 m² Fenstern?')
    expect(a).toContain('zu zweit')
    expect(a).not.toMatch(/€/)
  })
})

describe('answerQuestion funding', () => {
  const answer = answerQuestion('Gibt es Förderung?')

  it('names the Uw limit 0,95', () => {
    expect(answer).toContain('0,95 W/(m²K)')
  })

  it('lists the four systems with Uw <= 0,95', () => {
    for (const name of [
      'Kunststofffenster Therm 82',
      'Kunststofffenster Therm 82 Plus',
      'Holzfenster Nordic 68',
      'Holz-Alu-Fenster Duo 78',
    ]) {
      expect(answer).toContain(name)
    }
  })

  it('does not list Slim 75 and Classic 70', () => {
    expect(answer).not.toContain('Slim 75')
    expect(answer).not.toContain('Classic 70')
  })

  it('lists exactly the systems from the product list that qualify', () => {
    const excluded = products.filter((p) => p.uw > 0.95).map((p) => p.name)
    for (const name of excluded) expect(answer).not.toContain(name)
  })

  it('gives no amount and no promise', () => {
    expect(answer).toContain('Eine Förderzusage oder einen Betrag können wir hier nicht nennen')
    expect(answer).not.toMatch(/€|%/)
  })

  it('names application before project start', () => {
    expect(answer).toContain('vor Vorhabenbeginn')
  })

  it.each(['BEG', 'BAFA', 'Zuschuss', 'Zuschüsse', 'FÖRDERUNG'])('recognises "%s" as the funding topic', (word) => {
    expect(answerQuestion(`Was ist mit ${word}?`)).toContain('Uw-Wert')
  })
})

describe('answerQuestion matching', () => {
  it('is not case sensitive', () => {
    expect(answerQuestion('LIEFERZEIT')).toContain('6 bis 8 Wochen')
  })

  it('does not match "beg" inside "Beginn"', () => {
    expect(answerQuestion('Beginn')).toContain(FALLBACK_START)
  })

  it('gives the fallback for an unknown question', () => {
    expect(answerQuestion('Wie wird das Wetter morgen?')).toContain(FALLBACK_START)
  })

  it('gives the fallback for an empty question', () => {
    expect(answerQuestion('')).toContain(FALLBACK_START)
  })

  it('gives the fallback for only punctuation', () => {
    expect(answerQuestion('???')).toContain(FALLBACK_START)
  })

  it('points to the free measurement in the fallback', () => {
    expect(answerQuestion('xyz')).toContain('Aufmaß')
  })

  it('answers the first matching topic when several match', () => {
    // funding comes before delivery time in the topic list
    expect(answerQuestion('Förderung und Lieferzeit')).toContain('Uw-Wert')
  })
})

describe('chatbot never promises or invents', () => {
  it('has a suggested question that gets a real answer for each entry', () => {
    for (const q of SUGGESTED_QUESTIONS) expect(answerQuestion(q)).not.toContain(FALLBACK_START)
  })

  it('never promises funding in any suggested answer', () => {
    for (const q of SUGGESTED_QUESTIONS) expect(answerQuestion(q).toLowerCase()).not.toMatch(/garantiert|wird gefördert|erhalten sie \d/)
  })

  it('greets with a note that binding prices come after the measurement', () => {
    expect(CHAT_GREETING).toContain('vor dem Auftrag kommt ein Mitarbeiter zum Aufmaß')
  })
})
