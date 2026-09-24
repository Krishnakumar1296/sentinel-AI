import { useState, useRef } from 'react'
import { Shield, CheckCircle2 } from 'lucide-react'

interface Sentinel3DCoreProps {
  size?: 'sm' | 'md' | 'lg' | 'hero'
  interactive?: boolean
  showTelemetry?: boolean
}

export function Sentinel3DCore({
  size = 'md',
  interactive = true,
  showTelemetry = true,
}: Sentinel3DCoreProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    // Tactile, executive micro-tilt (subtle, physical 3.5 deg max)
    const degX = -(mouseY / (rect.height / 2)) * 3.5
    const degY = (mouseX / (rect.width / 2)) * 3.5

    setRotate({ x: degX, y: degY })
  }

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 })
    setIsHovered(false)
  }

  const dimMap = {
    sm: { container: 'w-44 h-44', ring: 'w-36 h-36', core: 'w-24 h-24' },
    md: { container: 'w-56 h-56', ring: 'w-48 h-48', core: 'w-32 h-32' },
    lg: { container: 'w-72 h-72', ring: 'w-60 h-60', core: 'w-40 h-40' },
    hero: { container: 'w-80 h-80 sm:w-96 sm:h-96', ring: 'w-72 h-72 sm:w-80 sm:h-80', core: 'w-48 h-48 sm:w-56 sm:h-56' },
  }

  const dims = dimMap[size]

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative flex items-center justify-center ${dims.container} cursor-pointer select-none`}
      style={{ perspective: '1000px' }}
    >
      {/* 3D Scene Wrapper with human-crafted spring return curve */}
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transformStyle: 'preserve-3d',
          transition: isHovered
            ? 'transform 0.12s ease-out'
            : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Soft Ambient Radial Backlight */}
        <div className="absolute inset-0 rounded-full bg-blue-600/[0.06] dark:bg-blue-500/[0.08] blur-2xl pointer-events-none" />

        {/* Outer Precision Bezel Dial */}
        <div
          className={`absolute rounded-full border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-sm ${dims.ring}`}
          style={{
            transform: 'translateZ(8px)',
            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
          }}
        >
          {/* Subtle Precision Calibrations */}
          <div className="absolute inset-2 rounded-full border border-dashed border-slate-300/50 dark:border-slate-700/50" />
        </div>

        {/* Central Enterprise Vault Token Core */}
        <div
          className={`relative rounded-2xl flex items-center justify-center border border-slate-200/80 dark:border-slate-700/80 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 shadow-md ${dims.core}`}
          style={{
            transform: `translateZ(${isHovered ? '16px' : '10px'})`,
            boxShadow: isHovered
              ? '0 12px 28px -6px rgba(0, 0, 0, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
              : '0 4px 16px -2px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease',
          }}
        >
          {/* Inner Inset Chamber */}
          <div className="w-[88%] h-[88%] rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800 flex flex-col items-center justify-center p-3 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-2 shadow-sm">
              <Shield className="w-6 h-6" strokeWidth={2.2} />
            </div>
            <span className="text-[11px] font-bold tracking-tight text-slate-800 dark:text-slate-200">
              SENTINEL
            </span>
            <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500 tracking-wider uppercase">
              Vault Secure
            </span>
          </div>
        </div>

        {/* Clean Enterprise Status Badges */}
        {showTelemetry && (
          <>
            <div
              className="absolute -top-2 -right-1 pointer-events-none hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium shadow-sm"
              style={{
                transform: `translateZ(${isHovered ? '22px' : '14px'})`,
                transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>RBAC Active</span>
            </div>

            <div
              className="absolute -bottom-2 -left-1 pointer-events-none hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium shadow-sm"
              style={{
                transform: `translateZ(${isHovered ? '22px' : '14px'})`,
                transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Evidence Verified</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Sentinel3DCore
