import { Link } from 'react-router-dom'
import {
  Shield, Eye, Database, Search, AlertTriangle, Activity,
  ChevronRight, Brain, CheckCircle2, Lock, KeyRound, FileSearch,
  Layers, ScrollText, ArrowRight,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import LandingNavbar from '../components/landing/LandingNavbar'
import LandingFooter from '../components/landing/LandingFooter'

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
      <div className="card overflow-hidden p-5 sm:p-6">
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

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 lg:pt-40">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-blue/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-24 h-80 w-80 rounded-full bg-brand-blue/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          {/* Text */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-blue">
              <Shield className="h-3.5 w-3.5" /> Secure Enterprise AI
            </div>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Your Enterprise Knowledge.{' '}
              <span className="text-brand-blue">Secured by Intelligence.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Search internal company knowledge with confidence. Sentinel AI combines role-based security, intelligent
              document retrieval, and visual source verification in one secure platform.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={isAuthenticated ? '/search' : '/login'}
                className="btn-primary justify-center px-8 py-3.5 text-base"
              >
                {isAuthenticated ? 'Open the workspace' : 'Get Started'} <ChevronRight className="h-5 w-5" />
              </Link>
              <button
                onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary justify-center px-8 py-3.5 text-base"
              >
                Explore Platform
              </button>
            </div>
            <div className="mt-8 flex flex-wrap gap-5">
              {heroFeatures.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-muted">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-blue" />
                  <span className="font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="hidden lg:block">
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
              <div key={f.title} className="card-hover group flex flex-col p-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-faint">{f.category}</span>
                <div className={`mt-3 flex h-12 w-12 items-center justify-center rounded-2xl ${f.accent}`}>
                  <f.Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-bold text-ink">{f.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{f.description}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-blue opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
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
