import { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { DURATION, EASING } from './motion-tokens'

interface FadeUpProps {
  children: ReactNode
  delay?: number
  duration?: number
  distance?: number
  className?: string
  once?: boolean
  viewportAmount?: number
}

export function FadeUp({
  children,
  delay = 0,
  duration = DURATION.NORMAL,
  distance = 18,
  className = '',
  once = true,
  viewportAmount = 0.2,
}: FadeUpProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: distance }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once, amount: viewportAmount }}
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
