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
          ? 'border-[#2563EB]/40 bg-blue-50/60 ring-2 ring-[#2563EB]/10'
          : 'border-[#E2E8F0] bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
          {citation}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-[#172033]">{title}</p>
          <p className="text-xs text-[#64748B]">Page {page}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#64748B]">Relevance</span>
          <span className="text-sm font-bold text-[#172033]">{relevance}%</span>
        </div>
        <span className="flex items-center gap-1 text-xs font-medium text-[#2563EB]">
          <Eye className="h-3.5 w-3.5" />
          View Evidence
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[#2563EB] transition-all duration-700"
          style={{ width: `${relevance}%` }}
        />
      </div>
    </button>
  )
}
