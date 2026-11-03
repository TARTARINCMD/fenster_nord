import { RULES } from './pricing'
import { products } from './products'
import { mayQualifyForBeg, BEG_UW_LIMIT } from './funding'
import { formatEUR } from './format'

/**
 * Scripted demo chatbot. No AI model, no backend: fixed answers taken from Fenster Nord's documents.
 * It never promises a price or a funding amount.
 */
interface Topic {
  keywords: string[]
  answer: () => string
}

const FALLBACK =
  'Dazu kann ich Ihnen hier leider nichts Verlässliches sagen. Beim kostenlosen Aufmaß beantwortet Ihnen ein Mitarbeiter alle Fragen.'

const topics: Topic[] = [
  {
    keywords: ['förder', 'foerder', 'beg', 'bafa', 'zuschuss', 'zuschüsse'],
    answer: () => {
      const names = products.filter(mayQualifyForBeg).map((p) => p.name).join(', ')
      return `Ob ein Fenster förderfähig sein kann, hängt vom Uw-Wert ab: Die BEG-Förderung verlangt höchstens ${String(BEG_UW_LIMIT).replace('.', ',')} W/(m²K). Das erreichen laut Produktliste: ${names}. Eine Förderzusage oder einen Betrag können wir hier nicht nennen. Der Antrag muss vor Vorhabenbeginn gestellt werden, und wir prüfen die Voraussetzungen beim Aufmaß.`
    },
  },
  {
    keywords: ['aufmaß', 'aufmass', 'kostenlos', 'vor ort', 'termin'],
    answer: () =>
      'Das Aufmaß vor Ort ist kostenlos. Ein Mitarbeiter misst Ihre Fenster aus, bevor ein Auftrag zustande kommt. Den Termin können Sie am Ende des Rechners wählen (in dieser Vorschau wird nichts gebucht).',
  },
  {
    keywords: ['lieferzeit', 'liefer', 'wie lange', 'dauer', 'wann'],
    answer: () => 'Die Lieferzeit beträgt in der Regel 6 bis 8 Wochen ab Aufmaß.',
  },
  {
    keywords: ['unverbindlich', 'verbindlich', 'festpreis', 'garantie', 'genau'],
    answer: () =>
      'Der Preis hier ist ein unverbindlicher Richtpreis. Den genauen Preis erhalten Sie nach dem Aufmaß vor Ort.',
  },
  {
    keywords: ['maler', 'streichen', 'anstrich'],
    answer: () => 'Malerarbeiten sind in der Montage nicht enthalten.',
  },
  {
    keywords: ['gerüst', 'geruest', 'obergeschoss', 'etage', 'stock'],
    answer: () =>
      'Bei Fenstern ab dem 2. Obergeschoss kann ein Gerüst nötig sein. Das klären wir beim Aufmaß. Es ist im Richtpreis nicht enthalten.',
  },
  {
    keywords: ['montage', 'einbau', 'ausbau', 'entsorg', 'laibung'],
    answer: () =>
      `Die Montage umfasst den Ausbau der alten Fenster, die Entsorgung, den Einbau nach RAL-Leitfaden mit Abdichtung innen und außen und das Beiputzen der Laibungen. Im Richtpreis rechnen wir ${formatEUR(RULES.installationFlat)} Pauschale je Auftrag und ${formatEUR(RULES.removalPerWindow)} je Altfenster (netto).`,
  },
  {
    keywords: ['fensterbank'],
    answer: () =>
      `Eine Fensterbank innen können Sie als Zusatz wählen. Sie kostet ${formatEUR(RULES.sillPerMeter)} je laufendem Meter (netto). Wir rechnen mit der Fensterbreite, die genaue Länge klären wir beim Aufmaß.`,
  },
  {
    keywords: ['rolllad', 'rollläd', 'rollad', 'rolläd', 'rollo'],
    answer: () =>
      `Wir bieten Aufsatzrollläden mit Gurtwickler an: ${formatEUR(RULES.shutterPerMeter)} je laufendem Meter Fensterbreite (netto).`,
  },
  {
    keywords: ['farbe', 'farben', 'weiß', 'weiss', 'dekor'],
    answer: () => 'Weiß ist Standard. Andere Farben und Dekore gibt es auf Anfrage.',
  },
  {
    keywords: ['gebiet', 'plz', 'postleitzahl', 'hamburg', 'einsatz', 'anfahrt'],
    answer: () =>
      'Wir montieren in den Postleitzahlen 20000 bis 25999 ohne Aufpreis. Für Aufträge außerhalb berechnen wir einen Anfahrtszuschlag nach Absprache.',
  },
  {
    keywords: ['steuer', 'umsatzsteuer', 'mwst', 'netto', 'brutto'],
    answer: () =>
      `Alle Grundpreise sind Nettopreise. Wir zeigen Ihnen den Gesamtpreis inklusive ${Math.round(RULES.vatRate * 100)} % Umsatzsteuer und zusätzlich netto.`,
  },
  {
    keywords: ['voraussetzung', 'strom', 'möbel', 'moebel', 'zugang'],
    answer: () =>
      'Für die Montage brauchen wir freien Zugang zu den Fenstern, Möbel mindestens 1,5 m abgerückt und einen Stromanschluss (230 V) in der Nähe.',
  },
  {
    keywords: ['groß', 'gross', 'zwei-mann', 'zweimann', '3,0'],
    answer: () =>
      'Elemente mit mehr als 3,0 m² Fläche werden aus Sicherheitsgründen zu zweit eingebaut. Ein möglicher Mehraufwand wird beim Aufmaß geklärt und ist im Richtpreis nicht enthalten.',
  },
]

export const SUGGESTED_QUESTIONS = [
  'Ist das Aufmaß kostenlos?',
  'Wie lange dauert die Lieferung?',
  'Gibt es Förderung?',
  'Was ist in der Montage enthalten?',
  'Ist der Preis verbindlich?',
]

export const CHAT_GREETING =
  'Hallo! Ich bin der Demo-Assistent von Fenster Nord. Ich beantworte Fragen zu Aufmaß, Montage, Lieferzeit und Förderung. Verbindliche Preise nennt Ihnen ein Mitarbeiter nach dem Aufmaß.'

export function answerQuestion(question: string): string {
  const q = question.toLowerCase()
  const words = q.split(/[^a-zäöüß0-9,]+/).filter(Boolean)
  // Short keywords must match a whole word ("beg" must not match "Beginn"), longer ones match word starts.
  const matches = (k: string) =>
    k.includes(' ') ? q.includes(k) : words.some((w) => (k.length <= 4 ? w === k : w.startsWith(k)))
  const topic = topics.find((t) => t.keywords.some(matches))
  return topic ? topic.answer() : FALLBACK
}
