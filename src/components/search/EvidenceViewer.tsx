import { ExternalLink, BookOpen, Search, FileText } from 'lucide-react'

export function EvidenceViewer({
  document,
  page,
  totalPages,
  highlighted = true,
  onViewFull,
}: {
  document: string
  page: number
  totalPages: number
  highlighted?: boolean
  onViewFull?: () => void
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div className="flex items-center justify-between border-b border-line-soft px-5 py-3.5">
        <div>
          <p className="text-sm font-semibold text-ink">Evidence</p>
          <p className="text-xs font-medium text-green-600 dark:text-green-400">Verified Source</p>
        </div>
        <BookOpen className="h-5 w-5 text-faint" />
      </div>

      <div className="px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-faint">Document</p>
        <p className="mt-0.5 truncate text-sm font-medium text-ink">{document}</p>
        <div className="mt-3 inline-flex rounded-lg bg-surface-muted px-3 py-2">
          <p className="text-[11px] text-muted">
            Page <span className="text-sm font-semibold text-ink">{page}</span> of {totalPages}
          </p>
        </div>
      </div>

      <div className="mx-5 mb-4 overflow-hidden rounded-xl border border-line bg-surface shadow-md">
        <div className="flex items-center justify-between border-b border-line bg-surface-soft px-3.5 py-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-red-500" />
            <span className="text-[11px] font-mono font-medium text-ink">{document} · Page {page}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Page {page} Photo Evidence
            </span>
          </div>
        </div>

        {/* Realistic PDF Document Page Photo Sheet */}
        <div className="relative bg-[#1A1D24] dark:bg-[#18181A] p-4 font-sans">
          <div className="mx-auto rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#212121] p-5 text-[11px] leading-relaxed text-slate-800 dark:text-[#ECECEC] shadow-lg">
            <div className="mb-3 flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#8E8E8E]">
                {document}
              </span>
              <span className="text-[10px] font-mono font-semibold text-[#10a37f]">
                PAGE {page} OF {totalPages}
              </span>
            </div>

            <p className="font-bold text-slate-900 dark:text-white text-xs mb-1">
              5.4 Data Retention &amp; Governance Policy
            </p>
            <p className="text-slate-600 dark:text-[#8E8E8E]">
              Customer records and authorized knowledge assets must be retained in accordance with applicable regulatory and operational mandates...
            </p>

            {highlighted && (
              <div className="my-2.5 rounded-md border-l-4 border-[#10a37f] bg-emerald-500/10 px-3 py-2 text-[#10a37f] font-medium shadow-xs">
                "All retained data must be stored within the organization's secure vector vault and access is governed strictly by role-based authorization."
              </div>
            )}

            <p className="text-slate-600 dark:text-[#8E8E8E]">
              Records older than the specified retention window will be securely purged in compliance with enterprise data disposal protocols.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-t border-line-soft px-5 py-3.5">
        <button
          onClick={onViewFull}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium text-ink transition hover:bg-surface-muted"
        >
          <BookOpen className="h-4 w-4" />
          View Full Document
        </button>
        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20">
          <ExternalLink className="h-4 w-4" />
          Open Source
        </button>
      </div>
    </div>
  )
}
