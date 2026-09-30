import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Check } from 'lucide-react'
import { DURATION, EASING } from '../animations/motion-tokens'

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: DURATION.NORMAL, ease: EASING.SMOOTH }}
      className="card p-5 border border-brand-blue/30 shadow-card"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">Processing Document</p>
        <span className="text-xs font-mono font-medium text-brand-blue">
          {Math.min(step + 1, stages.length)} / {stages.length}
        </span>
      </div>
      <div className="mt-4 space-y-3">
        {stages.map((s, i) => (
          <div key={s} className="flex items-center gap-3 text-sm">
            <span className="flex h-5 w-5 items-center justify-center">
              <AnimatePresence mode="wait">
                {i < step && (
                  <motion.span
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/10 text-green-600 dark:text-green-400"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </motion.span>
                )}
                {i === step && (
                  <motion.span
                    key="spinner"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex h-5 w-5 items-center justify-center"
                  >
                    <Loader2 className="h-4 w-4 animate-spin text-brand-blue" />
                  </motion.span>
                )}
                {i > step && (
                  <span className="h-2.5 w-2.5 rounded-full border border-line bg-surface-soft" />
                )}
              </AnimatePresence>
            </span>
            <span
              className={`transition-colors duration-200 ${
                i < step
                  ? 'text-ink/80'
                  : i === step
                  ? 'font-semibold text-brand-blue'
                  : 'text-faint'
              }`}
            >
              {s}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

