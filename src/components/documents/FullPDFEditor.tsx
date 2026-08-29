import { useMemo, useState } from 'react'
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, FilePlus2 } from 'lucide-react'
import { PAGE_BREAK } from '../../services/api'

interface FullPDFEditorProps {
  value: string
  documentName: string
  pages: number
  initialPage?: number
  onChange: (value: string) => void
}

function defaultPageLines(page: number): string[] {
  return [
    page % 2 === 0 ? '5.4 Data Retention Requirements' : '4.2 Access Control Standards',
    '',
    `This section outlines the mandatory retention and disposal requirements applicable to all company records and customer data. Page ${page} of this document.`,
    '',
    'All retained data must be securely stored within the organization\'s vector vault and access is governed strictly by role-based authorization.',
    '',
    'Click directly on this page to edit any line.',
  ]
}

export function FullPDFEditor({ value, documentName, pages, initialPage = 1, onChange }: FullPDFEditorProps) {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [zoom, setZoom] = useState(100)
  const min = 50
  const max = 200

  const pageTexts = useMemo(() => {
    const parts = value.split(PAGE_BREAK).map((p) => (p.trim() === '' ? [] : p.split('\n')))
    while (parts.length < Math.max(1, pages)) parts.push(defaultPageLines(parts.length + 1))
    return parts
  }, [value, pages])

  const pageLines = pageTexts[currentPage - 1] ?? defaultPageLines(currentPage)
  const clampPage = (p: number) => Math.min(Math.max(p, 1), pageTexts.length)

  const updatePageLines = (lines: string[]) => {
    const next = [...pageTexts]
    next[currentPage - 1] = lines
    onChange(next.map((p) => p.join('\n')).join(PAGE_BREAK))
  }

  const updateLine = (idx: number, text: string) => {
    const next = [...pageLines]
    next[idx] = text
    updatePageLines(next)
  }

  const addPage = () => {
    const next = [...pageTexts, defaultPageLines(pageTexts.length + 1)]
    onChange(next.map((p) => p.join('\n')).join(PAGE_BREAK))
    setCurrentPage(next.length)
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
      <div className="flex flex-wrap items-center gap-2 border-b border-line-soft px-3 py-2">
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom((z) => Math.max(min, z - 10))} className="rounded-md p-1.5 text-muted hover:bg-surface-soft" title="Zoom out">
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-sm font-medium text-ink">{zoom}%</span>
          <button onClick={() => setZoom((z) => Math.min(max, z + 10))} className="rounded-md p-1.5 text-muted hover:bg-surface-soft" title="Zoom in">
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>

        <span className="hidden text-[11px] font-medium text-green-600 dark:text-green-400 sm:flex">
          Edit mode — click any text on the page to change it
        </span>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setCurrentPage(clampPage(currentPage - 1))} disabled={currentPage <= 1} className="rounded-md p-1.5 text-muted hover:bg-surface-soft disabled:opacity-40">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="whitespace-nowrap text-sm text-muted">
            Page <span className="font-semibold text-ink">{currentPage}</span> / {pageTexts.length}
          </span>
          <button onClick={() => setCurrentPage(clampPage(currentPage + 1))} disabled={currentPage >= pageTexts.length} className="rounded-md p-1.5 text-muted hover:bg-surface-soft disabled:opacity-40">
            <ChevronRight className="h-4 w-4" />
          </button>
          <button onClick={addPage} className="inline-flex items-center gap-1 rounded-md bg-surface-soft px-2 py-1.5 text-xs font-medium text-muted hover:text-ink">
            <FilePlus2 className="h-3.5 w-3.5" /> Add Page
          </button>
        </div>
      </div>

      <div className="flex">
        <div className="hidden w-32 overflow-y-auto border-r border-line-soft bg-surface-muted/40 p-2 sm:block">
          {pageTexts.map((_, i) => {
            const p = i + 1
            return (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`mb-1.5 flex h-24 w-full flex-col items-center justify-center rounded-lg border text-[10px] font-medium transition ${
                  p === currentPage
                    ? 'border-brand-blue bg-brand-blue/10 text-brand-blue'
                    : 'border-line bg-surface text-muted hover:border-line'
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

        <div className="flex-1 overflow-x-auto bg-surface-soft/60 p-4 sm:p-6">
          <div
            className="mx-auto w-full max-w-xl rounded-lg bg-surface p-6 shadow-sm ring-1 ring-line sm:p-8"
            style={{ fontSize: `${12 + (zoom - 100) / 30}px` }}
          >
            <div className="mb-4 flex items-center justify-between border-b border-line pb-2.5">
              <span className="truncate text-[11px] font-semibold uppercase tracking-wide text-muted">{documentName}</span>
              <span className="ml-2 shrink-0 text-[10px] font-medium text-faint">Page {currentPage} of {pageTexts.length}</span>
            </div>
            <div className="min-h-[260px] space-y-1.5 leading-relaxed">
              {pageLines.map((line, i) =>
                line.trim() === '' ? (
                  <div key={i} className="h-3" />
                ) : (
                  <p
                    key={i}
                    contentEditable
                    suppressContentEditableWarning
                    spellCheck={false}
                    title="Click to edit this line"
                    onBlur={(e) => updateLine(i, e.currentTarget.textContent ?? '')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') e.preventDefault()
                    }}
                    className="cursor-text rounded-sm px-1.5 py-0.5 text-muted outline-none transition hover:bg-brand-blue/5 focus:bg-brand-blue/10 focus:ring-2 focus:ring-brand-blue/30"
                  >
                    {line}
                  </p>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}