import { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { EASING } from './motion-tokens'

interface HoverCardProps {
  children: ReactNode
  className?: string
  hoverY?: number
  hoverScale?: number
  onClick?: () => void
}

export function HoverCard({
  children,
  className = '',
  hoverY = -3,
  hoverScale = 1.012,
  onClick,
}: HoverCardProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      whileHover={
        shouldReduceMotion
          ? {}
          : {
              y: hoverY,
              scale: hoverScale,
              transition: { duration: 0.2, ease: EASING.SMOOTH },
            }
      }
      whileTap={shouldReduceMotion ? {} : { scale: 0.99 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  )
}
