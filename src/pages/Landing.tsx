import { Link } from 'react-router-dom'
import {
  Shield, Eye, Database, Search, AlertTriangle, Activity,
  ChevronRight, Brain, CheckCircle2, Lock, KeyRound, FileSearch,
  Layers, ScrollText, ArrowRight, Wifi, Clock, Sparkles, Settings,
  Battery, UserRound, MessageSquare, Bell, ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import LandingNavbar from '../components/landing/LandingNavbar'
import LandingFooter from '../components/landing/LandingFooter'
import { Sentinel3DCore } from '../components/common/Sentinel3DCore'
import { CyberCard3D } from '../components/common/CyberCard3D'
import { Text3D } from '../components/common/Text3D'
import {
  GravityStarsBackground,
  BorderBeam,
  LiquidButton,
  RippleButton,
  SentinelDrawLogo,
} from '../components/animate'

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
          {/* Pill Badge matching Animate UI */}
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 px-3.5 py-1 text-xs text-neutral-600 dark:text-neutral-300 backdrop-blur-md shadow-sm transition hover:border-neutral-300 dark:hover:border-neutral-700">
            <span className="rounded-full bg-neutral-200 dark:bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-neutral-800 dark:text-white flex items-center gap-1">
              <span>New</span> <span>🪄</span>
            </span>
            <span>Neural Vector RAG 2.0</span>
          </div>

          {/* Main Title matching Animate UI */}
          <h1 className="mt-7 text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.12] max-w-4xl">
            Secure your enterprise with smooth intelligence
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-neutral-600 dark:text-neutral-400 max-w-2xl text-base sm:text-lg leading-relaxed">
            A zero-trust, private knowledge platform. Browse verified enterprise documents,
            inspect page citations, and enforce role-based access with guaranteed evidence grounding.
          </p>

          {/* Action Buttons matching Animate UI */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={isAuthenticated ? '/search' : '/login'}
              className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 dark:bg-white px-6 py-2.5 text-sm font-semibold text-white dark:text-black transition-all hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-md shadow-black/5 dark:shadow-white/5"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/90 px-6 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
            >
              <span>Browse Capabilities</span>
            </a>
          </div>

          {/* Centered Monochrome Tech Stack Row */}
          <div className="mt-9 flex items-center justify-center gap-7 text-neutral-400 dark:text-neutral-500">
            {/* React */}
            <svg className="h-5 w-5 transition-colors hover:text-neutral-900 dark:hover:text-white" viewBox="0 0 115.3 100" fill="currentColor">
              <path d="M57.6 62.4c6.3 0 11.4-5.1 11.4-11.4S63.9 39.6 57.6 39.6s-11.4 5.1-11.4 11.4 5.1 11.4 11.4 11.4zM57.6 100c-15.5 0-29.4-4.8-39.7-13.4C8 78.1 2.2 65.5 2.2 51c0-14.5 5.8-27.1 15.7-35.6C28.2 6.8 42.1 2 57.6 2s29.4 4.8 39.7 13.4C107.2 23.9 113 36.5 113 51c0 14.5-5.8 27.1-15.7 35.6C87 95.2 73.1 100 57.6 100zm0-9.2c12.9 0 24.3-4 32.5-11.2 8.3-7.2 13-17.6 13-28.6s-4.7-21.4-13-28.6C81.9 15.2 70.5 11.2 57.6 11.2s-24.3 4-32.5 11.2C16.8 29.6 12.1 40 12.1 51s4.7 21.4 13 28.6c8.2 7.2 19.6 11.2 32.5 11.2z" />
            </svg>
            {/* TS */}
            <div className="flex h-5 w-5 items-center justify-center rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-[10px] font-bold text-neutral-700 dark:text-neutral-300 transition-colors hover:text-neutral-900 dark:hover:text-white">
              TS
            </div>
            {/* Tailwind */}
            <svg className="h-5 w-5 transition-colors hover:text-neutral-900 dark:hover:text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.975 12 6.001 12z"/>
            </svg>
            {/* Motion */}
            <svg className="h-4 w-4 transition-colors hover:text-neutral-900 dark:hover:text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z"/>
            </svg>
            {/* Slash */}
            <span className="text-lg font-light text-neutral-400 dark:text-neutral-600">/</span>
          </div>

          {/* Animate UI 4 Showcase Preview Cards */}
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl w-full text-left">
            {/* Card 1: Primitives */}
            <div className="group rounded-2xl border border-neutral-200 dark:border-neutral-800/90 bg-white dark:bg-[#121214] p-5 transition-all hover:border-neutral-300 dark:hover:border-neutral-700 shadow-lg dark:shadow-2xl dark:shadow-black/50">
              <span className="font-serif italic text-neutral-500 dark:text-neutral-400 text-sm tracking-wide block text-center mb-4 select-none">
                Primitives
              </span>
              <div className="rounded-xl border border-neutral-200 dark:border-white/[0.06] bg-neutral-50 dark:bg-[#18181b]/90 p-4 flex flex-col gap-2.5 h-36 justify-between transition-transform group-hover:scale-[1.02]">
                <div className="h-9 w-9 rounded-md bg-neutral-300 dark:bg-neutral-700/60" />
                <div className="space-y-1.5">
                  <div className="h-2 w-3/4 rounded-full bg-neutral-300 dark:bg-neutral-700/70" />
                  <div className="h-2 w-1/2 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                  <div className="h-2 w-2/3 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                </div>
                <div className="h-5 w-12 rounded bg-neutral-300 dark:bg-neutral-700/70 self-end" />
              </div>
            </div>

            {/* Card 2: Components */}
            <div className="group rounded-2xl border border-neutral-200 dark:border-neutral-800/90 bg-white dark:bg-[#121214] p-5 transition-all hover:border-neutral-300 dark:hover:border-neutral-700 shadow-lg dark:shadow-2xl dark:shadow-black/50">
              <span className="font-serif italic text-neutral-500 dark:text-neutral-400 text-sm tracking-wide block text-center mb-4 select-none">
                Components
              </span>
              <div className="rounded-xl border border-neutral-200 dark:border-white/[0.06] bg-neutral-50 dark:bg-[#18181b]/90 p-4 flex flex-col gap-2.5 h-36 justify-between transition-transform group-hover:scale-[1.02]">
                <div className="h-7 w-7 rounded-full border-2 border-neutral-400 dark:border-neutral-600/70 flex items-center justify-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-neutral-400 dark:bg-neutral-600/80" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 w-4/5 rounded-full bg-neutral-300 dark:bg-neutral-700/70" />
                  <div className="h-2 w-3/5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                </div>
                <div className="h-5 w-11 rounded-md border border-neutral-300 dark:border-neutral-600 bg-neutral-200 dark:bg-neutral-800/90 self-end" />
              </div>
            </div>

            {/* Card 3: Icons */}
            <div className="group rounded-2xl border border-neutral-200 dark:border-neutral-800/90 bg-white dark:bg-[#121214] p-5 transition-all hover:border-neutral-300 dark:hover:border-neutral-700 shadow-lg dark:shadow-2xl dark:shadow-black/50">
              <span className="font-serif italic text-neutral-500 dark:text-neutral-400 text-sm tracking-wide block text-center mb-4 select-none">
                Icons
              </span>
              <div className="rounded-xl border border-neutral-200 dark:border-white/[0.06] bg-neutral-50 dark:bg-[#18181b]/90 p-3.5 grid grid-cols-4 gap-3 h-36 items-center place-items-center transition-transform group-hover:scale-[1.02] text-neutral-400 dark:text-neutral-500">
                <Wifi className="h-4 w-4 hover:text-neutral-900 dark:hover:text-white transition-colors" />
                <Clock className="h-4 w-4 hover:text-neutral-900 dark:hover:text-white transition-colors" />
                <Activity className="h-4 w-4 hover:text-neutral-900 dark:hover:text-white transition-colors" />
                <Sparkles className="h-4 w-4 hover:text-neutral-900 dark:hover:text-white transition-colors" />
                <Settings className="h-4 w-4 hover:text-neutral-900 dark:hover:text-white transition-colors" />
                <ShieldCheck className="h-4 w-4 hover:text-neutral-900 dark:hover:text-white transition-colors" />
                <Battery className="h-4 w-4 hover:text-neutral-900 dark:hover:text-white transition-colors" />
                <UserRound className="h-4 w-4 hover:text-neutral-900 dark:hover:text-white transition-colors" />
                <MessageSquare className="h-4 w-4 hover:text-neutral-900 dark:hover:text-white transition-colors" />
                <Bell className="h-4 w-4 hover:text-neutral-900 dark:hover:text-white transition-colors" />
                <Clock className="h-4 w-4 hover:text-neutral-900 dark:hover:text-white transition-colors" />
                <ArrowRight className="h-4 w-4 hover:text-neutral-900 dark:hover:text-white transition-colors" />
              </div>
            </div>

            {/* Card 4: Soon... */}
            <div className="group rounded-2xl border border-neutral-200 dark:border-neutral-800/90 bg-white dark:bg-[#121214] p-5 transition-all hover:border-neutral-300 dark:hover:border-neutral-700 shadow-lg dark:shadow-2xl dark:shadow-black/50">
              <span className="font-serif italic text-neutral-500 dark:text-neutral-400 text-sm tracking-wide block text-center mb-4 select-none">
                Soon...
              </span>
              <div className="rounded-xl border border-neutral-200 dark:border-white/[0.06] bg-neutral-50 dark:bg-[#18181b]/90 p-3 h-36 flex gap-2 transition-transform group-hover:scale-[1.02]">
                <div className="w-1/4 border-r border-neutral-200 dark:border-neutral-800/70 pr-1 flex flex-col gap-1.5">
                  <div className="h-2 w-full rounded-full bg-neutral-300 dark:bg-neutral-700/60" />
                  <div className="h-1.5 w-3/4 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                  <div className="h-1.5 w-4/5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                  <div className="h-1.5 w-2/3 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-9 w-full rounded-md bg-neutral-200 dark:bg-neutral-800/80" />
                  <div className="grid grid-cols-2 gap-1.5 flex-1">
                    <div className="rounded bg-neutral-200/80 dark:bg-neutral-800/60" />
                    <div className="rounded bg-neutral-200/80 dark:bg-neutral-800/60" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Sentinel Interactive Core Preview */}
          <div className="mt-16 flex flex-col items-center justify-center gap-6">
            <Sentinel3DCore size="hero" interactive={true} showTelemetry={true} />
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-line bg-surface/50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="badge-blue">Features</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Everything you need for <span className="text-brand-blue">trusted enterprise AI</span>
            </h2>
            <p className="mt-4 text-muted">
              A complete suite of security, intelligence, and analytics tools built specifically for enterprise knowledge
              management.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <CyberCard3D key={f.title} className="p-6">
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
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="badge-blue">How it works</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">From question to verified answer</h2>
            <p className="mt-4 text-muted">A simple, transparent pipeline — secure at every step.</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((s) => (
              <div key={s.step} className="relative card-hover p-6">
                <span className="absolute right-4 top-4 text-3xl font-black text-surface-soft select-none">{s.step}</span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
                  <s.Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="border-y border-line bg-surface/50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
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
                  <div key={p.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
                      <p.Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">{p.title}</p>
                      <p className="text-sm text-muted">{p.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security stats card */}
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
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="card overflow-hidden bg-gradient-to-br from-primary to-brand-blue p-8 text-center sm:p-12">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Put your knowledge to work
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-blue-100">
              Start searching your enterprise documents securely with AI-powered, evidence-backed answers.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to={isAuthenticated ? '/search' : '/login'}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-primary transition hover:brightness-95"
              >
                {isAuthenticated ? 'Open the workspace' : 'Get Started Free'} <ArrowRight className="h-5 w-5" />
              </Link>
              <button
                onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Learn more
              </button>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}
