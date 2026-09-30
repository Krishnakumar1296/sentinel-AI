import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search as SearchIcon, Sparkles, ShieldCheck, BookOpen, History as HistoryIcon, MessageSquarePlus, ArrowUp } from 'lucide-react'
import { searchKnowledge, getActiveChat, openChat, startNewChat, continueConversation } from '../services/api'
import type { ChatSession, ChatMessage } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { AuthorizedSearchNotice } from '../components/search/AIAnswerCard'
import { SourceCard } from '../components/search/SourceCard'
import { SourcePagePreview } from '../components/search/SourcePagePreview'
import { EvidenceViewer } from '../components/search/EvidenceViewer'
import { EmptyState } from '../components/common/EmptyState'
import { SkeletonLoader } from '../components/common/SkeletonLoader'
import { CyberCard3D } from '../components/common/CyberCard3D'
import { RippleButton } from '../components/animate/RippleButton'
import { FadeUp } from '../components/animations/FadeUp'
import { DURATION, EASING } from '../components/animations/motion-tokens'

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

  const [query, setQuery] = useState('')
  const [chat, setChat] = useState<ChatSession | null>(null)
  const [loading, setLoading] = useState(false)
  const [isPastConversation, setIsPastConversation] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [selectedByTurn, setSelectedByTurn] = useState<Record<string, number>>({})

  const messages = chat?.messages ?? []

  const runSearch = async (q: string) => {
    if (!q.trim() || loading) return
    setLoading(true)
    try {
      const res = await searchKnowledge(q)
      const updated = await getActiveChat()
      setChat(updated)
      setSelectedByTurn((prev) => ({ ...prev, [res.id]: 0 }))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const newParam = searchParams.get('new')
    const cid = searchParams.get('conversation')
    const chatParam = searchParams.get('chat')
    const initial = searchParams.get('q')

    if (newParam) {
      setLoading(true)
      startNewChat().then((c) => {
        setChat(c)
        setIsPastConversation(false)
        setConversationId(null)
        setLoading(false)
        navigate('/search', { replace: true })
      })
      return
    }

    if (chatParam) {
      setLoading(true)
      openChat(chatParam).then((c) => {
        setLoading(false)
        if (c) {
          setChat(c)
          setIsPastConversation(false)
          setConversationId(null)
        }
      })
      return
    }

    if (cid) {
      setLoading(true)
      continueConversation(cid).then((c) => {
        setLoading(false)
        if (c) {
          setChat(c)
          setIsPastConversation(true)
          setConversationId(cid)
        }
      })
      return
    }

    if (initial) {
      setQuery('')
      runSearch(initial)
      return
    }

    setLoading(true)
    getActiveChat().then((c) => {
      setChat(c)
      setIsPastConversation(false)
      setConversationId(null)
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    runSearch(query)
    setQuery('')
  }

  const hasMessages = messages.length > 0
  const isAssistantEmpty = (m: ChatMessage) =>
    m.result?.status === 'no_answer' || (m.result?.sources.length ?? 0) === 0

  const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant')
  const lastSourceIdx = lastAssistant?.result ? (selectedByTurn[lastAssistant.result.id] ?? 0) : 0
  const lastSelectedDoc = lastAssistant?.result?.sources[lastSourceIdx]?.documentName
  const lastResult = lastAssistant?.result

  const chatTitle = chat && chat.title !== 'New Chat' ? chat.title : 'AI Knowledge Search'

  return (
    <div className="space-y-4">
      <FadeUp delay={0.05}>
        <div>
          <h1 className="page-title text-2xl font-bold">{chatTitle}</h1>
          {isPastConversation && conversationId ? (
            <p className="flex items-center gap-2 text-sm text-muted">
              <HistoryIcon className="h-4 w-4 shrink-0 text-brand-blue" />
              Conversation continued from your search history
            </p>
          ) : (
            <p className="page-subtitle">Ask questions about your organization's authorized knowledge.</p>
          )}
        </div>
      </FadeUp>

      <AuthorizedSearchNotice
        role={user?.role ?? 'employee'}
        scope={user?.role === 'admin' ? 'All collections' : '12 document collections'}
      />

      {!hasMessages && !loading && (
        <FadeUp delay={0.1}>
          <CyberCard3D showBorderBeam={true} glowColor="emerald" className="p-6 lg:p-8">
            <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-slate-500 dark:text-[#8E8E8E]">
              <Sparkles className="h-4 w-4 text-[#10a37f]" />
              <span>Verified Knowledge Assistant</span>
            </div>
            <form onSubmit={submit} className="relative flex items-center">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask Sentinel AI anything about authorized company knowledge..."
                className="w-full rounded-2xl border border-slate-200 dark:border-white/[0.12] bg-slate-50 dark:bg-[#2F2F2F] py-4 pl-5 pr-14 text-sm text-slate-900 dark:text-[#ECECEC] placeholder:text-slate-400 dark:placeholder:text-[#8E8E8E] outline-none transition-all focus:border-[#10a37f] focus:ring-2 focus:ring-[#10a37f]/20 shadow-inner"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading || !query.trim()}
                className="absolute right-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-neutral-900 font-bold transition-opacity disabled:opacity-30 shadow-sm"
                title="Send query"
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-400 border-t-neutral-900" />
                ) : (
                  <ArrowUp className="h-4 w-4 stroke-[2.5]" />
                )}
              </motion.button>
            </form>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#8E8E8E]">Suggested inquiries</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <motion.button
                    key={s}
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: DURATION.FAST, ease: EASING.SMOOTH }}
                    onClick={() => {
                      setQuery(s)
                      runSearch(s)
                    }}
                    className="rounded-full border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#212121] px-4 py-2 text-xs font-medium text-slate-600 dark:text-[#8E8E8E] hover:border-slate-300 dark:hover:border-white/[0.16] hover:bg-slate-100 dark:hover:bg-[#2f2f2f] hover:text-slate-900 dark:hover:text-[#ececec] transition-colors"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>
          </CyberCard3D>
        </FadeUp>
      )}

      {loading && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 gap-4 lg:grid-cols-5"
        >
          <div className="space-y-4 lg:col-span-3">
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#262626] p-5 shadow-xs">
              <div className="flex items-center gap-2.5 mb-3 border-b border-slate-100 dark:border-white/[0.08] pb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#10a37f] text-xs font-bold text-white shadow-xs">S</div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-[#ECECEC]">Sentinel Assistant</p>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-[#8E8E8E]">Searching Vault</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-[#8E8E8E] py-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#10a37f] animate-pulse" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#10a37f] animate-pulse [animation-delay:200ms]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#10a37f] animate-pulse [animation-delay:400ms]" />
                </div>
                <span className="font-mono text-xs font-semibold text-[#10a37f]">Thinking...</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <SkeletonLoader variant="evidence" />
          </div>
        </motion.div>
      )}

      {!loading && (
        <AnimatePresence mode="popLayout">
          {messages.map((m, idx) => {
            if (m.role === 'user') {
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: DURATION.NORMAL, ease: EASING.SMOOTH }}
                  className="flex justify-end"
                >
                  <div className="max-w-xl rounded-2xl rounded-br-xs bg-[#2F2F2F] border border-white/[0.08] px-5 py-3.5 text-sm leading-relaxed text-[#ECECEC] shadow-xs">
                    {m.content}
                    <p className="mt-1 text-[10px] text-[#8E8E8E] text-right">{m.timestamp}</p>
                  </div>
                </motion.div>
              )
            }

            if (isAssistantEmpty(m)) {
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: DURATION.NORMAL, ease: EASING.SMOOTH }}
                  className="card flex flex-col items-center px-6 py-10 text-center"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400">
                    <BookOpen className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-[#ECECEC]">No Verified Answer Found</h3>
                  <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-[#8E8E8E]">
                    Sentinel AI could not find sufficient evidence in your authorized company documents.
                  </p>
                  <p className="mt-3 rounded-lg bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                    Your request has been sent to the admin, who will publish the missing information. You'll be notified once it's updated.
                  </p>
                </motion.div>
              )
            }

            const isLast = idx === messages.length - 1

            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.NORMAL, ease: EASING.SMOOTH }}
                className="grid grid-cols-1 gap-4 lg:grid-cols-5"
              >
                <div className={`space-y-4 ${isLast ? 'lg:col-span-3' : 'lg:col-span-5'}`}>
                  <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#262626] shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.08] px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#10a37f] text-xs font-bold text-white shadow-xs">S</div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-[#ECECEC]">Sentinel Assistant</p>
                          <p className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-[#8E8E8E]">{m.timestamp}</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                        <ShieldCheck className="h-3 w-3" />
                        Verified
                      </span>
                    </div>

                    <div className="px-5 py-4">
                      <p className="text-[15px] leading-relaxed text-slate-900 dark:text-[#ECECEC] whitespace-pre-line">{m.result!.answer}</p>
                      <p className="mt-3 text-xs text-slate-400 dark:text-[#8E8E8E]">[Grounded AI Response]</p>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 dark:border-white/[0.08] pt-4">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="flex h-4 w-4 items-center justify-center">
                            <svg className="h-4 w-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span className="font-medium text-slate-500 dark:text-[#8E8E8E]">Confidence Score</span>
                          <span className="font-semibold text-slate-900 dark:text-[#ECECEC]">{m.result!.confidence}%</span>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-[#8E8E8E]">Answer grounded in authorized documents</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                        Sources ({m.result!.sources.length})
                      </h3>
                      <span className="hidden items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 sm:flex">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Verified against cited PDF pages
                      </span>
                    </div>

                    <div className="space-y-3">
                      {m.result!.sources.map((s, si) => (
                        <SourceCard
                          key={s.id}
                          citation={si + 1}
                          title={s.documentName}
                          page={s.page}
                          relevance={s.relevance}
                          selected={(selectedByTurn[m.result!.id] ?? 0) === si}
                          onSelect={() => setSelectedByTurn((prev) => ({ ...prev, [m.result!.id]: si }))}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {isLast && lastResult && (
                  <div className="lg:col-span-2">
                    <div className="lg:sticky lg:top-24">
                      <EvidenceViewer
                        document={lastSelectedDoc ?? lastResult.sources[lastSourceIdx].documentName}
                        page={lastResult.sources[lastSourceIdx].page}
                        totalPages={lastResult.sources[lastSourceIdx].totalPages}
                        onViewFull={() =>
                          navigate(`/viewer?doc=${lastResult.sources[lastSourceIdx].documentId}&page=${lastResult.sources[lastSourceIdx].page}`)
                        }
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      )}

      {hasMessages && !loading && (
        <div className="sticky bottom-0 z-10 -mx-4 border-t border-slate-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#212121]/95 px-4 py-4 backdrop-blur-md lg:-mx-8 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <form onSubmit={submit} className="relative flex items-center shadow-xl">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a follow-up question..."
                className="w-full rounded-2xl border border-slate-200 dark:border-white/[0.14] bg-white dark:bg-[#2F2F2F] py-3.5 pl-5 pr-14 text-sm text-slate-900 dark:text-[#ECECEC] placeholder:text-slate-400 dark:placeholder:text-[#8E8E8E] outline-none transition-all focus:border-[#10a37f] focus:ring-2 focus:ring-[#10a37f]/20 shadow-md"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading || !query.trim()}
                className="absolute right-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-neutral-900 font-bold transition-opacity disabled:opacity-30 shadow-sm"
                title="Send follow-up"
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-400 border-t-neutral-900" />
                ) : (
                  <ArrowUp className="h-4 w-4 stroke-[2.5]" />
                )}
              </motion.button>
            </form>
          </div>
        </div>
      )}

      {!hasMessages && !loading && (
        <EmptyState
          icon={SearchIcon}
          title="Ask Sentinel AI"
          description="Search your authorized enterprise knowledge to get started. Every answer is backed by verifiable document evidence."
        />
      )}
    </div>
  )
}