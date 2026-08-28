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

      <div className="mx-5 mb-4 overflow-hidden rounded-xl border border-line shadow-sm">
        <div className="flex items-center justify-between bg-surface-soft px-3 py-1.5">
          <span className="text-[11px] font-medium text-muted">{document} · Page {page}</span>
          <div className="flex gap-1 text-faint">
            <Search className="h-3 w-3" />
            <FileText className="h-3 w-3" />
          </div>
        </div>
        <div className="bg-surface p-4 text-[11px] leading-relaxed text-muted">
          <p className="font-semibold text-ink">5.4 Data Retention Requirements</p>
          <p className="mt-1">
            Customer records must be retained in accordance with applicable regulatory and
            operational requirements...
          </p>
          {highlighted && (
            <p className="evidence-highlight mt-1 text-brand-blue">
              All retained data must be stored within the organization's secure vector vault and
              access is governed by role-based authorization.
            </p>
          )}
          <p className="mt-1">
            Records older than the retention period will be securely purged in line with the
            organization's disposal policy...
          </p>
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
