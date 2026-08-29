import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area,
} from 'recharts'
import {
  MessagesSquare, CheckCircle2, XCircle, Timer, Sparkles, Lightbulb,
  FileQuestion, PlusCircle, AlertTriangle, TrendingUp,
} from 'lucide-react'
import { getAnalytics, getKnowledgeGaps } from '../services/api'
import type { AnalyticsData, KnowledgeGap } from '../types'
import { KnowledgeGapCard } from '../components/analytics/KnowledgeGapCard'
import { ChartCard } from '../components/analytics/ChartCard'
import { StatCard } from '../components/dashboard/StatCard'
import { SkeletonLoader } from '../components/common/SkeletonLoader'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/common/Toast'

const priorityColors: Record<KnowledgeGap['priority'], string> = {
  high: 'border-red-200 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400',
  medium: 'border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400',
  low: 'border-line bg-surface-soft text-muted',
}

const statusBadge: Record<KnowledgeGap['status'], string> = {
  open: 'badge-red',
  in_progress: 'badge-amber',
  resolved: 'badge-green',
}

function QualityGauge({ value, label }: { value: number; label: string }) {
  const color = value >= 90 ? '#16A34A' : value >= 80 ? '#2563EB' : '#F59E0B'
  return (
    <div className="flex flex-col items-center rounded-xl border border-line bg-surface-muted/50 p-4">
      <div className="relative h-24 w-24">
        <svg width={96} height={96} className="-rotate-90">
          <circle cx={48} cy={48} r={38} fill="none" stroke="var(--line)" strokeWidth={9} />
          <circle
            cx={48} cy={48} r={38} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 38} strokeDashoffset={2 * Math.PI * 38 * (1 - value / 100)}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-ink">{value}%</span>
        </div>
      </div>
      <p className="mt-2 text-center text-xs font-medium text-muted">{label}</p>
    </div>
  )
}

