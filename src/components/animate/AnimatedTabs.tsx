import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
  count?: number | string
}

interface AnimatedTabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (id: string) => void
  className?: string
  tabClassName?: string
  activeTabClassName?: string
  layoutId?: string
}

export function AnimatedTabs({
  tabs,
  activeTab,
  onChange,
  className = '',
  tabClassName = '',
  layoutId = 'animated-tabs-indicator',
}: AnimatedTabsProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100/80 p-1.5 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative z-10 flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 select-none outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
              isActive
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200',
              tabClassName
            )}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 -z-10 rounded-lg bg-white shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10"
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.2 text-[10px] font-bold',
                  isActive
                    ? 'bg-sky-500/10 text-sky-600 dark:bg-sky-400/20 dark:text-sky-300'
                    : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default AnimatedTabs
