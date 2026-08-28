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
    <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-card">
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-[#F7F9FC] text-xs font-semibold uppercase tracking-wide text-[#64748B]">
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
              className={`border-b border-slate-50 transition hover:bg-slate-50/50 ${i === users.length - 1 ? 'border-b-0' : ''}`}
            >
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                    {u.name.charAt(0)}
                  </div>
                  <span className="font-medium text-[#172033]">{u.name}</span>
                </div>
              </td>
              <td className="px-4 py-3.5 text-[#64748B]">{u.email}</td>
              <td className="px-4 py-3.5 text-[#64748B]">{u.department}</td>
              <td className="px-4 py-3.5">
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium uppercase ${
                  u.role === 'admin' ? 'border-blue-200 bg-blue-50 text-[#2563EB]'
                  : u.role === 'manager' ? 'border-amber-200 bg-amber-50 text-amber-700'
                  : 'border-slate-200 bg-slate-100 text-slate-600'
                }`}>
                  {u.role}
                </span>
              </td>
              <td className="px-4 py-3.5">
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${u.status === 'active' ? 'text-green-600' : 'text-slate-400'}`}>
                  <span className={`h-2 w-2 rounded-full ${u.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`} />
                  {u.status}
                </span>
              </td>
              <td className="px-4 py-3.5 text-[#64748B]">{u.lastActive}</td>
              <td className="px-4 py-3.5">
                <div className="flex justify-end gap-1">
                  <button onClick={() => onEdit(u)} className="rounded-md p-1.5 text-[#64748B] hover:bg-slate-100 hover:text-[#172033]" title="Edit user">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => onDelete(u)} className="rounded-md p-1.5 text-[#64748B] hover:bg-red-50 hover:text-red-500" title="Delete user">
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
