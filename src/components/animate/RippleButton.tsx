import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

interface Ripple {
  x: number
  y: number
  id: number
  size: number
}

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  rippleColor?: string
  duration?: number
}

export function RippleButton({
  children,
  className = '',
  rippleColor = 'rgba(255, 255, 255, 0.4)',
  duration = 600,
  onClick,
  ...props
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    const newRipple: Ripple = {
      x,
      y,
      size,
      id: Date.now(),
    }

    setRipples((prev) => [...prev, newRipple])

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
    }, duration)

    onClick?.(e)
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={handleClick}
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 select-none',
        className
      )}
      {...(props as any)}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>

      {/* Ripples */}
      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full animate-ping"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              backgroundColor: rippleColor,
              animationDuration: `${duration}ms`,
              transform: 'scale(0)',
              animation: `ripple-expand ${duration}ms cubic-bezier(0.1, 0.8, 0.3, 1) forwards`,
            }}
          />
        ))}
      </span>
    </motion.button>
  )
}

export default RippleButton
