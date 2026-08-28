import { useNavigate } from 'react-router-dom'
import { FileText, Eye } from 'lucide-react'
import type { Document } from '../../types'

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

export function DocumentTable({ documents }: { documents: Document[] }) {
  const navigate = useNavigate()

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-card">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-[#F7F9FC] text-xs font-semibold uppercase tracking-wide text-[#64748B]">
            <th className="px-5 py-3.5">Document</th>
            <th className="px-4 py-3.5">Department</th>
            <th className="px-4 py-3.5">Type</th>
            <th className="px-4 py-3.5">Access</th>
            <th className="px-4 py-3.5">Updated</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="px-4 py-3.5 text-right">View</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((d, i) => {
            const accessRestricted = d.access !== 'employee'
            return (
              <tr
                key={d.id}
                className={`border-b border-slate-50 transition hover:bg-slate-50/50 ${i === documents.length - 1 ? 'border-b-0' : ''}`}
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-[#172033]">{d.name}</p>
                      <p className="text-xs text-[#64748B]">
                        {d.pages} pages · {d.size}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-[#64748B]">{d.department}</td>
                <td className="px-4 py-3.5">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">{d.type}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${accessRestricted ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-green-200 bg-green-50 text-green-700'}`}>
                    {accessLabels[d.access] ?? d.access}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-[#64748B]">{d.updatedAt}</td>
                <td className="px-4 py-3.5">
                  <span className={statusStyles[d.status]}>{d.status}</span>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <button
                    onClick={() => navigate(`/viewer?doc=${d.id}`)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-[#64748B] transition hover:border-slate-300 hover:text-[#172033]"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
