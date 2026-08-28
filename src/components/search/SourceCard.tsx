import { Eye } from 'lucide-react'

export function SourceCard({
  citation,
  title,
  page,
  relevance,
  selected,
  onSelect,
}: {
  citation: number
  title: string
  page: number
  relevance: number
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full rounded-2xl border p-4 text-left transition ${
        selected
          ? 'border-brand-blue/40 bg-brand-blue/10 ring-2 ring-brand-blue/10'
          : 'border-line bg-surface hover:border-line hover:bg-surface-muted'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-soft text-xs font-bold text-muted">
          {citation}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{title}</p>
          <p className="text-xs text-muted">Page {page}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted">Relevance</span>
          <span className="text-sm font-bold text-ink">{relevance}%</span>
        </div>
        <span className="flex items-center gap-1 text-xs font-medium text-brand-blue">
          <Eye className="h-3.5 w-3.5" />
          View Evidence
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-soft">
        <div
          className="h-full rounded-full bg-brand-blue transition-all duration-700"
          style={{ width: `${relevance}%` }}
        />
      </div>
    </button>
  )
}
