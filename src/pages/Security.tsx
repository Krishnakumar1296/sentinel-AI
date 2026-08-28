import { useEffect, useState } from 'react'
import {
  ShieldCheck, Lock, KeyRound, FolderLock, Database, ScrollText, CheckCircle2,
} from 'lucide-react'
import { getAuditLogs } from '../services/api'
import type { AuditLogEntry } from '../types'
import { useAuth } from '../context/AuthContext'
import { SkeletonLoader } from '../components/common/SkeletonLoader'
import { ErrorState } from '../components/common/ErrorState'

const items = [
  { icon: Lock, label: 'Authentication', value: 'Protected' },
  { icon: KeyRound, label: 'RBAC', value: 'Enabled' },
  { icon: FolderLock, label: 'Document Access', value: 'Enforced' },
  { icon: Database, label: 'Vector Vault', value: 'Private' },
  { icon: ScrollText, label: 'Audit Logging', value: 'Enabled' },
]

const toneStyles: Record<AuditLogEntry['status'], string> = {
  success: 'bg-green-500',
  blocked: 'bg-amber-500',
  failed: 'bg-red-500',
}

const statusChip: Record<AuditLogEntry['status'], string> = {
  success: 'badge-green',
  blocked: 'badge-amber',
  failed: 'badge-red',
}

export default function Security() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAuditLogs().then((l) => {
      setLogs(l)
      setLoading(false)
    })
  }, [])

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <h1 className="page-title text-2xl font-bold">Security Center</h1>
        <ErrorState variant="unauthorized" title="Access Restricted" message="The Security Center is restricted to administrators.">
          <div className="mx-auto max-w-xs space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Your role</span>
              <span className="font-semibold capitalize text-[#172033]">{user?.role ?? 'employee'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Required role</span>
              <span className="font-semibold text-[#172033]">Admin</span>
            </div>
          </div>
        </ErrorState>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title text-2xl font-bold">Security Center</h1>
        <p className="page-subtitle">Monitor access, permissions and document protection.</p>
      </div>

      <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-6 shadow-card">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
            <ShieldCheck className="h-7 w-7 text-green-600" />
          </div>
          <div>
            <p className="text-lg font-bold uppercase tracking-wide text-green-700">System Secure</p>
            <p className="text-sm text-green-700">All retrieval requests are filtered through role-based authorization.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card p-6">
          <h2 className="text-base font-semibold text-[#172033]">Security Controls</h2>
          <p className="text-sm text-[#64748B]">Active protection layers</p>
          <div className="mt-5 space-y-3">
            {items.map((it) => (
              <div key={it.label} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <it.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-[#172033]">{it.label}</span>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
                  <CheckCircle2 className="h-4 w-4" /> {it.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 lg:col-span-2">
          <h2 className="text-base font-semibold text-[#172033]">Access Activity Timeline</h2>
          <p className="text-sm text-[#64748B]">Recent security-relevant events</p>
          {loading ? (
            <div className="mt-5"><SkeletonLoader variant="library" /></div>
          ) : (
            <div className="mt-5 space-y-1">
              {logs.map((l) => (
                <div key={l.id} className="flex items-start gap-4 rounded-xl px-3 py-3 transition hover:bg-slate-50">
                  <div className="flex flex-col items-center">
                    <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${toneStyles[l.status]}`} />
                    <span className="mt-1 h-full w-px bg-slate-100" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#172033]">{l.action}</p>
                    <p className="text-xs text-[#64748B]">{l.userName} · {l.timestamp}</p>
                    <p className="text-xs text-slate-400">{l.details}</p>
                  </div>
                  <span className={statusChip[l.status]}>{l.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
