import type { LucideIcon } from 'lucide-react'
import { Lightbulb } from 'lucide-react'

export function KnowledgeGapCard({
  icon: Icon = Lightbulb,
  value,
  label,
  accent = 'default',
}: {
  icon?: LucideIcon
  value: string
  label: string
  accent?: 'default' | 'warning' | 'danger' | 'success'
}) {
  const accents: Record<string, string> = {
    default: 'bg-brand-blue/10 text-brand-blue',
    warning: 'bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400',
    danger: 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400',
    success: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
  }
  return (
    <div className="card p-5 transition hover:-translate-y-0.5 hover:shadow-card-md">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accents[accent]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-ink">{value}</p>
      <p className="mt-0.5 text-sm font-medium text-muted">{label}</p>
    </div>
  )
}
