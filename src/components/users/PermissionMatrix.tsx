import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import type { UserRole } from '../../types'
import { DURATION, EASING } from '../animations/motion-tokens'

const matrix: Record<string, Record<UserRole, boolean>> = {
  'Search Documents': { employee: true, manager: true, admin: true },
  'View Evidence': { employee: true, manager: true, admin: true },
  'Upload Documents': { employee: false, manager: true, admin: true },
  'View Analytics': { employee: false, manager: true, admin: true },
  'View Knowledge Gaps': { employee: false, manager: true, admin: true },
  'Manage Users': { employee: false, manager: false, admin: true },
  'Manage Roles': { employee: false, manager: false, admin: true },
  'View Security Center': { employee: false, manager: false, admin: true },
  'View Audit Logs': { employee: false, manager: false, admin: true },
}

const roles: UserRole[] = ['employee', 'manager', 'admin']

export function PermissionMatrix() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-card">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead>
          <tr className="border-b border-line-soft bg-surface-muted text-xs font-semibold uppercase tracking-wide text-muted">
            <th className="px-5 py-3.5">Permission</th>
            {roles.map((r) => (
              <th key={r} className="px-4 py-3.5 text-center capitalize">{r}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(matrix).map(([permission, permRoles], i) => (
            <motion.tr
              key={permission}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: DURATION.FAST,
                delay: Math.min(i * 0.03, 0.3),
                ease: EASING.SMOOTH,
              }}
              className={`border-b border-line-soft transition-colors hover:bg-slate-50/70 dark:hover:bg-[#2f2f2f] ${i === Object.keys(matrix).length - 1 ? 'border-b-0' : ''}`}
            >
              <td className="px-5 py-3.5 font-medium text-ink">{permission}</td>
              {roles.map((r) => {
                const granted = permRoles[r]
                return (
                  <td key={r} className="px-4 py-3.5 text-center">
                    <motion.span
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.15 }}
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${
                        granted
                          ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400 border border-green-200/50 dark:border-green-500/20'
                          : 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400 border border-red-200/50 dark:border-red-500/20'
                      }`}
                    >
                      {granted ? (
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                          <motion.path
                            d="M5 13l4 4L19 7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.3), ease: 'easeOut' }}
                          />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                          <motion.path
                            d="M18 6L6 18M6 6l12 12"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.3), ease: 'easeOut' }}
                          />
                        </svg>
                      )}
                    </motion.span>
                  </td>
                )
              })}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

