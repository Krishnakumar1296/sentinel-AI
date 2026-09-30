import { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { EASING } from './motion-tokens'

interface StaggerContainerProps {
  children: ReactNode
  staggerDelay?: number
  delayChildren?: number
  className?: string
  once?: boolean
  viewportAmount?: number
}

export function StaggerContainer({
  children,
  staggerDelay = 0.08,
  delayChildren = 0,
  className = '',
  once = true,
  viewportAmount = 0.15,
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: viewportAmount }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
            delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: ReactNode
  className?: string
  yOffset?: number
}

export function StaggerItem({
  children,
  className = '',
  yOffset = 16,
}: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      variants={{
        hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: yOffset },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.4,
            ease: EASING.SMOOTH,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