export default function AnalyticalGap() {
  const { user } = useAuth()
  const { toast } = useToast()
  const isManager = user?.role === 'manager' || user?.role === 'admin'
  const [gaps, setGaps] = useState<KnowledgeGap[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getKnowledgeGaps(), getAnalytics()]).then(([g, a]) => {
      setGaps(g)
      setAnalytics(a)
      setLoading(false)
    })
  }, [])

  if (!isManager) {
    return (
      <div className="space-y-6">
        <h1 className="page-title text-2xl font-bold">Analytical Gap</h1>
        <ErrorState
          variant="unauthorized"
          title="Access Restricted"
          message="Analytics are available to managers and administrators only."
        />
      </div>
    )
  }

  if (loading || !analytics) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="page-title text-2xl font-bold">Analytical Gap</h1>
          <p className="page-subtitle">Loading gap intelligence...</p>
        </div>
        <SkeletonLoader variant="analytics" />
      </div>
    )
  }

  const gapOverTime = analytics.queryTrend.map((q) => ({ month: q.date, count: Math.max(0, q.queries - q.successful) }))
  const openGaps = gaps.filter((g) => g.status !== 'resolved').length
  const highPriority = gaps.filter((g) => g.priority === 'high' && g.status === 'open').length
  const gapsByDept = analytics.gapsByDepartment
  const maxDept = gapsByDept.length ? Math.max(...gapsByDept.map((d) => d.count)) : 1
  const trend = analytics.queryTrend.map((q) => ({ date: q.date, queries: q.queries, answered: q.successful }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title text-2xl font-bold">Analytical Gap</h1>
        <p className="page-subtitle">Query performance, answer quality, and knowledge gaps your organization cannot answer.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={MessagesSquare} label="Total Queries" value={analytics.totalQueries.toLocaleString()} delta="This period" />
        <KnowledgeGapCard icon={TrendingUp} value={String(openGaps)} label="Unanswered Queries" accent="danger" />
        <KnowledgeGapCard icon={FileQuestion} value={String(highPriority)} label="High Priority Gaps" accent="warning" />
        <StatCard icon={Timer} label="Avg Response Time" value={`${analytics.avgResponseTime} sec`} delta="Fast" iconClass="bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard title="Query Volume" subtitle="Total vs successful answers">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--line)' }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="queries" name="Total Queries" fill="var(--line)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="answered" name="Answered" fill="var(--brand-blue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Answer Quality" subtitle="AI performance metrics">
          <div className="grid grid-cols-2 gap-3">
            <QualityGauge value={analytics.faithfulnessScore} label="Faithfulness" />
            <QualityGauge value={analytics.contextRelevance} label="Context Relevance" />
            <QualityGauge value={analytics.answerConfidence} label="Answer Confidence" />
            <QualityGauge value={analytics.retrievalPrecision} label="Retrieval Precision" />
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Knowledge Gaps Over Time" subtitle="Unanswered queries by day">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gapOverTime} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gapGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--line)' }} />
                <Area type="monotone" dataKey="count" stroke="#DC2626" strokeWidth={2} fill="url(#gapGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Gaps by Department" subtitle="Unanswered queries by department">
          <div className="h-64 space-y-3 pt-2">
            {gapsByDept.map((d) => (
              <div key={d.department}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-ink">{d.department}</span>
                  <span className="text-muted">{d.count}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-soft">
                  <div className="h-full rounded-full bg-brand-blue transition-all duration-700" style={{ width: `${(d.count / maxDept) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Unanswered Questions"
        subtitle="Frequently asked queries with no matching document"
        action={
          <button
            onClick={() => toast('success', 'Document request created and routed to administrators')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-blue"
          >
            <PlusCircle className="h-4 w-4" />
            Create Document Request
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-line-soft text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="py-3">Question</th>
                <th className="py-3">Frequency</th>
                <th className="py-3">Priority</th>
                <th className="py-3">Status</th>
                <th className="py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {gaps.map((g) => (
                <tr key={g.id} className="border-b border-line-soft transition hover:bg-surface-muted/50">
                  <td className="py-3.5 font-medium text-ink">{g.question}</td>
                  <td className="py-3.5">
                    <span className="inline-flex min-w-9 items-center justify-center rounded-md bg-surface-soft px-2 py-0.5 text-xs font-semibold text-muted">{g.frequency}</span>
                  </td>
                  <td className="py-3.5">
                    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold uppercase ${priorityColors[g.priority]}`}>
                      {g.priority === 'high' && <AlertTriangle className="h-3 w-3" />}
                      {g.priority}
                    </span>
                  </td>
                  <td className="py-3.5">{statusBadge[g.status]}</td>
                  <td className="py-3.5 text-right">
                    <button onClick={() => toast('info', 'Request logged for: ' + g.question)} className="text-sm font-medium text-brand-blue hover:text-brand-blue">
                      Request
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {gaps.length === 0 && (
        <EmptyState
          icon={Lightbulb}
          title="No knowledge gaps detected"
          description="Your knowledge base is currently covering the most common employee questions."
        />
      )}

      <div className="card p-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-ink">Overall Answer Faithfulness</h2>
            <p className="mt-1 text-sm text-muted">Proportion of answers fully supported by retrieved evidence</p>
          </div>
          <div className="relative h-32 w-32">
            <svg width={128} height={128} className="-rotate-90">
              <circle cx={64} cy={64} r={54} fill="none" stroke="var(--line)" strokeWidth={12} />
              <circle
                cx={64} cy={64} r={54} fill="none" stroke="#16A34A" strokeWidth={12} strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 54} strokeDashoffset={2 * Math.PI * 54 * (1 - analytics.faithfulnessScore / 100)}
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-ink">{analytics.faithfulnessScore}%</span>
              <span className="text-[10px] text-muted">faithful</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 border-t border-line-soft pt-4 text-sm text-muted">
          <Sparkles className="h-4 w-4 text-brand-blue" />
          Every answer includes source verification and document evidence.
        </div>
      </div>
    </div>
  )
}