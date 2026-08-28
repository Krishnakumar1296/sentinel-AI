import { ShieldAlert } from 'lucide-react'
import type { ReactNode } from 'react'

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  variant = 'default',
  children,
}: {
  title?: string
  message?: string
  variant?: 'default' | 'unauthorized' | 'noanswer'
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-surface px-6 py-14 text-center shadow-card">
      <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${variant === 'unauthorized' ? 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400' : 'bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400'}`}>
        <ShieldAlert className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted">{message}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}
