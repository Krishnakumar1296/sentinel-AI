import { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { DURATION, EASING } from './motion-tokens'

interface ScaleInProps {
  children: ReactNode
  delay?: number
  duration?: number
  initialScale?: number
  className?: string
  once?: boolean
}

export function ScaleIn({
  children,
  delay = 0,
  duration = DURATION.NORMAL,
  initialScale = 0.95,
  className = '',
  once = true,
}: ScaleInProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: initialScale }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      viewport={{ once }}
      transition={{
        duration,
        delay,
        ease: EASING.SMOOTH,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
