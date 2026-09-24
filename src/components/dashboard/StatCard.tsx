import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { CyberCard3D } from '../common/CyberCard3D'

export function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  positive = true,
  iconClass = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
  glowColor = 'blue',
}: {
  icon: LucideIcon
  label: string
  value: string
  delta: string
  positive?: boolean
  iconClass?: string
  glowColor?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'blue'
}) {
  return (
    <CyberCard3D glowColor={glowColor} className="p-5">
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${iconClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
          positive
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
        }`}>
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {delta}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
          {value}
        </p>
        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
      </div>
    </CyberCard3D>
  )
}
