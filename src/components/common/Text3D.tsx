import React, { useState, useRef } from 'react'

export interface Text3DProps {
  children: React.ReactNode
  color?: 'ocean' | 'amber' | 'forest' | 'dusk' | 'bronze' | 'slate'
  variant?: 'float' | 'tilt' | 'depth' | 'sheen' | 'flip' | 'interactive' | 'reveal'
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p' | 'div'
  className?: string
  depth?: 'subtle' | 'medium' | 'deep'
  interactive?: boolean
}

export function Text3D({
  children,
  color = 'ocean',
  variant = 'reveal',
  as: Component = 'span',
  className = '',
  interactive = true,
}: Text3DProps) {
  const containerRef = useRef<HTMLElement>(null)
  const [transform, setTransform] = useState('')
  const [isHovered, setIsHovered] = useState(false)

  const colorMap = {
    ocean: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 dark:from-white dark:via-blue-200 dark:to-indigo-300 bg-clip-text text-transparent',
    amber: 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 dark:from-amber-100 dark:via-amber-300 dark:to-orange-400 bg-clip-text text-transparent',
    forest: 'bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 dark:from-white dark:via-emerald-200 dark:to-teal-300 bg-clip-text text-transparent',
    dusk: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 dark:from-white dark:via-indigo-200 dark:to-purple-300 bg-clip-text text-transparent',
    bronze: 'bg-gradient-to-r from-amber-800 via-yellow-700 to-amber-700 dark:from-amber-200 dark:via-amber-300 dark:to-yellow-400 bg-clip-text text-transparent',
    slate: 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent',
  }

  // Micro-tilt on mouse move (ultra-subtle, tactile physical feel, max 1.5 degrees)
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!interactive || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const degX = -((y - centerY) / centerY) * 1.5
    const degY = ((x - centerX) / centerX) * 1.5

    setTransform(
      `perspective(800px) rotateX(${degX.toFixed(2)}deg) rotateY(${degY.toFixed(2)}deg) translateY(-1px)`
    )
  }

  const handleMouseEnter = () => {
    if (interactive) setIsHovered(true)
  }

  const handleMouseLeave = () => {
    if (interactive) {
      setIsHovered(false)
      setTransform('perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)')
    }
  }

  return (
    <Component
      ref={containerRef as any}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`inline-block relative select-none animate-text-reveal ${className}`}
    >
      <span
        style={{
          transform: isHovered && interactive ? transform : undefined,
          transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'inline-block',
        }}
        className={`font-bold tracking-tight ${colorMap[color]}`}
      >
        {children}
      </span>
    </Component>
  )
}

export default Text3D
