import { useRef, useState } from 'react'
import { UploadCloud, FileText, X } from 'lucide-react'

export function UploadZone({ onFile, disabled }: { onFile: (file: File) => void; disabled?: boolean }) {
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const f = files[0]
    setFileName(f.name)
    onFile(f)
  }

  return (
    <div
      className={`relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition ${
        dragging ? 'border-[#2563EB] bg-blue-50/50' : 'border-slate-300 bg-white hover:border-slate-400'
      } ${disabled ? 'pointer-events-none opacity-60' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {fileName ? (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3">
          <FileText className="h-6 w-6 text-red-500" />
          <div className="text-left">
            <p className="text-sm font-semibold text-[#172033]">{fileName}</p>
            <p className="text-xs text-[#64748B]">PDF</p>
          </div>
          {!disabled && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setFileName(null)
              }}
              className="rounded-md p-1 text-[#64748B] hover:bg-slate-200 hover:text-[#172033]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]">
            <UploadCloud className="h-7 w-7" />
          </div>
          <p className="text-base font-semibold text-[#172033]">Drag &amp; Drop PDF Here</p>
          <p className="mt-1 text-sm text-[#64748B]">or</p>
          <button className="btn-secondary mt-3">Browse Files</button>
          <p className="mt-4 text-xs text-[#64748B]">Supported format: PDF</p>
        </>
      )}
    </div>
  )
}
