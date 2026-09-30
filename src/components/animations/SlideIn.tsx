import { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { DURATION, EASING } from './motion-tokens'

interface SlideInProps {
  children: ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
  distance?: number
  delay?: number
  duration?: number
  className?: string
  once?: boolean
}

export function SlideIn({
  children,
  direction = 'left',
  distance = 24,
  delay = 0,
  duration = DURATION.NORMAL,
  className = '',
  once = true,
}: SlideInProps) {
  const shouldReduceMotion = useReducedMotion()

  const offset = {
    left: { x: -distance, y: 0 },
    right: { x: distance, y: 0 },
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
  }[direction]

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, ...offset }}
      whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0, y: 0 }}
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
