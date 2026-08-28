import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { MessagesSquare, CheckCircle2, XCircle, Timer, Sparkles } from 'lucide-react'
import { getAnalytics } from '../services/api'
import type { AnalyticsData } from '../types'
import { StatCard } from '../components/dashboard/StatCard'
import { ChartCard } from '../components/analytics/ChartCard'
import { SkeletonLoader } from '../components/common/SkeletonLoader'
import { useAuth } from '../context/AuthContext'
import { ErrorState } from '../components/common/ErrorState'

function QualityGauge({ value, label }: { value: number; label: string }) {
  const color = value >= 90 ? '#16A34A' : value >= 80 ? '#2563EB' : '#F59E0B'
  return (
    <div className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50/50 p-4">
      <div className="relative h-24 w-24">
        <svg width={96} height={96} className="-rotate-90">
          <circle cx={48} cy={48} r={38} fill="none" stroke="#E2E8F0" strokeWidth={9} />
          <circle
            cx={48} cy={48} r={38} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 38} strokeDashoffset={2 * Math.PI * 38 * (1 - value / 100)}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-[#172033]">{value}%</span>
        </div>
      </div>
      <p className="mt-2 text-center text-xs font-medium text-[#64748B]">{label}</p>
    </div>
  )
}

export default function Analytics() {
  const { user } = useAuth()
  const isManager = user?.role === 'manager' || user?.role === 'admin'
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnalytics().then((d) => {
      setData(d)
      setLoading(false)
    })
  }, [])

  if (!isManager) {
    return (
      <div className="space-y-6">
        <h1 className="page-title text-2xl font-bold">Analytics</h1>
        <ErrorState
          variant="unauthorized"
          title="Access Restricted"
          message="Analytics are available to managers and administrators only."
        >
          <div className="mx-auto max-w-xs space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Your role</span>
              <span className="font-semibold capitalize text-[#172033]">{user?.role ?? 'employee'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Required role</span>
              <span className="font-semibold text-[#172033]">Manager / Admin</span>
            </div>
          </div>
        </ErrorState>
      </div>
    )
  }

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <h1 className="page-title text-2xl font-bold">Analytics</h1>
        <SkeletonLoader variant="analytics" />
      </div>
    )
  }

  const trend = data.queryTrend.map((q) => ({ date: q.date, queries: q.queries, answered: q.successful }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title text-2xl font-bold">Analytics Dashboard</h1>
        <p className="page-subtitle">Query performance and AI answer quality metrics.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={MessagesSquare} label="Total Queries" value={data.totalQueries.toLocaleString()} delta="This period" />
        <StatCard icon={CheckCircle2} label="Successful Answers" value={data.successfulAnswers.toLocaleString()} delta="95% success rate" iconClass="bg-green-50 text-green-600" />
        <StatCard icon={XCircle} label="Failed Queries" value={data.failedQueries.toLocaleString()} delta="Tracked as gaps" positive={false} iconClass="bg-red-50 text-red-500" />
        <StatCard icon={Timer} label="Avg Response Time" value={`${data.avgResponseTime} sec`} delta="Fast" iconClass="bg-amber-50 text-amber-500" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard title="Query Volume" subtitle="Total vs successful answers" >
          <div className="h-72 lg:col-span-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="queries" name="Total Queries" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="answered" name="Answered" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Answer Quality" subtitle="AI performance metrics">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <QualityGauge value={data.faithfulnessScore} label="Faithfulness" />
            <QualityGauge value={data.contextRelevance} label="Context Relevance" />
            <QualityGauge value={data.answerConfidence} label="Answer Confidence" />
            <QualityGauge value={data.retrievalPrecision} label="Retrieval Precision" />
          </div>
        </ChartCard>
      </div>

      <div className="card p-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-[#172033]">Overall Answer Faithfulness</h2>
            <p className="mt-1 text-sm text-[#64748B]">Proportion of answers fully supported by retrieved evidence</p>
          </div>
          <div className="relative h-32 w-32">
            <svg width={128} height={128} className="-rotate-90">
              <circle cx={64} cy={64} r={54} fill="none" stroke="#E2E8F0" strokeWidth={12} />
              <circle
                cx={64} cy={64} r={54} fill="none" stroke="#16A34A" strokeWidth={12} strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 54} strokeDashoffset={2 * Math.PI * 54 * (1 - data.faithfulnessScore / 100)}
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[#172033]">{data.faithfulnessScore}%</span>
              <span className="text-[10px] text-[#64748B]">faithful</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 border-t border-slate-100 pt-4 text-sm text-[#64748B]">
          <Sparkles className="h-4 w-4 text-[#2563EB]" />
          Every answer includes source verification and document evidence.
        </div>
      </div>
    </div>
  )
}
