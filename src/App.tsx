import { products } from './lib/products'

export default function App() {
  return (
    <main className="mx-auto max-w-md px-4 py-8">
      <img src="/mvn-logo.svg" alt="mvn.energy" className="h-10" />
      <h1 className="mt-6 text-2xl font-extrabold">Fenster Nord Richtpreis-Rechner</h1>
      <p className="mt-2">{products.length} Fenstersysteme geladen.</p>
    </main>
  )
}
