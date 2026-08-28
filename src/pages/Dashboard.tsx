import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText, MessagesSquare, CheckCircle2, Lightbulb,
  Search, ShieldCheck, ArrowRight, History, Clock,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { StatCard } from '../components/dashboard/StatCard'

const suggestions = [
  'What is the company\'s remote work policy?',
  'What is the leave policy?',
  'Explain our data security policy',
  'What are the onboarding requirements?',
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

const recent = [
  { q: 'What is the remote work policy?', t: 'Today, 4:32 PM' },
  { q: 'How many days of annual leave do I get?', t: 'Today, 2:15 PM' },
  { q: 'Explain our data retention policy', t: 'Yesterday, 3:45 PM' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isManager = user?.role === 'manager' || user?.role === 'admin'
  const firstName = user?.name?.split(' ')[0] ?? 'Krishna'

  useEffect(() => {
    if (!isManager) {
      navigate('/search', { replace: true })
    }
  }, [isManager, navigate])

  if (!isManager) return null

  return (
    <div className="space-y-8">
      <section className="corp-bg relative overflow-hidden rounded-2xl border border-line p-8 shadow-card lg:p-10">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight text-brand-blue lg:text-4xl">
            {getGreeting()}, {firstName}
          </h1>
          <p className="mt-2 max-w-2xl text-muted">
            Your secure enterprise knowledge workspace. Search internal documents, policies, reports
            and knowledge using AI — with every answer backed by document evidence.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              navigate('/search')
            }}
            className="mt-7 flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-faint" />
              <input
                placeholder="Ask Sentinel AI a question..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    e.preventDefault()
                    navigate(`/search?q=${encodeURIComponent(e.currentTarget.value)}`)
                  }
                }}
                className="input py-3.5 pl-11"
              />
            </div>
            <button type="submit" className="btn-primary justify-center px-6 py-3.5">
              Ask Sentinel
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted">Try:</span>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => navigate(`/search?q=${encodeURIComponent(s)}`)}
                className="rounded-full border border-line bg-surface/70 px-3 py-1 text-xs text-muted transition hover:border-line hover:bg-surface"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FileText} label="Available Documents" value="1,248" delta="12% this month" />
        <StatCard icon={MessagesSquare} label="Knowledge Queries" value="8,426" delta="18% this month" />
        <StatCard icon={CheckCircle2} label="Verified Answers" value="94.8%" delta="3.2%" iconClass="bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400" />
        <StatCard icon={Lightbulb} label="Knowledge Gaps" value="23" delta="8 this month" positive={false} iconClass="bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400" />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-ink">Recent AI Searches</h2>
              <p className="text-sm text-muted">Your latest knowledge queries</p>
            </div>
            <button onClick={() => navigate('/history')} className="flex items-center gap-1.5 text-sm font-medium text-brand-blue hover:text-brand-blue">
              View all
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-5 space-y-2">
            {recent.map((r, i) => (
              <button
                key={i}
                onClick={() => navigate('/history')}
                className="flex w-full items-center justify-between rounded-xl border border-line px-4 py-3 text-left transition hover:border-line hover:bg-surface-muted"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
                    <History className="h-4 w-4" />
                  </div>
                  <span className="truncate text-sm font-medium text-ink">{r.q}</span>
                </div>
                <span className="flex shrink-0 items-center gap-1.5 pl-2 text-xs text-muted">
                  <Clock className="h-3.5 w-3.5" /> {r.t}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink">Authorized Search</h2>
              <p className="text-xs font-medium uppercase tracking-wide text-green-600 dark:text-green-400">System secure</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted">
            Your query is searched only across documents available to your role. Never across unauthorized data.
          </p>
          <div className="mt-5 space-y-3 border-t border-line-soft pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Role</span>
              <span className="font-semibold capitalize text-ink">{user?.role ?? 'employee'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Access Scope</span>
              <span className="font-semibold text-ink">12 document collections</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">RBAC Filtering</span>
              <span className="font-semibold text-green-600 dark:text-green-400">Active</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
