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
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-card">
      <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${variant === 'unauthorized' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
        <ShieldAlert className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold text-[#172033]">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-[#64748B]">{message}</p>
      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}
