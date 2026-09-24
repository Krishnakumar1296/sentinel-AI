import type { ReactNode } from 'react'
import { CyberCard3D } from '../common/CyberCard3D'

export function ChartCard({
  title,
  subtitle,
  action,
  children,
  glowColor = 'cyan',
}: {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  glowColor?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'blue'
}) {
  return (
    <CyberCard3D glowColor={glowColor} className="p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-bold text-ink tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs font-mono text-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </CyberCard3D>
  )
}
