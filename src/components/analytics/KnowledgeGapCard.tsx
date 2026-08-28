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
    default: 'bg-blue-50 text-[#2563EB]',
    warning: 'bg-amber-50 text-amber-500',
    danger: 'bg-red-50 text-red-500',
    success: 'bg-green-50 text-green-600',
  }
  return (
    <div className="card p-5 transition hover:-translate-y-0.5 hover:shadow-card-md">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accents[accent]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-[#172033]">{value}</p>
      <p className="mt-0.5 text-sm font-medium text-[#64748B]">{label}</p>
    </div>
  )
}
