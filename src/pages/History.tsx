import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { History as HistoryIcon, CheckCircle2, XCircle, Search as SearchIcon, MinusCircle } from 'lucide-react'
import { getSearchHistory } from '../services/api'
import type { SearchHistoryItem } from '../types'
import { SkeletonLoader } from '../components/common/SkeletonLoader'
import { EmptyState } from '../components/common/EmptyState'

export default function History() {
  const [items, setItems] = useState<SearchHistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSearchHistory().then((h) => {
      setItems(h)
      setLoading(false)
    })
  }, [])

  const statusBadge = (s: SearchHistoryItem['status']) => {
    if (s === 'verified') return <span className="badge-green">Verified</span>
    if (s === 'partial') return <span className="badge-amber">Partial</span>
    return <span className="badge-red">No answer</span>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title text-2xl font-bold">Search History</h1>
        <p className="page-subtitle">Recent AI knowledge queries across your organization.</p>
      </div>

      {loading ? (
        <SkeletonLoader variant="library" />
      ) : items.length === 0 ? (
        <EmptyState icon={HistoryIcon} title="No searches yet" description="Your recent AI knowledge queries will appear here." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-[#F7F9FC] text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                <th className="px-5 py-3.5">Question</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Documents Used</th>
                <th className="px-4 py-3.5">Confidence</th>
                <th className="px-4 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((h, i) => (
                <tr key={h.id} className={`border-b border-slate-50 transition hover:bg-slate-50/50 ${i === items.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="px-5 py-4 font-medium text-[#172033]">{h.query}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-[#64748B]">{h.timestamp}</td>
                  <td className="px-4 py-4 text-[#64748B]">
                    {h.sourcesCount > 0 ? (
                      <span className="font-medium text-[#172033]">{h.sourcesCount} sources</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {h.status === 'verified' ? (
                      <span className="inline-flex items-center gap-1.5 font-semibold text-green-600">
                        <CheckCircle2 className="h-4 w-4" /> {h.confidence}%
                      </span>
                    ) : h.status === 'partial' ? (
                      <span className="inline-flex items-center gap-1.5 font-medium text-amber-600">
                        <MinusCircle className="h-4 w-4" /> {h.confidence}%
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 font-medium text-red-500">
                        <XCircle className="h-4 w-4" /> No relevant answer
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">{statusBadge(h.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="card flex items-center gap-3 p-5">
        <SearchIcon className="h-5 w-5 text-[#64748B]" />
        <p className="text-sm text-[#64748B]">
          Want to ask a new question?{' '}
          <Link to="/search" className="font-medium text-[#2563EB] hover:text-[#1D4ED8]">Go to AI Knowledge Search</Link>
        </p>
      </div>
    </div>
  )
}
