import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

interface SvgDrawRevealProps {
  children?: React.ReactNode
  className?: string
  duration?: number
  delay?: number
}

export function SvgDrawReveal({
  children,
  className = '',
  duration = 1.6,
  delay = 0.2,
}: SvgDrawRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: delay * 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn('relative inline-flex items-center justify-center', className)}
    >
      {children}
    </motion.div>
  )
}

/**
 * Animated SVG Shield Icon with stroke draw reveal effect
 */
export function SentinelDrawLogo({
  size = 48,
  className = '',
  strokeColor = '#0284c7',
}: {
  size?: number
  className?: string
  strokeColor?: string
}) {
  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      {/* Background glow burst */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.25, scale: 1.4 }}
        transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
        className="pointer-events-none absolute -inset-2 rounded-full bg-sky-500 blur-xl"
      />

      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* Shield Outer Path */}
        <motion.path
          d="M24 4L8 10V22C8 31.94 14.82 41.16 24 44C33.18 41.16 40 31.94 40 22V10L24 4Z"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        />

        {/* Inner Core Cyber Matrix */}
        <motion.path
          d="M24 16V32M16 24H32"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{ duration: 0.8, delay: 0.8, ease: 'easeInOut' }}
        />

        {/* Center Node Diamond */}
        <motion.polygon
          points="24,20 28,24 24,28 20,24"
          fill={strokeColor}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2, type: 'spring' }}
        />
      </svg>
    </div>
  )
}

export default SvgDrawReveal
