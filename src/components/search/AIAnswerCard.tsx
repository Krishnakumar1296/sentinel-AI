import { useEffect, useState } from 'react'
import { ShieldCheck, Sparkles, Loader2 } from 'lucide-react'

export function AuthorizedSearchNotice({ role, scope }: { role: string; scope: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50/60 px-4 py-3">
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
      <div className="text-sm">
        <p className="font-semibold text-green-800">Authorized Search</p>
        <p className="mt-0.5 text-green-700">
          Query is searched only across documents available to your role.
        </p>
        <p className="mt-1 flex flex-wrap gap-4 text-xs text-green-700">
          <span>Role: <span className="font-semibold capitalize">{role}</span></span>
          <span>Access Scope: <span className="font-semibold">{scope}</span></span>
        </p>
      </div>
    </div>
  )
}

export function ProcessingStages() {
  const stages = [
    'Checking permissions',
    'Searching knowledge vault',
    'Generating answer',
    'Verifying evidence',
  ]
  const [active, setActive] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((a) => (a < stages.length - 1 ? a + 1 : a))
    }, 550)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-[#123B5D]">
        <Sparkles className="h-4 w-4" />
        Analyzing authorized documents...
      </div>
      <div className="mt-4 space-y-2.5">
        {stages.map((s, i) => (
          <div key={s} className="flex items-center gap-2.5 text-sm">
            <span className="flex h-5 w-5 items-center justify-center">
              {i < active && (
                <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {i === active && <Loader2 className="h-4 w-4 animate-spin text-[#2563EB]" />}
              {i > active && <span className="h-3 w-3 rounded-full border border-slate-300" />}
            </span>
            <span className={i <= active ? 'font-medium text-[#172033]' : 'text-slate-400'}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
