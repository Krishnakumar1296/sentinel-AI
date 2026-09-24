import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  glowColor?: string
}

export function LiquidButton({
  children,
  className = '',
  glowColor = 'rgba(14, 165, 233, 0.5)',
  onClick,
  ...props
}: LiquidButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      onClick={onClick}
      className={cn(
        'group relative inline-flex items-center justify-center overflow-hidden rounded-xl p-[1px] font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 select-none shadow-sm hover:shadow-lg',
        className
      )}
      {...(props as any)}
    >
      {/* Liquid animated border gradient */}
      <span
        className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] opacity-70 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'conic-gradient(from 90deg at 50% 50%, #0284c7 0%, #38bdf8 25%, #6366f1 50%, #a855f7 75%, #0284c7 100%)',
        }}
      />

      {/* Internal button surface */}
      <span className="relative z-10 flex h-full w-full items-center justify-center gap-2 rounded-[11px] bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 group-hover:bg-slate-900/90 dark:bg-slate-950">
        {/* Subtle liquid highlight shimmer */}
        <span
          className="pointer-events-none absolute -inset-full top-0 block -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-liquid-shine"
        />
        {children}
      </span>
    </motion.button>
  )
}

export default LiquidButton
