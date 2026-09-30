import { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { DURATION, EASING } from './motion-tokens'

interface FadeDownProps {
  children: ReactNode
  delay?: number
  duration?: number
  distance?: number
  className?: string
  once?: boolean
}

export function FadeDown({
  children,
  delay = 0,
  duration = DURATION.NORMAL,
  distance = 16,
  className = '',
  once = true,
}: FadeDownProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -distance }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
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
