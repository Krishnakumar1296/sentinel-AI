import { ShieldCheck, ScanSearch } from 'lucide-react'

export function SourcePagePreview({
  citation,
  document,
  page,
  totalPages,
  relevance,
  excerpt,
}: {
  citation: number
  document: string
  page: number
  totalPages: number
  relevance: number
  excerpt: string
}) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition hover:shadow-card-md">
      <div className="flex items-center gap-2.5 border-b border-line-soft px-4 py-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-blue/10 text-xs font-bold text-brand-blue">
          {citation}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink" title={document}>{document}</p>
          <p className="text-[11px] text-muted">Relevance {relevance}%</p>
        </div>
        <ShieldCheck className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
      </div>

      <div className="relative bg-surface-soft/70 px-5 py-6">
        <div className="mx-auto w-full max-w-[250px] rounded-md bg-surface p-5 shadow-md ring-1 ring-line">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <span className="truncate text-[10px] font-semibold uppercase tracking-wide text-ink">
              {document}
            </span>
            <span className="ml-2 shrink-0 text-[9px] font-medium text-faint">PDF</span>
          </div>
          <p className="mt-3 text-[11px] font-bold text-brand-blue">
            {page % 2 === 0 ? '5.4 Data Retention Requirements' : '4.2 Access Control Standards'}
          </p>
          <div className="mt-2 space-y-1.5">
            <div className="h-1.5 w-full rounded bg-surface-soft" />
            <div className="h-1.5 w-5/6 rounded bg-surface-soft" />
            <div className="h-1.5 w-full rounded bg-surface-soft" />
            <p className="evidence-highlight mt-2 rounded px-1.5 py-1 text-[10px] leading-relaxed text-brand-blue">
              {excerpt}
            </p>
            <div className="h-1.5 w-3/4 rounded bg-surface-soft" />
            <div className="h-1.5 w-full rounded bg-surface-soft" />
          </div>
        </div>
        <span className="absolute bottom-3 right-4 flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-[11px] font-bold text-white shadow">
          <ScanSearch className="h-3 w-3" />
          Page {page} of {totalPages}
        </span>
      </div>

      <figcaption className="flex items-start gap-2 border-t border-line-soft bg-surface-muted/50 px-4 py-3 text-[11px] leading-relaxed text-muted">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600 dark:text-green-400" />
        <span>
          Verified source excerpt on <span className="font-semibold text-ink">{document} · Page {page}</span>
        </span>
      </figcaption>
    </figure>
  )
}