import React, { useState, useRef } from 'react'
import { BorderBeam } from '../animate/BorderBeam'

interface CyberCard3DProps {
  children: React.ReactNode
  className?: string
  glowColor?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'blue'
  tiltAmount?: number
  onClick?: () => void
  showBorderBeam?: boolean
}

export function CyberCard3D({
  children,
  className = '',
  glowColor = 'blue',
  tiltAmount = 1.8,
  onClick,
  showBorderBeam = false,
}: CyberCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('')
  const [sheenPosition, setSheenPosition] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Refined, human-crafted 3D micro-tilt (max 1.8 deg, perfectly tactile)
    const rotateX = -((y - centerY) / centerY) * tiltAmount
    const rotateY = ((x - centerX) / centerX) * tiltAmount

    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`)
    setSheenPosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)')
  }

  const borderHoverMap = {
    cyan: 'hover:border-blue-500/40 hover:shadow-lg dark:hover:border-blue-400/40',
    purple: 'hover:border-indigo-500/40 hover:shadow-lg dark:hover:border-indigo-400/40',
    emerald: 'hover:border-emerald-500/40 hover:shadow-lg dark:hover:border-emerald-400/40',
    amber: 'hover:border-amber-500/40 hover:shadow-lg dark:hover:border-amber-400/40',
    blue: 'hover:border-blue-500/40 hover:shadow-lg dark:hover:border-blue-400/40',
  }

  const beamColors = {
    cyan: { from: '#06b6d4', to: '#3b82f6' },
    purple: { from: '#8b5cf6', to: '#ec4899' },
    emerald: { from: '#10b981', to: '#06b6d4' },
    amber: { from: '#f59e0b', to: '#ef4444' },
    blue: { from: '#38bdf8', to: '#6366f1' },
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: transform,
        transformStyle: 'preserve-3d',
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease',
      }}
      className={`relative overflow-hidden rounded-xl border border-slate-200/90 dark:border-slate-800 bg-surface dark:bg-slate-900/90 shadow-sm transition-all duration-200 ${borderHoverMap[glowColor]} ${className}`}
    >
      {/* BorderBeam on hover or when enabled */}
      {(showBorderBeam || isHovered) && (
        <BorderBeam
          duration={6}
          size={140}
          colorFrom={beamColors[glowColor].from}
          colorTo={beamColors[glowColor].to}
        />
      )}

      {/* Subtle Specular Sheen (Soft, organic lighting) */}
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 opacity-40"
          style={{
            background: `radial-gradient(circle 320px at ${sheenPosition.x}% ${sheenPosition.y}%, rgba(255,255,255,0.08), transparent 70%)`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default CyberCard3D
