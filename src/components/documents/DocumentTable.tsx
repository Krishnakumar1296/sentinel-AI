import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Eye, Pencil } from 'lucide-react'
import type { Document } from '../../types'
import { DURATION, EASING } from '../animations/motion-tokens'

const statusStyles: Record<Document['status'], string> = {
  active: 'badge-green',
  restricted: 'badge-amber',
  processing: 'badge-blue',
  failed: 'badge-red',
}

const accessLabels: Record<string, string> = {
  employee: 'Employee',
  manager: 'Manager',
  admin: 'Admin',
  finance: 'Finance',
  hr: 'HR',
  it: 'IT',
}

export function DocumentTable({ documents, onEdit }: { documents: Document[]; onEdit?: (doc: Document) => void }) {
  const navigate = useNavigate()

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-card">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-line-soft bg-surface-muted text-xs font-semibold uppercase tracking-wide text-muted">
            <th className="px-5 py-3.5">Document</th>
            <th className="px-4 py-3.5">Department</th>
            <th className="px-4 py-3.5">Type</th>
            <th className="px-4 py-3.5">Access</th>
            <th className="px-4 py-3.5">Updated</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="px-4 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((d, i) => {
            const accessRestricted = d.access !== 'employee'
            return (
              <motion.tr
                key={d.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: DURATION.FAST,
                  delay: Math.min(i * 0.03, 0.3),
                  ease: EASING.SMOOTH,
                }}
                className={`border-b border-line-soft transition-colors hover:bg-slate-50/70 dark:hover:bg-[#2f2f2f] ${
                  i === documents.length - 1 ? 'border-b-0' : ''
                }`}
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-ink">{d.name}</p>
                      <p className="text-xs text-muted">
                        {d.pages} pages · {d.size}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-muted">{d.department}</td>
                <td className="px-4 py-3.5">
                  <span className="rounded-md bg-surface-soft px-2 py-0.5 text-xs font-semibold text-muted">{d.type}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${accessRestricted ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400' : 'border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400'}`}>
                    {accessLabels[d.access] ?? d.access}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-muted">{d.updatedAt}</td>
                <td className="px-4 py-3.5">
                  <span className={statusStyles[d.status]}>{d.status}</span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    {onEdit && (
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => onEdit(d)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-line hover:text-ink hover:bg-slate-100/50 dark:hover:bg-[#2f2f2f]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => navigate(`/viewer?doc=${d.id}`)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-line hover:text-ink hover:bg-slate-100/50 dark:hover:bg-[#2f2f2f]"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

