import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import { DURATION, EASING } from '../animations/motion-tokens'

export function SourceCard({
  citation,
  title,
  page,
  relevance,
  selected,
  onSelect,
}: {
  citation: number
  title: string
  page: number
  relevance: number
  selected: boolean
  onSelect: () => void
}) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: DURATION.FAST, ease: EASING.SMOOTH }}
      onClick={onSelect}
      className={`group w-full rounded-2xl border p-4 text-left transition-colors duration-150 ${
        selected
          ? 'border-blue-500/70 bg-blue-50/40 dark:border-[#10a37f]/50 dark:bg-[#10a37f]/10 dark:ring-1 dark:ring-[#10a37f]/30 ring-1 ring-blue-500/30 shadow-xs'
          : 'border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#262626] hover:border-slate-300 dark:hover:border-white/[0.14] hover:bg-slate-50 dark:hover:bg-[#2f2f2f]'
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
            selected
              ? 'bg-blue-600 dark:bg-[#10a37f] text-white shadow-xs'
              : 'bg-slate-100 dark:bg-[#2f2f2f] text-slate-600 dark:text-[#ececec] group-hover:text-slate-900 dark:group-hover:text-white'
          }`}
        >
          {citation}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-xs font-semibold text-slate-900 dark:text-[#ececec]">
            {title}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-[#8e8e8e]">Page {page}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-500 dark:text-[#8e8e8e]">Match confidence</span>
          <span className="font-semibold text-slate-900 dark:text-[#ececec]">{relevance}%</span>
        </div>
        <span className="flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-[#10a37f] group-hover:translate-x-0.5 transition-transform">
          <Eye className="h-3.5 w-3.5" />
          View Evidence
        </span>
      </div>

      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-[#2f2f2f]">
        <div
          className="h-full rounded-full bg-blue-600 dark:bg-[#10a37f] transition-all duration-500"
          style={{ width: `${relevance}%` }}
        />
      </div>
    </motion.button>
  )
}


