import { useEffect, useState } from 'react'
import { ShieldCheck, Loader2, CheckCircle2, Search } from 'lucide-react'

export function AuthorizedSearchNotice({ role, scope }: { role: string; scope: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 px-4 py-3.5 shadow-xs">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div className="text-xs">
          <div className="flex items-center gap-2">
            <p className="font-display font-semibold text-slate-900 dark:text-slate-100">
              Role-Based Access Enforcement
            </p>
            <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Active
            </span>
          </div>
          <p className="mt-0.5 text-slate-500 dark:text-slate-400 leading-relaxed">
            All queries and retrieved knowledge chunks are strictly filtered to match your verified clearance level.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px]">
            <span className="text-slate-500 dark:text-slate-400">
              Clearance: <span className="font-semibold text-slate-900 dark:text-slate-200 uppercase">{role}</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-500 dark:text-slate-400">
              Accessible Scope: <span className="font-semibold text-slate-900 dark:text-slate-200">{scope}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProcessingStages() {
  const stages = [
    'Validating role clearance & RBAC access',
    'Querying pgvector enterprise knowledge repository',
    'Synthesizing answer with verified citations',
    'Cross-referencing cited PDF page evidence',
  ]
  const [active, setActive] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((a) => (a < stages.length - 1 ? a + 1 : a))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex items-center gap-2.5 font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
        <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <span>Retrieving Verified Knowledge...</span>
      </div>
      <div className="mt-4 space-y-3 text-xs">
        {stages.map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <span className="flex h-5 w-5 items-center justify-center shrink-0">
              {i < active && (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              )}
              {i === active && <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />}
              {i > active && <span className="h-2 w-2 rounded-full border border-slate-300 dark:border-slate-700" />}
            </span>
            <span className={i <= active ? 'font-medium text-slate-900 dark:text-slate-100' : 'text-slate-400'}>
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

