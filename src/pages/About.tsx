import { Link } from 'react-router-dom'
import { ShieldCheck, FileSearch, BookOpen, Layers, Search, CheckCircle2, AlertCircle } from 'lucide-react'

const pillars = [  {
    Icon: ShieldCheck,
    tag: 'Pillar 01 · Security',
    title: 'Security Must Come First',
    body: 'AI search checks a user\u2019s role before it searches, so junior employees never see secret files. Access is filtered by your permission level at every query — before any answer is returned.',
    accent: 'text-brand-blue bg-brand-blue/10',
  },
  {
    Icon: FileSearch,
    tag: 'Pillar 02 · Proof',
    title: 'Visual Proof Builds Trust',
    body: 'A text answer alone causes doubt. Sentinel AI shows the exact PDF page side-by-side with the answer, so you can verify the AI isn\u2019t making things up.',
    accent: 'text-green-600 dark:text-green-400 bg-green-500/10',
  },
  {
    Icon: AlertCircle,
    tag: 'Pillar 03 · Insight',
    title: 'Failed Searches Show Missing Documents',
    body: 'When the AI cannot answer a question, that question is saved automatically. It tells HR exactly which policy is missing and needs to be uploaded next.',
    accent: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
  },
  {
    Icon: Layers,
    tag: 'Pillar 04 · Unity',
    title: 'One System, Not Silos',
    body: 'Other research papers only fix one problem at a time. Sentinel AI combines security, visual proof, and missing-data alerts into a single, unified system.',
    accent: 'text-violet-600 dark:text-violet-400 bg-violet-500/10',
  },
]

const quickLinks = [
  {
    Icon: Search,
    title: 'Search with proof',
    desc: 'Ask a question and see the exact source page alongside every answer.',
    href: '/search',
    cta: 'Try a search',
  },
  {
    Icon: BookOpen,
    title: 'Browse your documents',
    desc: 'Open the same documents the AI reasons over, with full page-level evidence.',
    href: '/documents',
    cta: 'Open vault',
  },
  {
    Icon: CheckCircle2,
    title: 'Your recent searches',
    desc: 'Review the questions you asked and how the AI answered them.',
    href: '/history',
    cta: 'View history',
  },
]

export default function About() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-brand-blue">
          WHY SENTINEL AI
        </span>
        <h1 className="page-title mt-4 text-3xl font-bold">Your knowledge, made trustworthy.</h1>
        <p className="page-subtitle mt-2 max-w-2xl">
          Sentinel AI was built around one idea: enterprise knowledge is only useful when it is secure, provable, and
          complete. Here is how it protects you and builds confidence in every answer.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {pillars.map((p) => (
          <div
            key={p.title}
            className="card group flex flex-col p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-md"
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${p.accent}`}>
              <p.Icon className="h-5 w-5" />
            </div>
            <p className="mt-4 font-mono text-[10px] tracking-[0.25em] text-muted">{p.tag}</p>
            <h2 className="mt-1 text-lg font-bold text-ink">{p.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
          </div>
        ))}
      </div>

      {/* Quick start links */}
      <div className="card p-6">
        <h2 className="text-base font-bold text-ink">Put it to work</h2>
        <p className="mt-1 text-sm text-muted">Explore the tools that deliver these guarantees.</p>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {quickLinks.map((q) => (
            <Link
              key={q.href}
              to={q.href}
              className="group flex flex-col rounded-xl border border-line bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-brand-blue/40 hover:shadow-card-md"
            >
              <q.Icon className="h-5 w-5 text-brand-blue" />
              <p className="mt-3 text-sm font-semibold text-ink">{q.title}</p>
              <p className="mt-1 flex-1 text-xs text-muted">{q.desc}</p>
              <p className="mt-3 text-xs font-semibold text-brand-blue group-hover:underline">{q.cta} →</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
