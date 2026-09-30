import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheck, Lock, KeyRound, FolderLock, Database, ScrollText, CheckCircle2, ShieldAlert, Cpu
} from 'lucide-react'
import { getAuditLogs } from '../services/api'
import type { AuditLogEntry } from '../types'
import { useAuth } from '../context/AuthContext'
import { SkeletonLoader } from '../components/common/SkeletonLoader'
import { ErrorState } from '../components/common/ErrorState'
import { CyberCard3D } from '../components/common/CyberCard3D'
import { FadeUp, HoverCard } from '../components/animations'
import { DURATION, EASING } from '../components/animations/motion-tokens'
import { BorderBeam } from '../components/animate/BorderBeam'

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

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'blocked' | 'failed'>('all')

  useEffect(() => {
    getAuditLogs().then((l) => {
      setLogs(l)
      setLoading(false)
    })
  }, [])

  if (!isAdmin) {
    return (
      <FadeUp className="space-y-6">
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
      </FadeUp>
    )
  }

  const filteredLogs = logs.filter((l) => {
    if (statusFilter !== 'all' && l.status !== statusFilter) return false
    if (!search) return true
    const q = search.toLowerCase()
    return (
      l.action.toLowerCase().includes(q) ||
      l.userName.toLowerCase().includes(q) ||
      l.details.toLowerCase().includes(q) ||
      l.resource.toLowerCase().includes(q)
    )
  })

  const successCount = logs.filter((l) => l.status === 'success').length
  const blockedCount = logs.filter((l) => l.status === 'blocked').length
  const failedCount = logs.filter((l) => l.status === 'failed').length

  return (
    <FadeUp className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-mono font-semibold text-emerald-400 mb-2">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>FIPS-140-3 ZERO-TRUST POSTURE</span>
        </div>
        <h1 className="page-title font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
          Security Command &amp; Audit Log
        </h1>
        <p className="page-subtitle text-xs sm:text-sm text-muted">
          Real-time security events, query isolation validation, and immutable audit telemetry.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.NORMAL, ease: EASING.SMOOTH }}
        className="relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-[#1c1c1c] via-[#262626] to-[#1c1c1c] p-6 shadow-2xl backdrop-blur-xl"
      >
        <BorderBeam size={200} duration={8} colorFrom="#10a37f" colorTo="#ececec" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#10a37f]/15 text-[#10a37f] border border-[#10a37f]/30 shadow-[0_0_20px_rgba(16,163,127,0.25)]">
              <ShieldCheck className="h-7 w-7 animate-pulse" />
            </div>
            <div>
              <p className="font-display text-lg font-bold uppercase tracking-wide text-[#10a37f]">Sentinel Defenses Armed</p>
              <p className="text-xs font-mono text-slate-300 dark:text-[#8E8E8E]">All retrieval queries and vector embeddings are authenticated and logged through role-based access control.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#212121] px-4 py-2 text-center">
              <p className="text-xs font-mono text-slate-400 dark:text-[#8E8E8E]">SUCCESS</p>
              <p className="text-lg font-bold text-emerald-400">{successCount}</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#212121] px-4 py-2 text-center">
              <p className="text-xs font-mono text-slate-400 dark:text-[#8E8E8E]">INTERCEPTED</p>
              <p className="text-lg font-bold text-amber-400">{blockedCount}</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#212121] px-4 py-2 text-center">
              <p className="text-xs font-mono text-slate-400 dark:text-[#8E8E8E]">TOTAL LOGS</p>
              <p className="text-lg font-bold text-slate-900 dark:text-[#ECECEC]">{logs.length}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <CyberCard3D glowColor="emerald" className="p-6">
          <h2 className="font-display text-base font-bold text-ink">Security Controls</h2>
          <p className="text-xs font-mono text-muted">Active protection layers</p>
          <div className="mt-5 space-y-3">
            {items.map((it) => (
              <motion.div
                key={it.label}
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-between rounded-xl border border-line bg-surface-muted/50 dark:bg-[#212121]/60 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                    <it.icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-mono font-medium text-ink">{it.label}</span>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" /> {it.value}
                </span>
              </motion.div>
            ))}
          </div>
        </CyberCard3D>

        <CyberCard3D glowColor="cyan" className="p-6 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="font-display text-base font-bold text-ink">Live Security Audit Timeline</h2>
              <p className="text-xs font-mono text-muted">Authenticated query logs &amp; access enforcement</p>
            </div>
            {/* Status Pills */}
            <div className="flex items-center gap-1.5 rounded-lg bg-surface-muted p-1 border border-line">
              {(['all', 'success', 'blocked', 'failed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-mono capitalize transition-colors ${
                    statusFilter === st
                      ? 'bg-blue-600 dark:bg-white dark:text-neutral-900 text-white font-semibold shadow-xs'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit trail by user, action, resource or details..."
              className="w-full rounded-xl border border-line bg-surface-muted/50 px-3.5 py-2 text-xs font-mono text-ink placeholder:text-muted outline-none focus:border-[#10a37f]"
            />
          </div>

          {loading ? (
            <div className="mt-5"><SkeletonLoader variant="library" /></div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-muted">No audit logs matching query.</div>
          ) : (
            <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
              {filteredLogs.map((l, i) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: DURATION.FAST,
                    delay: Math.min(i * 0.03, 0.3),
                    ease: EASING.SMOOTH,
                  }}
                  className="flex items-start gap-4 rounded-xl px-3.5 py-3 transition hover:bg-surface-muted/70 dark:hover:bg-[#2f2f2f]"
                >
                  <div className="flex flex-col items-center">
                    <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${toneStyles[l.status]}`} />
                    <span className="mt-1 h-full w-px bg-line" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-mono font-bold text-ink">{l.action}</p>
                      {l.resource && (
                        <span className="rounded bg-surface-muted px-1.5 py-0.5 text-[10px] font-mono text-muted">
                          {l.resource}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-mono text-muted">{l.userName} · {l.timestamp}</p>
                    <p className="text-[11px] text-faint font-mono">{l.details}</p>
                  </div>
                  <span className={statusChip[l.status]}>{l.status}</span>
                </motion.div>
              ))}
            </div>
          )}
        </CyberCard3D>
      </div>
    </FadeUp>
  )
}

