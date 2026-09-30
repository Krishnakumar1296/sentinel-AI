import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, FileText, X } from 'lucide-react'
import { DURATION, EASING } from '../animations/motion-tokens'

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
    <motion.div
      animate={{
        scale: dragging ? 1.01 : 1,
        borderColor: dragging ? 'rgba(59, 130, 246, 0.8)' : undefined,
      }}
      transition={{ duration: DURATION.FAST, ease: EASING.SMOOTH }}
      className={`relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
        dragging ? 'border-brand-blue bg-brand-blue/10 dark:bg-brand-blue/5' : 'border-line bg-surface hover:border-brand-blue/50'
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
      <AnimatePresence mode="wait">
        {fileName ? (
          <motion.div
            key="file-selected"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: DURATION.FAST, ease: EASING.SMOOTH }}
            className="flex items-center gap-3.5 rounded-xl border border-line bg-surface-muted px-5 py-3 shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-500 dark:text-red-400">
              <FileText className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-ink">{fileName}</p>
              <p className="text-xs text-muted">Ready for processing</p>
            </div>
            {!disabled && (
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation()
                  setFileName(null)
                }}
                className="rounded-lg p-1 text-muted transition-colors hover:bg-surface-soft hover:text-ink"
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="upload-prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.FAST }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ y: dragging ? -4 : [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue border border-brand-blue/20 shadow-sm"
            >
              <UploadCloud className="h-7 w-7" />
            </motion.div>
            <p className="text-base font-semibold text-ink">Drag &amp; Drop PDF Here</p>
            <p className="mt-1 text-xs text-muted">or click to browse your local device</p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              className="btn-secondary mt-4 text-xs font-semibold shadow-sm"
            >
              Browse Files
            </motion.button>
            <p className="mt-4 text-[11px] font-mono text-muted">Supported format: PDF up to 50MB</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

