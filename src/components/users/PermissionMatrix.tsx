import { Check, X } from 'lucide-react'
import type { UserRole } from '../../types'

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
    <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-card">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-[#F7F9FC] text-xs font-semibold uppercase tracking-wide text-[#64748B]">
            <th className="px-5 py-3.5">Permission</th>
            {roles.map((r) => (
              <th key={r} className="px-4 py-3.5 text-center capitalize">{r}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(matrix).map(([permission, permRoles], i) => (
            <tr key={permission} className={`border-b border-slate-50 transition hover:bg-slate-50/50 ${i === Object.keys(matrix).length - 1 ? 'border-b-0' : ''}`}>
              <td className="px-5 py-3.5 font-medium text-[#172033]">{permission}</td>
              {roles.map((r) => {
                const granted = permRoles[r]
                return (
                  <td key={r} className="px-4 py-3.5 text-center">
                    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${granted ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                      {granted ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
