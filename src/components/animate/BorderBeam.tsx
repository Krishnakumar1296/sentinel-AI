import { motion } from 'framer-motion'

interface BorderBeamProps {
  className?: string
  size?: number
  duration?: number
  borderWidth?: number
  colorFrom?: string
  colorTo?: string
  delay?: number
}

export function BorderBeam({
  className = '',
  size = 120,
  duration = 8,
  borderWidth = 1.5,
  colorFrom = '#3b82f6',
  colorTo = '#8b5cf6',
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)] ${className}`}
    >
      <motion.div
        className="absolute aspect-square bg-gradient-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent"
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round 16px)`,
            '--color-from': colorFrom,
            '--color-to': colorTo,
          } as React.CSSProperties
        }
        initial={{ offsetDistance: '0%' }}
        animate={{ offsetDistance: '100%' }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration,
          delay: -delay,
        }}
      />
      {/* Fallback SVG for cross-browser support */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full rounded-[inherit]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorFrom} stopOpacity="1" />
            <stop offset="50%" stopColor={colorTo} stopOpacity="0.8" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect
          width="100%"
          height="100%"
          rx="12"
          fill="none"
          stroke="url(#beam-gradient)"
          strokeWidth={borderWidth}
          strokeDasharray="80 200"
          className="animate-border-beam"
        />
      </svg>
    </div>
  )
}

export default BorderBeam
