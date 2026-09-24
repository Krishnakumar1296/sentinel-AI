import { Eye, FileText } from 'lucide-react'

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
      className={`group w-full rounded-2xl border p-4 text-left transition-all duration-150 ${
        selected
          ? 'border-blue-500/70 bg-blue-50/40 dark:bg-blue-950/25 ring-1 ring-blue-500/30 shadow-xs'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40'
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
            selected
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'
          }`}
        >
          {citation}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-xs font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Page {page}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Match confidence</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{relevance}%</span>
        </div>
        <span className="flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
          <Eye className="h-3.5 w-3.5" />
          View Evidence
        </span>
      </div>

      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-500"
          style={{ width: `${relevance}%` }}
        />
      </div>
    </button>
  )
}

