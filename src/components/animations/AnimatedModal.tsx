import { ReactNode, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { EASING } from './motion-tokens'

interface AnimatedModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  maxWidth?: string
}

export function AnimatedModal({
  isOpen,
  onClose,
  children,
  className = '',
  maxWidth = 'max-w-xl',
}: AnimatedModalProps) {
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Dialog Container */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.25, ease: EASING.SMOOTH }}
            className={`relative z-10 w-full ${maxWidth} rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden ${className}`}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

interface AnimatedDropdownProps {
  isOpen: boolean
  children: ReactNode
  className?: string
}

export function AnimatedDropdown({
  isOpen,
  children,
  className = '',
}: AnimatedDropdownProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -6 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -6 }}
          transition={{ duration: 0.18, ease: EASING.SMOOTH }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
