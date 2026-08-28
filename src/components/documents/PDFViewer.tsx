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
    <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-card">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom((z) => Math.max(min, z - 10))} className="rounded-md p-1.5 text-[#64748B] hover:bg-slate-100" title="Zoom out">
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-sm font-medium text-[#172033]">{zoom}%</span>
          <button onClick={() => setZoom((z) => Math.min(max, z + 10))} className="rounded-md p-1.5 text-[#64748B] hover:bg-slate-100" title="Zoom in">
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
        <div className="mx-2 hidden h-5 w-px bg-slate-200 sm:block" />
        <button className="hidden items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-[#64748B] hover:bg-slate-100 sm:flex">
          <Search className="h-4 w-4" /> Search
        </button>
        <button className="hidden items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-[#64748B] hover:bg-slate-100 sm:flex">
          <Download className="h-4 w-4" /> Download
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => onPageChange(clampPage(currentPage - 1))}
            disabled={currentPage <= 1}
            className="rounded-md p-1.5 text-[#64748B] hover:bg-slate-100 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="whitespace-nowrap text-sm text-[#64748B]">
            Page <span className="font-semibold text-[#172033]">{currentPage}</span> / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(clampPage(currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="rounded-md p-1.5 text-[#64748B] hover:bg-slate-100 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex overflow-hidden" style={{ height: 'min(70vh, 640px)' }}>
        <div className="hidden w-36 overflow-y-auto border-r border-slate-100 p-2 sm:block">
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1
            return (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`mb-1.5 flex h-24 w-full flex-col items-center justify-center rounded-lg border text-[10px] font-medium transition ${
                  p === currentPage
                    ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]'
                    : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'
                }`}
              >
                <div className="flex h-12 w-9 items-center justify-center rounded border border-slate-300 bg-white">
                  <span className="text-[8px] text-slate-400">{p}</span>
                </div>
                <span className="mt-1">Page {p}</span>
              </button>
            )
          })}
        </div>

        <div className="flex-1 overflow-auto bg-slate-100/60 p-6">
          <div
            className="mx-auto w-full max-w-xl rounded-lg bg-white p-8 shadow-sm transition-all"
            style={{ fontSize: `${12 + (zoom - 100) / 30}px`, minHeight: 'calc(100% - 48px)' }}
          >
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-semibold text-slate-500">{document}</span>
              <span className="text-xs text-slate-400">Page {currentPage} of {totalPages}</span>
            </div>
            <div className="space-y-3 leading-relaxed text-slate-600">
              <p className="text-sm font-bold text-[#123B5D]">
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
