import { motion } from 'framer-motion'
import { ShieldAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { DURATION, EASING } from '../animations/motion-tokens'

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  variant = 'default',
  children,
}: {
  title?: string
  message?: string
  variant?: 'default' | 'unauthorized' | 'noanswer'
  children?: ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: DURATION.NORMAL, ease: EASING.SMOOTH }}
      className="flex flex-col items-center justify-center rounded-2xl border border-line bg-surface px-6 py-14 text-center shadow-card"
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${
          variant === 'unauthorized'
            ? 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400'
            : 'bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400'
        }`}
      >
        <ShieldAlert className="h-7 w-7" />
      </motion.div>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted">{message}</p>
      {children && <div className="mt-6">{children}</div>}
    </motion.div>
  )
}

