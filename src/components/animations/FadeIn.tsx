import { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { DURATION, EASING } from './motion-tokens'

interface FadeInProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
  once?: boolean
}

export function FadeIn({
  children,
  delay = 0,
  duration = DURATION.NORMAL,
  className = '',
  once = true,
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once }}
      transition={{
        duration: shouldReduceMotion ? 0.1 : duration,
        delay,
        ease: EASING.EASE_OUT,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
