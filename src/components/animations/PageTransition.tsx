import { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { DURATION, EASING } from './motion-tokens'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
      transition={{
        duration: DURATION.PAGE,
        ease: EASING.SMOOTH,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
