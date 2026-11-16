import { Sparkles } from 'lucide-react'

const swatches = [
  { name: 'primary-500', className: 'bg-primary-500' },
  { name: 'primary-600', className: 'bg-primary-600' },
  { name: 'primary-100', className: 'bg-primary-100' },
  { name: 'accent-400', className: 'bg-accent-400' },
  { name: 'success', className: 'bg-success' },
  { name: 'warning', className: 'bg-warning' },
  { name: 'danger', className: 'bg-danger' },
]

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-surface border border-line rounded-2xl shadow-card p-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-linear-to-br from-primary-500 to-accent-400 text-white">
            <Sparkles size={22} />
          </div>
          <h1 className="text-3xl font-bold">TaskNova</h1>
        </div>

        <p className="mt-3 text-ink-muted">
          Pré-visualização do tema: azul elétrico e ciano sobre um fundo claro.
        </p>

        <div className="mt-6 grid grid-cols-4 gap-3">
          {swatches.map((s) => (
            <div key={s.name} className="text-center">
              <div className={`h-12 rounded-lg ${s.className}`} />
              <span className="text-xs text-ink-muted">{s.name}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button className="px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors">
            Botão principal
          </button>
          <button className="px-4 py-2 rounded-lg border border-line text-ink hover:bg-primary-50 transition-colors">
            Botão secundário
          </button>
        </div>

        <input
          className="mt-6 w-full rounded-lg border border-line px-3 py-2 outline-none focus:border-primary-500 focus:shadow-glow transition"
          placeholder="Clica aqui para ver o realce do campo"
        />
      </div>
    </div>
  )
}

export default App