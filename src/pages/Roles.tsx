import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { KeyRound, Users, ShieldCheck, ArrowRight } from 'lucide-react'
import { PermissionMatrix } from '../components/users/PermissionMatrix'
import { useAuth } from '../context/AuthContext'
import { ErrorState } from '../components/common/ErrorState'
import { FadeUp, HoverCard, StaggerContainer, StaggerItem } from '../components/animations'
import { BorderBeam } from '../components/animate/BorderBeam'
import { RippleButton } from '../components/animate/RippleButton'

export default function Roles() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'

  if (!isAdmin) {
    return (
      <FadeUp className="space-y-6">
        <h1 className="page-title text-2xl font-bold">Roles &amp; Permissions</h1>
        <ErrorState variant="unauthorized" title="Access Restricted" message="Role management is restricted to administrators.">
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

  const roleList = [
    {
      icon: Users,
      name: 'Employee',
      desc: 'Search verified documents and view citations.',
      color: 'bg-blue-500/10 text-brand-blue border-blue-500/20',
      beam: false,
    },
    {
      icon: KeyRound,
      name: 'Manager',
      desc: 'Upload documents, view analytical gaps, and inspect reports.',
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      beam: false,
    },
    {
      icon: ShieldCheck,
      name: 'Admin',
      desc: 'Full system clearance, user provisioning, and audit logs.',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      beam: true,
    },
  ]

  return (
    <FadeUp className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#212121] px-3 py-1 text-xs font-medium text-slate-600 dark:text-[#8e8e8e] mb-2">
          <span>Security Governance</span>
        </div>
        <h1 className="page-title font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-[#ececec]">
          Role &amp; Permission Management
        </h1>
        <p className="page-subtitle text-xs sm:text-sm text-slate-500 dark:text-[#8e8e8e]">
          Define role-based access control policies. Every query and vector retrieval is strictly enforced by the backend at execution time.
        </p>
      </div>

      <StaggerContainer staggerDelay={0.06} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {roleList.map((r, i) => (
          <StaggerItem key={r.name}>
            <HoverCard hoverY={-3} className="card relative overflow-hidden h-full p-5 transition-shadow">
              {r.beam && (
                <BorderBeam size={130} duration={8} colorFrom="#10a37f" colorTo="#ececec" />
              )}
              <div className="flex items-center gap-3.5">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${r.color}`}>
                  <r.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display font-semibold text-ink">{r.name}</p>
                    {r.name === user?.role && (
                      <span className="rounded-full bg-[#10a37f]/10 px-2 py-0.5 text-[10px] font-bold text-[#10a37f] border border-[#10a37f]/20">
                        You
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted leading-relaxed">{r.desc}</p>
                </div>
              </div>
            </HoverCard>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink">Permissions Matrix</h2>
          <span className="text-xs text-muted">Role capabilities summary</span>
        </div>
        <PermissionMatrix />
        <p className="mt-3 text-xs text-muted">
          Note: Frontend role gating is an interactive feature only. The backend Sentinel engine enforces zero-trust authorization before any document retrieval.
        </p>
      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        className="card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Manage User Clearances</p>
            <p className="text-xs text-muted">Assign roles, reset credentials, or deactivate employee logins.</p>
          </div>
        </div>
        <RippleButton
          onClick={() => navigate('/users')}
          className="btn-secondary inline-flex items-center gap-2 self-start sm:self-auto text-xs"
        >
          Go to User Management
          <ArrowRight className="h-3.5 w-3.5" />
        </RippleButton>
      </motion.div>
    </FadeUp>
  )
}


