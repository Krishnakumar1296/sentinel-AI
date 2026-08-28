import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, Sparkles, ShieldCheck, BookOpen } from 'lucide-react'
import { searchKnowledge } from '../services/api'
import type { SearchResult } from '../types'
import { useAuth } from '../context/AuthContext'
import { AuthorizedSearchNotice, ProcessingStages } from '../components/search/AIAnswerCard'
import { SourceCard } from '../components/search/SourceCard'
import { EvidenceViewer } from '../components/search/EvidenceViewer'
import { EmptyState } from '../components/common/EmptyState'
import { SkeletonLoader } from '../components/common/SkeletonLoader'

const suggestions = [
  'What is the remote work policy?',
  'Explain our data security policy',
  'What are the onboarding requirements?',
  'What is the leave policy?',
]

export default function Search() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const isManager = user?.role === 'manager' || user?.role === 'admin'

  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [result, setResult] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedSource, setSelectedSource] = useState(0)

  const runSearch = async (q: string) => {
    if (!q.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await searchKnowledge(q)
      setResult(res)
      setSelectedSource(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const initial = searchParams.get('q')
    if (initial) runSearch(initial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    runSearch(query)
  }

  const hasSubmitted = loading || !!result
  const noAnswer = result && (result.status === 'no_answer' || result.sources.length === 0)

  const selectedDoc = result?.sources[selectedSource]?.documentName

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title text-2xl font-bold">AI Knowledge Search</h1>
        <p className="page-subtitle">Ask questions about your organization's authorized knowledge.</p>
      </div>

      <AuthorizedSearchNotice
        role={user?.role ?? 'employee'}
        scope={user?.role === 'admin' ? 'All collections' : '12 document collections'}
      />

      <div className={`card transition-all ${!hasSubmitted ? 'p-6 lg:p-8' : 'p-4'}`}>
        <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What would you like to know?"
              className="input py-3.5 pl-12"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="btn-primary justify-center px-5 py-3.5 disabled:opacity-60"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Ask Sentinel
          </button>
        </form>

        {!hasSubmitted && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Suggested queries</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setQuery(s)
                    runSearch(s)
                  }}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 transition hover:border-slate-300 hover:bg-white hover:text-[#123B5D]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-3">
            <ProcessingStages />
          </div>
          <div className="lg:col-span-2">
            <SkeletonLoader variant="evidence" />
          </div>
        </div>
      )}

      {noAnswer && !loading && result && (
        <div className="card flex flex-col items-center px-6 py-14 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
            <BookOpen className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-semibold text-[#172033]">No Verified Answer Found</h3>
          <p className="mt-1 max-w-md text-sm text-[#64748B]">
            Sentinel AI could not find sufficient evidence in your authorized company documents.
          </p>
          <p className="mt-4 rounded-lg bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700">
            This query has been logged as a potential knowledge gap.
          </p>
          <button
            onClick={() => setResult(null)}
            className="btn-secondary mt-6"
          >
            Submit Knowledge Request
          </button>
        </div>
      )}

      {result && !noAnswer && !loading && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className={`space-y-6 ${isManager ? 'lg:col-span-3' : 'lg:col-span-5'}`}>
            <div className="card p-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">S</div>
                <div>
                  <p className="text-sm font-bold text-[#123B5D]">SENTINEL AI</p>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Answer</p>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2">
                <p className="text-sm font-semibold text-[#64748B]">Q.</p>
                <p className="text-sm font-semibold text-[#172033]">{result.query}</p>
              </div>

              <p className="mt-4 text-[15px] leading-relaxed text-slate-700 whitespace-pre-line">{result.answer}</p>
              <p className="mt-3 text-xs text-slate-400">[AI-generated answer]</p>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
                <div className="flex items-center gap-2 text-sm">
                  <span className="flex h-4 w-4 items-center justify-center">
                    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="font-medium text-[#64748B]">Confidence</span>
                  <span className="font-bold text-[#172033]">{result.confidence}%</span>
                </div>
                <p className="text-xs text-[#64748B]">Answer verified against authorized documents</p>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-[#172033]">
                Sources: {result.sources.length} documents
              </h3>

              {isManager ? (
                <div className="space-y-3">
                  {result.sources.map((s, idx) => (
                    <SourceCard
                      key={s.id}
                      citation={idx + 1}
                      title={s.documentName}
                      page={s.page}
                      relevance={s.relevance}
                      selected={selectedSource === idx}
                      onSelect={() => setSelectedSource(idx)}
                    />
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-slate-100 rounded-2xl border border-[#E2E8F0] bg-white shadow-card">
                  {result.sources.map((s, idx) => (
                    <div key={s.id} className="flex items-center gap-3 px-5 py-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[#172033]">{s.documentName}</p>
                        <p className="text-xs text-[#64748B]">Page {s.page} · Relevance {s.relevance}%</p>
                      </div>
                      <span className="shrink-0 text-xs font-medium text-[#64748B]">
                        Viewing not authorized
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 border-t border-slate-100 bg-[#F7F9FC] px-5 py-3 text-xs text-[#64748B]">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    Source contents are restricted. Ask another question to explore.
                  </div>
                </div>
              )}
            </div>
          </div>

          {isManager && (
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-24">
                {selectedDoc && (
                  <EvidenceViewer
                    document={selectedDoc}
                    page={result.sources[selectedSource].page}
                    totalPages={result.sources[selectedSource].totalPages}
                    onViewFull={() =>
                      navigate(`/viewer?doc=${result.sources[selectedSource].documentId}&page=${result.sources[selectedSource].page}`)
                    }
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {!hasSubmitted && (
        <EmptyState
          icon={SearchIcon}
          title="Ask Sentinel AI"
          description="Search your authorized enterprise knowledge to get started. Every answer is backed by verifiable document evidence."
        />
      )}
    </div>
  )
}
