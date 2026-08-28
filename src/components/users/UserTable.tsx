import { Pencil, Trash2 } from 'lucide-react'
import type { User } from '../../types'

export function UserTable({
  users,
  onEdit,
  onDelete,
}: {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-card">
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead>
          <tr className="border-b border-line-soft bg-surface-muted text-xs font-semibold uppercase tracking-wide text-muted">
            <th className="px-5 py-3.5">Name</th>
            <th className="px-4 py-3.5">Email</th>
            <th className="px-4 py-3.5">Department</th>
            <th className="px-4 py-3.5">Role</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="px-4 py-3.5">Last Active</th>
            <th className="px-4 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr
              key={u.id}
              className={`border-b border-line-soft transition hover:bg-surface-muted/50 ${i === users.length - 1 ? 'border-b-0' : ''}`}
            >
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                    {u.name.charAt(0)}
                  </div>
                  <span className="font-medium text-ink">{u.name}</span>
                </div>
              </td>
              <td className="px-4 py-3.5 text-muted">{u.email}</td>
              <td className="px-4 py-3.5 text-muted">{u.department}</td>
              <td className="px-4 py-3.5">
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium uppercase ${
                  u.role === 'admin' ? 'border-blue-200 bg-blue-50 text-brand-blue dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400'
                  : u.role === 'manager' ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400'
                  : 'border-line bg-surface-soft text-muted'
                }`}>
                  {u.role}
                </span>
              </td>
              <td className="px-4 py-3.5">
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${u.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-faint'}`}>
                  <span className={`h-2 w-2 rounded-full ${u.status === 'active' ? 'bg-green-500' : 'bg-faint'}`} />
                  {u.status}
                </span>
              </td>
              <td className="px-4 py-3.5 text-muted">{u.lastActive}</td>
              <td className="px-4 py-3.5">
                <div className="flex justify-end gap-1">
                  <button onClick={() => onEdit(u)} className="rounded-md p-1.5 text-muted hover:bg-surface-soft hover:text-ink" title="Edit user">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => onDelete(u)} className="rounded-md p-1.5 text-muted hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400" title="Delete user">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
