import type { ReactNode } from 'react'

export function ChartCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="card p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[#172033]">{title}</h2>
          {subtitle && <p className="text-sm text-[#64748B]">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}
