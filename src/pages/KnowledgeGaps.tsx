import { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
  Lightbulb, TrendingUp, FileQuestion, PlusCircle, CheckCircle2, AlertTriangle,
} from 'lucide-react'
import { getKnowledgeGaps, getAnalytics } from '../services/api'
import type { KnowledgeGap, AnalyticsData } from '../types'
import { KnowledgeGapCard } from '../components/analytics/KnowledgeGapCard'
import { ChartCard } from '../components/analytics/ChartCard'
import { SkeletonLoader } from '../components/common/SkeletonLoader'
import { EmptyState } from '../components/common/EmptyState'
import { useToast } from '../components/common/Toast'

const priorityColors: Record<KnowledgeGap['priority'], string> = {
  high: 'border-red-200 bg-red-50 text-red-600',
  medium: 'border-amber-200 bg-amber-50 text-amber-600',
  low: 'border-slate-200 bg-slate-100 text-slate-600',
}

const statusBadge: Record<KnowledgeGap['status'], string> = {
  open: 'badge-red',
  in_progress: 'badge-amber',
  resolved: 'badge-green',
}

export default function KnowledgeGaps() {
  const { toast } = useToast()
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="page-title text-2xl font-bold">Knowledge Gap Analytics</h1>
          <p className="page-subtitle">Loading gap intelligence...</p>
        </div>
        <SkeletonLoader variant="analytics" />
      </div>
    )
  }

  const gapOverTime = analytics?.queryTrend.map((q) => ({ month: q.date, count: Math.max(0, q.queries - q.successful) })) ?? []
  const openGaps = gaps.filter((g) => g.status !== 'resolved').length
  const highPriority = gaps.filter((g) => g.priority === 'high' && g.status === 'open').length
  const gapsByDept = analytics?.gapsByDepartment ?? []
  const maxDept = gapsByDept.length ? Math.max(...gapsByDept.map((d) => d.count)) : 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title text-2xl font-bold">Knowledge Gap Analytics</h1>
        <p className="page-subtitle">Identify questions your organization cannot currently answer.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KnowledgeGapCard value={String(openGaps)} label="Unanswered Queries" accent="danger" />
        <KnowledgeGapCard icon={TrendingUp} value={String(highPriority)} label="High Priority Gaps" accent="warning" />
        <KnowledgeGapCard icon={FileQuestion} value={String(openGaps)} label="Missing Policies" />
        <KnowledgeGapCard icon={CheckCircle2} value="5" label="New This Week" accent="success" />
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
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
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
                  <span className="font-medium text-[#172033]">{d.department}</span>
                  <span className="text-[#64748B]">{d.count}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-[#2563EB] transition-all duration-700" style={{ width: `${(d.count / maxDept) * 100}%` }} />
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
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8]"
          >
            <PlusCircle className="h-4 w-4" />
            Create Document Request
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                <th className="py-3">Question</th>
                <th className="py-3">Frequency</th>
                <th className="py-3">Priority</th>
                <th className="py-3">Status</th>
                <th className="py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {gaps.map((g) => (
                <tr key={g.id} className="border-b border-slate-50 transition hover:bg-slate-50/50">
                  <td className="py-3.5 font-medium text-[#172033]">{g.question}</td>
                  <td className="py-3.5">
                    <span className="inline-flex min-w-9 items-center justify-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">{g.frequency}</span>
                  </td>
                  <td className="py-3.5">
                    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold uppercase ${priorityColors[g.priority]}`}>
                      {g.priority === 'high' && <AlertTriangle className="h-3 w-3" />}
                      {g.priority}
                    </span>
                  </td>
                  <td className="py-3.5">{statusBadge[g.status]}</td>
                  <td className="py-3.5 text-right">
                    <button onClick={() => toast('info', 'Request logged for: ' + g.question)} className="text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8]">
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
    </div>
  )
}
