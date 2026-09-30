import { useState, ReactNode } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { EASING } from './motion-tokens'

interface AnimatedTooltipProps {
  content: ReactNode
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  delay?: number
}

export function AnimatedTooltip({
  content,
  children,
  position = 'top',
  className = '',
  delay = 0.15,
}: AnimatedTooltipProps) {
  const [visible, setVisible] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }[position]

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: position === 'top' ? 4 : -4 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: position === 'top' ? 4 : -4 }}
            transition={{ duration: 0.16, delay, ease: EASING.SMOOTH }}
            className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-lg border border-slate-700/80 bg-slate-900/95 px-2.5 py-1 text-[11px] font-medium text-slate-200 shadow-xl backdrop-blur-xs ${positionStyles}`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
