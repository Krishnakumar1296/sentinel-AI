import React, { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { EASING } from './motion-tokens'

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  className?: string
  scaleHover?: number
  scaleTap?: number
  asMotionDiv?: boolean
}

export function AnimatedButton({
  children,
  className = '',
  scaleHover = 1.02,
  scaleTap = 0.98,
  disabled,
  ...props
}: AnimatedButtonProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.button
      whileHover={disabled || shouldReduceMotion ? {} : { scale: scaleHover }}
      whileTap={disabled || shouldReduceMotion ? {} : { scale: scaleTap }}
      transition={{ duration: 0.15, ease: EASING.SNAPPY }}
      disabled={disabled}
      className={className}
      {...(props as any)}
    >
      {children}
    </motion.button>
  )
}
