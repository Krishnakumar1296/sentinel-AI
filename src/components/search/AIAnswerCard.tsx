import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Loader2, CheckCircle2, Search } from 'lucide-react'
import { DURATION, EASING } from '../animations/motion-tokens'

export function AuthorizedSearchNotice({ role, scope }: { role: string; scope: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.NORMAL, ease: EASING.SMOOTH }}
      className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 px-4 py-3.5 shadow-xs"
    >
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
    </motion.div>
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
    }, 450)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: DURATION.NORMAL, ease: EASING.SMOOTH }}
      className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#262626] p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 font-display text-sm font-semibold text-slate-900 dark:text-[#ECECEC]">
        <div className="relative flex h-3 w-3 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10a37f] opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#10a37f]" />
        </div>
        <span className="tracking-wide">Thinking & Searching Authorized Knowledge...</span>
      </div>

      <div className="mt-5 space-y-3 text-xs">
        {stages.map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <span className="flex h-5 w-5 items-center justify-center shrink-0">
              {i < active && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: DURATION.FAST }}
                >
                  <CheckCircle2 className="h-4 w-4 text-[#10a37f]" />
                </motion.div>
              )}
              {i === active && <Loader2 className="h-4 w-4 animate-spin text-[#10a37f]" />}
              {i > active && <span className="h-2 w-2 rounded-full border border-slate-300 dark:border-white/[0.12]" />}
            </span>
            <span className={i <= active ? 'font-medium text-slate-900 dark:text-[#ECECEC]' : 'text-slate-400 dark:text-[#8E8E8E]'}>
              {s}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}


