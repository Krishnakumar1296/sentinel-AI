import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Shield, Eye, Database, Search, AlertTriangle, Activity,
  ChevronRight, Brain, CheckCircle2, Lock, KeyRound, FileSearch,
  Layers, ScrollText, ArrowRight, Wifi, Clock, Sparkles, Settings,
  Battery, UserRound, MessageSquare, Bell, ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import LandingNavbar from '../components/landing/LandingNavbar'
import LandingFooter from '../components/landing/LandingFooter'
import { CyberCard3D } from '../components/common/CyberCard3D'
import { Text3D } from '../components/common/Text3D'
import {
  GravityStarsBackground,
  BorderBeam,
  LiquidButton,
  RippleButton,
  SentinelDrawLogo,
} from '../components/animate'
import { FadeUp } from '../components/animations/FadeUp'
import { StaggerContainer, StaggerItem } from '../components/animations/StaggerContainer'

const heroFeatures = [
  'Role-Based Access',
  'Private Document Vault',
  'Visual Source Proof',
]

const features = [
  {
    Icon: Shield,
    category: 'Access Control',
    title: 'Role-Based Access Control',
    description: "Search results are filtered by the user's role and permissions — unauthorized documents remain completely invisible.",
    accent: 'bg-brand-blue/10 text-brand-blue',
  },
  {
    Icon: Eye,
    category: 'Verification',
    title: 'Visual Document Grounding',
    description: 'Display the exact PDF page used to generate each answer, so users can verify AI responses directly.',
    accent: 'bg-green-500/10 text-green-600 dark:text-green-400',
  },
  {
    Icon: Database,
    category: 'Privacy',
    title: 'Private Vector Vault',
    description: 'Keep enterprise knowledge inside a protected private vector database — never shared with external AI providers.',
    accent: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  },
  {
    Icon: Search,
    category: 'Intelligence',
    title: 'Semantic Document Search',
    description: 'Find relevant information using semantic similarity instead of simple keyword matching for far more accurate results.',
    accent: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  },
  {
    Icon: AlertTriangle,
    category: 'Analytics',
    title: 'Knowledge Gap Detection',
    description: 'Capture unanswered questions and surface missing documentation so managers can close knowledge gaps proactively.',
    accent: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  {
    Icon: Activity,
    category: 'Quality',
    title: 'AI Faithfulness Analytics',
    description: 'Monitor answer quality, retrieval performance, and source attribution accuracy across all user queries.',
    accent: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
]

const howItWorks = [
  {
    Icon: FileSearch,
    step: '01',
    title: 'Ask a question',
    description: 'Query your enterprise knowledge naturally — policies, reports, handbooks and more.',
  },
  {
    Icon: KeyRound,
    step: '02',
    title: 'Role-scoped retrieval',
    description: 'Every search is filtered by your permission level before any document is returned.',
  },
  {
    Icon: Brain,
    step: '03',
    title: 'Verified AI answer',
    description: 'Sentinel generates an answer and shows the exact source page side-by-side as proof.',
  },
  {
    Icon: Layers,
    step: '04',
    title: 'Gaps tracked',
    description: 'Unanswered questions are logged automatically so missing knowledge gets fixed.',
  },
]

const pillars = [
  {
    Icon: Lock,
    title: 'Protected by design',
    description: 'Junior employees never see secret files. Access is filtered by role at every query.',
  },
  {
    Icon: Eye,
    title: 'Proof over promises',
    description: 'Visual evidence shows the exact page behind every answer — nothing made up.',
  },
  {
    Icon: Shield,
    title: 'Private by default',
    description: 'Enterprise documents stay inside your secure vault, never shared externally.',
  },
]

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[540px]">
      <div className="absolute inset-0 -z-10 scale-110 rounded-3xl bg-gradient-to-br from-brand-blue/20 via-transparent to-transparent blur-3xl" />
      <div className="card relative overflow-hidden p-5 sm:p-6 shadow-2xl">
        {/* Animate UI Border Beam */}
        <BorderBeam size={160} duration={8} colorFrom="#38bdf8" colorTo="#818cf8" />
        {/* Top bar */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
              <Shield className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-ink">Sentinel AI</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span className="text-xs font-medium text-green-600 dark:text-green-400">Secure Session</span>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-line bg-surface-muted px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-faint" />
          <span className="truncate text-sm text-faint">What is the employee leave policy?</span>
        </div>

        {/* AI answer */}
        <div className="mb-4 rounded-2xl border border-brand-blue/20 bg-brand-bg p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
              <Brain className="h-3 w-3" />
            </div>
            <span className="text-xs font-semibold text-brand-blue">AI Answer</span>
            <span className="ml-auto flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-3 w-3" /> Verified
            </span>
          </div>
          <p className="text-xs leading-relaxed text-muted">
            Employees are eligible for <strong className="text-ink">18 days</strong> of annual leave per year, accrued
            monthly. Additional sick leave of 12 days applies...
          </p>
        </div>

        {/* Source card */}
        <div className="mb-4 flex items-center justify-between rounded-xl border border-line bg-surface px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-[8px] font-bold text-red-500 dark:bg-red-500/10 dark:text-red-400">
              PDF
            </div>
            <div>
              <div className="text-xs font-semibold text-ink">Employee_Handbook.pdf</div>
              <div className="text-[10px] text-faint">Page 24 · HR Policy</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-brand-blue">
            View Source <ChevronRight className="h-3 w-3" />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-center">
          <div>
            <div className="text-sm font-bold text-ink">96%</div>
            <div className="text-[10px] text-faint">Confidence</div>
          </div>
          <div className="h-6 w-px bg-line" />
          <div>
            <div className="text-sm font-bold text-ink">1.2s</div>
            <div className="text-[10px] text-faint">Response</div>
          </div>
          <div className="h-6 w-px bg-line" />
          <div>
            <div className="text-sm font-bold text-green-600 dark:text-green-400">✓</div>
            <div className="text-[10px] text-faint">Source Verified</div>
          </div>
          <div className="h-6 w-px bg-line" />
          <div>
            <div className="text-sm font-bold text-ink">RBAC</div>
            <div className="text-[10px] text-faint">Enforced</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <LandingNavbar />

      {/* Hero with Animate UI Centered Spotlight & Style */}
      <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 lg:pt-36">
        {/* Animate UI Top-Center Diffused Ambient Spotlight */}
        <div
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[560px] w-[1000px] rounded-full blur-[140px] opacity-35 dark:opacity-45"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.45) 0%, rgba(186, 230, 253, 0.15) 35%, transparent 70%)',
          }}
        />

        {/* Masked Micro-Dot Grid Matrix */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.9) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse 85% 65% at 50% 12%, #000 35%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse 85% 65% at 50% 12%, #000 35%, transparent 85%)',
          }}
        />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Pill Badge matching Animate UI - 0ms */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 px-3.5 py-1 text-xs text-neutral-600 dark:text-neutral-300 backdrop-blur-md shadow-sm transition hover:border-neutral-300 dark:hover:border-neutral-700"
          >
            <span className="rounded-full bg-neutral-200 dark:bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-neutral-800 dark:text-white flex items-center gap-1">
              <span>New</span> <span>🪄</span>
            </span>
            <span>Neural Vector RAG 2.0</span>
          </motion.div>

          {/* Main Title matching Animate UI - 100ms */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.12] max-w-4xl"
          >
            Secure your enterprise with smooth intelligence
          </motion.h1>

          {/* Subtitle - 200ms */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 text-neutral-600 dark:text-neutral-400 max-w-2xl text-base sm:text-lg leading-relaxed"
          >
            A zero-trust, private knowledge platform. Browse verified enterprise documents,
            inspect page citations, and enforce role-based access with guaranteed evidence grounding.
          </motion.p>

          {/* Action Buttons matching Animate UI - 300ms */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to={isAuthenticated ? '/search' : '/login'}
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 dark:bg-white px-6 py-2.5 text-sm font-semibold text-white dark:text-black transition-all hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-md shadow-black/5 dark:shadow-white/5"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="#features"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/90 px-6 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
            >
              <span>Browse Capabilities</span>
            </motion.a>
          </motion.div>

          {/* Interactive Core Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-14 flex flex-col items-center justify-center gap-6"
          >
            <HeroVisual />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-line bg-surface/50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp delay={0.05} className="mx-auto max-w-2xl text-center">
            <span className="badge-blue">Features</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Everything you need for <span className="text-brand-blue">trusted enterprise AI</span>
            </h2>
            <p className="mt-4 text-muted">
              A complete suite of security, intelligence, and analytics tools built specifically for enterprise knowledge
              management.
            </p>
          </FadeUp>

          <StaggerContainer staggerDelay={0.08} className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <StaggerItem key={f.title}>
                <CyberCard3D className="p-6 h-full">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">{f.category}</span>
                  <div className={`mt-3 flex h-12 w-12 items-center justify-center rounded-2xl ${f.accent}`}>
                    <f.Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">{f.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </CyberCard3D>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp delay={0.05} className="mx-auto max-w-2xl text-center">
            <span className="badge-blue">How it works</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">From question to verified answer</h2>
            <p className="mt-4 text-muted">A simple, transparent pipeline — secure at every step.</p>
          </FadeUp>

          <StaggerContainer staggerDelay={0.08} className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((s) => (
              <StaggerItem key={s.step}>
                <motion.div
                  whileHover={{ y: -3, scale: 1.015 }}
                  transition={{ duration: 0.2 }}
                  className="relative card-hover p-6 h-full"
                >
                  <span className="absolute right-4 top-4 text-3xl font-black text-surface-soft select-none">{s.step}</span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
                    <s.Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.description}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="border-y border-line bg-surface/50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <FadeUp delay={0.05}>
              <span className="badge-blue">Security</span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Knowledge is only useful when it's <span className="text-brand-blue">secure</span>
              </h2>
              <p className="mt-4 text-muted">
                Every retrieval request passes through role-based authorization, and all access is logged for audit
                compliance. Unauthorized documents simply never appear.
              </p>
              <div className="mt-8 space-y-4">
                {pillars.map((p) => (
                  <motion.div
                    key={p.title}
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                    className="flex gap-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
                      <p.Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">{p.title}</p>
                      <p className="text-sm text-muted">{p.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeUp>

            {/* Security stats card */}
            <FadeUp delay={0.15}>
              <div className="card p-6 sm:p-8">
                <div className="flex items-center gap-3 border-b border-line-soft pb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
                    <ScrollText className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-ink">System Secure</p>
                    <p className="text-xs text-muted">All retrieval filtered through RBAC</p>
                  </div>
                </div>
                <dl className="mt-5 space-y-3">
                  {[
                    ['Authentication', 'Protected'],
                    ['Role-Based Access', 'Enabled'],
                    ['Document Access', 'Enforced'],
                    ['Vector Vault', 'Private'],
                    ['Audit Logging', 'Enabled'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between text-sm">
                      <dt className="text-muted">{k}</dt>
                      <dd className="flex items-center gap-1.5 font-semibold text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4" /> {v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp delay={0.05}>
            <div className="card overflow-hidden bg-gradient-to-br from-primary to-brand-blue p-8 text-center sm:p-12">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Put your knowledge to work
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-blue-100">
                Start searching your enterprise documents securely with AI-powered, evidence-backed answers.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to={isAuthenticated ? '/search' : '/login'}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-primary transition hover:brightness-95 shadow-md"
                  >
                    {isAuthenticated ? 'Open the workspace' : 'Get Started Free'} <ArrowRight className="h-5 w-5" />
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  Learn more
                </motion.button>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}
