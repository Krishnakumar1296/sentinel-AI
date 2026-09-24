import { useEffect, useState } from 'react'
import {
  ShieldCheck, Lock, KeyRound, FolderLock, Database, ScrollText, CheckCircle2, ShieldAlert, Cpu
} from 'lucide-react'
import { getAuditLogs } from '../services/api'
import type { AuditLogEntry } from '../types'
import { useAuth } from '../context/AuthContext'
import { SkeletonLoader } from '../components/common/SkeletonLoader'
import { ErrorState } from '../components/common/ErrorState'
import { CyberCard3D } from '../components/common/CyberCard3D'

const items = [
  { icon: Lock, label: 'Authentication', value: 'Protected' },
  { icon: KeyRound, label: 'RBAC Clearance', value: 'Enforced' },
  { icon: FolderLock, label: 'Document Vault', value: 'Restricted' },
  { icon: Database, label: 'Vector Database', value: 'Isolated' },
  { icon: ScrollText, label: 'Audit Telemetry', value: 'Live' },
]

const toneStyles: Record<AuditLogEntry['status'], string> = {
  success: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
  blocked: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
  failed: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]',
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
              <span className="text-muted">Your role</span>
              <span className="font-semibold capitalize text-ink">{user?.role ?? 'employee'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Required role</span>
              <span className="font-semibold text-ink">Admin</span>
            </div>
          </div>
        </ErrorState>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-mono font-semibold text-emerald-400 mb-2">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>FIPS-140-3 ZERO-TRUST POSTURE</span>
        </div>
        <h1 className="page-title font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
          Security Command & Audit Log
        </h1>
        <p className="page-subtitle text-xs sm:text-sm text-muted">
          Real-time security events, query isolation validation, and immutable audit telemetry.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <ShieldCheck className="h-7 w-7 animate-pulse" />
          </div>
          <div>
            <p className="font-display text-lg font-bold uppercase tracking-wide text-emerald-400">Sentinel Defenses Armed</p>
            <p className="text-xs font-mono text-slate-300">All retrieval queries and vector embeddings are authenticated and logged through role-based access control.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <CyberCard3D glowColor="emerald" className="p-6">
          <h2 className="font-display text-base font-bold text-ink">Security Controls</h2>
          <p className="text-xs font-mono text-muted">Active protection layers</p>
          <div className="mt-5 space-y-3">
            {items.map((it) => (
              <div key={it.label} className="flex items-center justify-between rounded-xl border border-line bg-surface-muted/50 dark:bg-slate-950/40 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                    <it.icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-mono font-medium text-ink">{it.label}</span>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" /> {it.value}
                </span>
              </div>
            ))}
          </div>
        </CyberCard3D>

        <CyberCard3D glowColor="cyan" className="p-6 lg:col-span-2">
          <h2 className="font-display text-base font-bold text-ink">Live Security Audit Timeline</h2>
          <p className="text-xs font-mono text-muted">Authenticated query logs & access enforcement</p>
          {loading ? (
            <div className="mt-5"><SkeletonLoader variant="library" /></div>
          ) : (
            <div className="mt-5 space-y-1.5 max-h-96 overflow-y-auto">
              {logs.map((l) => (
                <div key={l.id} className="flex items-start gap-4 rounded-xl px-3.5 py-3 transition hover:bg-surface-muted/70 dark:hover:bg-slate-800/40">
                  <div className="flex flex-col items-center">
                    <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${toneStyles[l.status]}`} />
                    <span className="mt-1 h-full w-px bg-line" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-mono font-bold text-ink">{l.action}</p>
                    <p className="text-[11px] font-mono text-muted">{l.userName} · {l.timestamp}</p>
                    <p className="text-[11px] text-faint font-mono">{l.details}</p>
                  </div>
                  <span className={statusChip[l.status]}>{l.status}</span>
                </div>
              ))}
            </div>
          )}
        </CyberCard3D>
      </div>
    </div>
  )
}
