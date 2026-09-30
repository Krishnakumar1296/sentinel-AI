import { motion } from 'framer-motion'

export function AnimatedSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-9 w-9 border-3',
  }[size]

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      className={`rounded-full border-blue-600/20 border-t-blue-600 dark:border-blue-400/20 dark:border-t-blue-400 ${sizeClasses} ${className}`}
    />
  )
}

export function LoadingDots({ className = '' }: { className?: string }) {
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -4 },
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 0.45,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
          className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400"
        />
      ))}
    </div>
  )
}

export function ShimmerSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-slate-200/60 dark:bg-slate-800/60 ${className}`}>
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: 'linear',
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
      />
    </div>
  )
}

export function PulseProgressBar({ progress, className = '' }: { progress: number; className?: string }) {
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-400"
      />
    </div>
  )
}
