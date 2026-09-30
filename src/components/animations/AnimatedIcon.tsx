import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ChevronDown, Check, Loader2 } from 'lucide-react'

export function AnimatedArrow({ className = '' }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.span
      className="inline-flex items-center"
      whileHover={shouldReduceMotion ? {} : { x: 3 }}
      transition={{ duration: 0.18 }}
    >
      <ArrowRight className={className} />
    </motion.span>
  )
}

export function AnimatedChevron({
  isOpen,
  className = '',
}: {
  isOpen: boolean
  className?: string
}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.span
      className="inline-flex items-center"
      animate={{ rotate: isOpen ? 180 : 0 }}
      transition={{ duration: shouldReduceMotion ? 0.1 : 0.22 }}
    >
      <ChevronDown className={className} />
    </motion.span>
  )
}

export function AnimatedCheckmark({ className = '' }: { className?: string }) {
  return (
    <motion.span
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="inline-flex items-center"
    >
      <Check className={className} />
    </motion.span>
  )
}
