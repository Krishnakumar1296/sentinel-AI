import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

export function ProgressStepper({ running, onComplete }: { running: boolean; onComplete: () => void }) {
  const stages = [
    'Document uploaded',
    'PDF pages extracted',
    'Content processed',
    'Generating embeddings',
    'Adding to secure vector vault',
  ]
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!running) return
    setStep(0)
    const interval = setInterval(() => {
      setStep((s) => {
        if (s < stages.length - 1) return s + 1
        clearInterval(interval)
        onComplete()
        return s
      })
    }, 700)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  if (!running) return null

  return (
    <div className="card p-5">
      <p className="text-sm font-semibold text-ink">Processing Document</p>
      <div className="mt-4 space-y-3">
        {stages.map((s, i) => (
          <div key={s} className="flex items-center gap-3 text-sm">
            <span className="flex h-5 w-5 items-center justify-center">
              {i < step && (
                <svg className="h-4 w-4 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {i === step && <Loader2 className="h-4 w-4 animate-spin text-brand-blue" />}
              {i > step && <span className="h-3 w-3 rounded-full border border-line" />}
            </span>
            <span className={i <= step ? 'font-medium text-ink' : 'text-faint'}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
