import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileText, MessagesSquare, CheckCircle2, Lightbulb,
  Search, ShieldCheck, ArrowRight, History, Clock,
  Cpu, Zap, Terminal
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { StatCard } from '../components/dashboard/StatCard'
import { CyberCard3D } from '../components/common/CyberCard3D'
import { BorderBeam } from '../components/animate/BorderBeam'
import { RippleButton } from '../components/animate/RippleButton'
import { StaggerContainer, StaggerItem } from '../components/animations/StaggerContainer'
import { FadeUp } from '../components/animations/FadeUp'
import { EASING, DURATION } from '../components/animations/motion-tokens'

const suggestions = [
  'What is the company\'s remote work policy?',
  'What is the annual leave policy?',
  'Explain our cloud data security policy',
  'What are the employee onboarding requirements?',
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

const recent = [
  { q: 'What is the remote work policy?', t: 'Today, 4:32 PM', status: 'verified', dept: 'HR' },
  { q: 'How many days of annual leave do I get?', t: 'Today, 2:15 PM', status: 'verified', dept: 'HR' },
  { q: 'Explain our data retention policy', t: 'Yesterday, 3:45 PM', status: 'verified', dept: 'Legal' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isManager = user?.role === 'manager' || user?.role === 'admin'
  const firstName = user?.name?.split(' ')[0] ?? 'Operator'

  useEffect(() => {
    if (!isManager) {
      navigate('/search', { replace: true })
    }
  }, [isManager, navigate])

  if (!isManager) return null

  return (
    <div className="space-y-8">
      {/* Sentinel Command Center Hero Banner */}
      <FadeUp delay={0.05}>
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#262626] p-8 sm:p-10 shadow-sm">
          {/* Animate UI Border Beam */}
          <BorderBeam size={220} duration={12} colorFrom="#10a37f" colorTo="#ececec" />
          {/* Soft Ambient Horizon Accent */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/[0.03] dark:bg-emerald-500/[0.02] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-neutral-500/[0.03] blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              {/* Status Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#212121] px-3 py-1 text-xs font-medium text-slate-600 dark:text-[#b4b4b4]">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Knowledge System Operational</span>
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl text-slate-900 dark:text-[#ececec]">
                {getGreeting()},{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 dark:from-white dark:via-neutral-200 dark:to-neutral-400 bg-clip-text text-transparent">
                  {firstName}
                </span>
              </h1>

              <p className="mt-2.5 text-sm sm:text-base text-slate-500 dark:text-[#8e8e8e] leading-relaxed max-w-xl">
                Query internal policies, technical documentation, and enterprise guidelines with verified citation grounding.
              </p>

              {/* Neural Search Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  navigate('/search')
                }}
                className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    placeholder="Ask a question about internal company knowledge..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        e.preventDefault()
                        navigate(`/search?q=${encodeURIComponent(e.currentTarget.value)}`)
                      }
                    }}
                    className="w-full rounded-xl border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-[#2f2f2f] py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-[#ececec] placeholder-slate-400 dark:placeholder-text-[#737373] transition-all duration-200 focus:border-blue-500 dark:focus:border-white/[0.25] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <RippleButton
                  type="submit"
                  className="btn-primary justify-center px-5 py-2.5 text-sm font-medium rounded-xl"
                >
                  <Search className="h-4 w-4" />
                  <span>Search Vault</span>
                </RippleButton>
              </form>

              {/* Quick Suggestion Chips */}
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-400 dark:text-[#737373] mr-1">Suggested:</span>
                {suggestions.map((s) => (
                  <motion.button
                    key={s}
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: DURATION.FAST, ease: EASING.SMOOTH }}
                    onClick={() => navigate(`/search?q=${encodeURIComponent(s)}`)}
                    className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#212121] px-2.5 py-1 text-xs text-slate-600 dark:text-[#b4b4b4] transition-colors hover:border-slate-300 dark:hover:border-white/[0.18] hover:text-slate-900 dark:hover:text-white"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* System Meta Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-white/[0.08] pt-4 text-xs text-slate-500 dark:text-[#8e8e8e]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-[#b4b4b4]">
                <Cpu className="h-3.5 w-3.5 text-blue-500 dark:text-emerald-400" /> Model: Gemini 2.0 Flash
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-indigo-500 dark:text-emerald-400" /> Vector Space: pgvector
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Zero-Trust RBAC
              </span>
            </div>
            <span className="text-slate-500 dark:text-[#737373]">Access Level: <strong className="uppercase text-slate-700 dark:text-[#ececec]">{user?.role}</strong></span>
          </div>
        </section>
      </FadeUp>

      {/* 4 Fluid Staggered Stat Cards */}
      <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <StatCard
            icon={FileText}
            label="Available Documents"
            value="1,248"
            delta="12% this month"
            glowColor="blue"
            iconClass="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={MessagesSquare}
            label="Knowledge Queries"
            value="8,426"
            delta="18% this month"
            glowColor="blue"
            iconClass="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={CheckCircle2}
            label="Verified Answers"
            value="94.8%"
            delta="3.2%"
            glowColor="emerald"
            iconClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            icon={Lightbulb}
            label="Knowledge Gaps"
            value="23"
            delta="8 pending"
            positive={false}
            glowColor="amber"
            iconClass="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
          />
        </StaggerItem>
      </StaggerContainer>

      {/* 3D Interactive Widgets */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent AI Searches */}
        <FadeUp delay={0.15} className="lg:col-span-2">
          <CyberCard3D glowColor="cyan" className="p-6 h-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  <History className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-ink">Recent AI Knowledge Searches</h2>
                  <p className="text-xs text-muted">Real-time queries routed through neural RAG</p>
                </div>
              </div>
              <motion.button
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/history')}
                className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-500 hover:text-cyan-400 transition-colors"
              >
                VIEW ALL <ArrowRight className="h-3.5 w-3.5" />
              </motion.button>
            </div>

            <StaggerContainer staggerDelay={0.06} className="mt-5 space-y-2.5">
              {recent.map((r, i) => (
                <StaggerItem key={i}>
                  <motion.button
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: DURATION.FAST, ease: EASING.SMOOTH }}
                    onClick={() => navigate('/history')}
                    className="group flex w-full items-center justify-between rounded-xl border border-line bg-surface-muted/60 dark:bg-slate-950/40 p-3.5 text-left transition-all hover:border-cyan-400/40 hover:bg-surface-soft hover:shadow-[0_4px_15px_rgba(0,240,255,0.1)]"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                        <Terminal className="h-4 w-4" />
                      </div>
                      <div className="truncate">
                        <span className="text-sm font-semibold text-ink group-hover:text-cyan-400 transition-colors">
                          {r.q}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            {r.dept}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono">
                            VERIFIED EVIDENCE
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="flex shrink-0 items-center gap-1.5 pl-3 text-xs font-mono text-muted">
                      <Clock className="h-3.5 w-3.5" /> {r.t}
                    </span>
                  </motion.button>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </CyberCard3D>
        </FadeUp>

        {/* Security & Access Governance */}
        <FadeUp delay={0.2} className="h-full">
          <CyberCard3D className="p-6 h-full">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">Access Governance</h2>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Compliant & Enforced</span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              All knowledge retrieval is strictly governed. Queries and embeddings never cross
              departmental boundaries without verified security clearance.
            </p>

            <div className="mt-5 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Security Clearance</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400 uppercase">{user?.role ?? 'employee'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Accessible Scope</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">12 collections</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Encryption Standard</span>
                <span className="font-mono text-[11px] font-medium text-slate-700 dark:text-slate-300">AES-256-GCM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Audit Logging</span>
                <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>
            </div>
          </CyberCard3D>
        </FadeUp>
      </section>
    </div>
  )
}

