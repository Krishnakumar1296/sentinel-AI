import { useState } from 'react'
import { ZoomIn, ZoomOut, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react'

export function PDFViewer({
  document,
  currentPage,
  totalPages,
  highlightPage,
  onPageChange,
}: {
  document: string
  currentPage: number
  totalPages: number
  highlightPage?: number
  onPageChange: (page: number) => void
}) {
  const [zoom, setZoom] = useState(100)
  const min = 50
  const max = 200

  const clampPage = (p: number) => Math.min(Math.max(p, 1), totalPages)
  const isHighlighted = highlightPage === currentPage

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div className="flex flex-wrap items-center gap-2 border-b border-line-soft px-4 py-3">
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom((z) => Math.max(min, z - 10))} className="rounded-md p-1.5 text-muted hover:bg-surface-soft" title="Zoom out">
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-sm font-medium text-ink">{zoom}%</span>
          <button onClick={() => setZoom((z) => Math.min(max, z + 10))} className="rounded-md p-1.5 text-muted hover:bg-surface-soft" title="Zoom in">
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
        <div className="mx-2 hidden h-5 w-px bg-line sm:block" />
        <button className="hidden items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted hover:bg-surface-soft sm:flex">
          <Search className="h-4 w-4" /> Search
        </button>
        <button className="hidden items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted hover:bg-surface-soft sm:flex">
          <Download className="h-4 w-4" /> Download
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => onPageChange(clampPage(currentPage - 1))}
            disabled={currentPage <= 1}
            className="rounded-md p-1.5 text-muted hover:bg-surface-soft disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="whitespace-nowrap text-sm text-muted">
            Page <span className="font-semibold text-ink">{currentPage}</span> / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(clampPage(currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="rounded-md p-1.5 text-muted hover:bg-surface-soft disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex overflow-hidden" style={{ height: 'min(70vh, 640px)' }}>
        <div className="hidden w-36 overflow-y-auto border-r border-line-soft p-2 sm:block">
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1
            return (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`mb-1.5 flex h-24 w-full flex-col items-center justify-center rounded-lg border text-[10px] font-medium transition ${
                  p === currentPage
                    ? 'border-brand-blue bg-brand-blue/10 text-brand-blue'
                    : 'border-line bg-surface-muted text-muted hover:border-line'
                }`}
              >
                <div className="flex h-12 w-9 items-center justify-center rounded border border-line bg-surface">
                  <span className="text-[8px] text-faint">{p}</span>
                </div>
                <span className="mt-1">Page {p}</span>
              </button>
            )
          })}
        </div>

        <div className="flex-1 overflow-auto bg-surface-soft/60 p-6">
          <div
            className="mx-auto w-full max-w-xl rounded-lg bg-surface p-8 shadow-sm transition-all"
            style={{ fontSize: `${12 + (zoom - 100) / 30}px`, minHeight: 'calc(100% - 48px)' }}
          >
            <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
              <span className="text-xs font-semibold text-muted">{document}</span>
              <span className="text-xs text-faint">Page {currentPage} of {totalPages}</span>
            </div>
            <div className="space-y-3 leading-relaxed text-muted">
              <p className="text-sm font-bold text-brand-blue">
                {currentPage % 2 === 0 ? '5.4 Data Retention Requirements' : '4.2 Access Control Standards'}
              </p>
              <p>
                This section outlines the mandatory retention and disposal requirements applicable to
                all company records and customer data. All personnel must comply with these standards.
              </p>
              {isHighlighted && (
                <p className="evidence-highlight">
                  All retained data must be securely stored within the organization's vector vault.
                  Access is governed strictly by role-based authorization and verified at every
                  retrieval request.
                </p>
              )}
              <p>
                Where records exceed the defined retention period, they shall be removed in
                accordance with the disposal schedule and audit requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
