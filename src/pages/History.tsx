import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { History as HistoryIcon, CheckCircle2, XCircle, Search as SearchIcon, MinusCircle, ArrowUpRight, Trash2, RotateCcw } from 'lucide-react'
import { getSearchHistory, clearSearchHistory } from '../services/api'
import type { SearchHistoryItem } from '../types'
import { SkeletonLoader } from '../components/common/SkeletonLoader'
import { EmptyState } from '../components/common/EmptyState'

function formatDate(ts: string) {
  if (!ts) return '—'
  if (ts.startsWith('Today') || ts.startsWith('Yesterday') || ts.includes('ago') || ts.includes('Just now')) {
    return ts
  }
  try {
    const d = new Date(ts)
    if (isNaN(d.getTime())) return ts
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return ts
  }
}

export default function History() {
  const [items, setItems] = useState<SearchHistoryItem[]>([])
  const [filterQuery, setFilterQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [clearing, setClearing] = useState(false)
  const navigate = useNavigate()

  const loadHistory = () => {
    setLoading(true)
    getSearchHistory()
      .then((h) => {
        setItems(h || [])
      })
      .catch(() => {
        setItems([])
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    loadHistory()
  }, [])

  const handleClear = async () => {
    if (!window.confirm('Are you sure you want to clear your search history?')) return
    setClearing(true)
    try {
      await clearSearchHistory()
      setItems([])
    } finally {
      setClearing(false)
    }
  }

  const filteredItems = items.filter((item) =>
    item.query.toLowerCase().includes(filterQuery.toLowerCase())
  )

  const statusBadge = (s: SearchHistoryItem['status']) => {
    if (s === 'verified') return <span className="badge-green">Verified</span>
    if (s === 'partial') return <span className="badge-amber">Partial</span>
    return <span className="badge-red">No answer</span>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title text-2xl font-bold">Search History</h1>
          <p className="page-subtitle">Recent AI knowledge queries across your organization.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={loadHistory}
            disabled={loading}
            className="btn-secondary inline-flex items-center gap-1.5 text-xs py-2 px-3"
            title="Refresh history"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          {items.length > 0 && (
            <button
              onClick={handleClear}
              disabled={clearing}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition"
              title="Clear search history"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{clearing ? 'Clearing...' : 'Clear History'}</span>
            </button>
          )}
        </div>
      </div>

      {items.length > 0 && (
        <div className="relative">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter past queries..."
            className="input-field pl-10 text-sm w-full max-w-md"
          />
        </div>
      )}

      {loading ? (
        <SkeletonLoader variant="library" />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title={items.length === 0 ? "No searches yet" : "No matching queries"}
          description={items.length === 0 ? "Your recent AI knowledge queries will appear here." : "Try adjusting your filter text."}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line-soft bg-surface-muted text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3.5">Question</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Documents Used</th>
                <th className="px-4 py-3.5">Confidence</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((h, i) => (
                <tr
                  key={h.id}
                  onClick={() => navigate(`/search?conversation=${h.id}`)}
                  className={`group cursor-pointer border-b border-line-soft transition hover:bg-brand-blue/5 ${i === filteredItems.length - 1 ? 'border-b-0' : ''}`}
                >
                  <td className="px-5 py-4 font-medium text-ink">{h.query}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-muted">{formatDate(h.timestamp)}</td>
                  <td className="px-4 py-4 text-muted">
                    {h.sourcesCount > 0 ? (
                      <span className="font-medium text-ink">{h.sourcesCount} sources</span>
                    ) : (
                      <span className="text-faint">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {h.status === 'verified' ? (
                      <span className="inline-flex items-center gap-1.5 font-semibold text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4" /> {h.confidence}%
                      </span>
                    ) : h.status === 'partial' ? (
                      <span className="inline-flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400">
                        <MinusCircle className="h-4 w-4" /> {h.confidence}%
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 font-medium text-red-500 dark:text-red-400">
                        <XCircle className="h-4 w-4" /> No relevant answer
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">{statusBadge(h.status)}</td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/search?conversation=${h.id}`) }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-brand-blue transition hover:bg-brand-blue/10 hover:border-brand-blue/30"
                    >
                      Continue conversation
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="card flex items-center gap-3 p-5">
        <SearchIcon className="h-5 w-5 text-muted" />
        <p className="text-sm text-muted">
          Want to ask a new question?{' '}
          <Link to="/search" className="font-medium text-brand-blue hover:text-brand-blue">Go to AI Knowledge Search</Link>
        </p>
      </div>
    </div>
  )
}
