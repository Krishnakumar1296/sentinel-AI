import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

export function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  positive = true,
  iconClass = 'bg-brand-blue/10 text-brand-blue',
}: {
  icon: LucideIcon
  label: string
  value: string
  delta: string
  positive?: boolean
  iconClass?: string
}) {
  return (
    <div className="card group p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-md">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-ink">{value}</p>
      <p className="mt-0.5 text-sm font-medium text-muted">{label}</p>
      <p className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${positive ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
        {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
        {delta}
      </p>
    </div>
  )
}
