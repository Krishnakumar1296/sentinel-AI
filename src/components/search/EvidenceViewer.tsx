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
    <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
        <div>
          <p className="text-sm font-semibold text-[#172033]">Evidence</p>
          <p className="text-xs font-medium text-green-600">Verified Source</p>
        </div>
        <BookOpen className="h-5 w-5 text-slate-400" />
      </div>

      <div className="px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Document</p>
        <p className="mt-0.5 truncate text-sm font-medium text-[#172033]">{document}</p>
        <div className="mt-3 inline-flex rounded-lg bg-slate-50 px-3 py-2">
          <p className="text-[11px] text-[#64748B]">
            Page <span className="text-sm font-semibold text-[#172033]">{page}</span> of {totalPages}
          </p>
        </div>
      </div>

      <div className="mx-5 mb-4 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between bg-slate-100 px-3 py-1.5">
          <span className="text-[11px] font-medium text-slate-500">{document} · Page {page}</span>
          <div className="flex gap-1 text-slate-400">
            <Search className="h-3 w-3" />
            <FileText className="h-3 w-3" />
          </div>
        </div>
        <div className="bg-white p-4 text-[11px] leading-relaxed text-slate-500">
          <p className="font-semibold text-slate-700">5.4 Data Retention Requirements</p>
          <p className="mt-1">
            Customer records must be retained in accordance with applicable regulatory and
            operational requirements...
          </p>
          {highlighted && (
            <p className="evidence-highlight mt-1 text-[#123B5D]">
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

      <div className="flex gap-2 border-t border-slate-100 px-5 py-3.5">
        <button
          onClick={onViewFull}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-[#172033] transition hover:bg-slate-50"
        >
          <BookOpen className="h-4 w-4" />
          View Full Document
        </button>
        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100">
          <ExternalLink className="h-4 w-4" />
          Open Source
        </button>
      </div>
    </div>
  )
}
