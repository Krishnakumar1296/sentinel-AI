import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FilePlus2, CheckCircle2, Clock, MessageSquareDashed } from 'lucide-react'
import { getKnowledgeRequests, getDocuments, publishDocumentForRequest, type DocumentEdits } from '../services/api'
import type { Document, KnowledgeRequest } from '../types'
import { DocumentEditor } from '../components/documents/DocumentEditor'
import { EmptyState } from '../components/common/EmptyState'
import { SkeletonLoader } from '../components/common/SkeletonLoader'
import { ErrorState } from '../components/common/ErrorState'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/common/Toast'
import { FadeUp, HoverCard } from '../components/animations'
import { DURATION, EASING } from '../components/animations/motion-tokens'
import { RippleButton } from '../components/animate/RippleButton'

export default function KnowledgeRequests() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [requests, setRequests] = useState<KnowledgeRequest[]>([])
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<KnowledgeRequest | null>(null)

  const isManager = user?.role === 'manager' || user?.role === 'admin'

  useEffect(() => {
    if (!isManager) return
    Promise.all([getKnowledgeRequests(), getDocuments()]).then(([reqs, d]) => {
      setRequests(reqs)
      setDocs(d)
      setLoading(false)
    })
  }, [isManager])

  if (!isManager) {
    return (
      <FadeUp className="space-y-6">
        <h1 className="page-title text-2xl font-bold">Knowledge Requests</h1>
        <ErrorState
          variant="unauthorized"
          title="Access Restricted"
          message="Only administrators and managers can review knowledge requests."
        >
          <RippleButton
            onClick={() => navigate('/search')}
            className="btn-primary"
          >
            Go to AI Search
          </RippleButton>
        </ErrorState>
      </FadeUp>
    )
  }

  const pending = requests.filter((r) => r.status === 'pending')
  const resolved = requests.filter((r) => r.status === 'resolved')
  const departments = Array.from(new Set(docs.map((d) => d.department)))

  const handleSave = async (request: KnowledgeRequest, values: DocumentEdits) => {
    setSaving(true)
    const doc = await publishDocumentForRequest(request.id, values)
    setSaving(false)
    if (doc) {
      setEditing(null)
      const reqs = await getKnowledgeRequests()
      setRequests(reqs)
      setDocs(await getDocuments())
      toast('success', `"${doc.name}" published. The team has been notified.`)
    }
  }

  return (
    <FadeUp className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#212121] px-3 py-1 text-xs font-medium text-slate-600 dark:text-[#8e8e8e] mb-2">
          <span>Feedback Loop</span>
        </div>
        <h1 className="page-title font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-[#ececec]">
          Knowledge Requests
        </h1>
        <p className="page-subtitle text-xs sm:text-sm text-slate-500 dark:text-[#8e8e8e]">
          Questions the AI could not answer from the documents. Publish or update a PDF to close the organizational knowledge gap.
        </p>
      </div>

      {loading ? (
        <SkeletonLoader variant="library" />
      ) : pending.length === 0 ? (
        <EmptyState
          icon={MessageSquareDashed}
          title="No pending requests"
          description="When an employee asks something not found in the documents, the request appears here with a notification to you."
        />
      ) : (
        <div className="space-y-3">
          {pending.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: DURATION.FAST,
                delay: Math.min(i * 0.04, 0.3),
                ease: EASING.SMOOTH,
              }}
              className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between transition-shadow hover:shadow-card-md"
            >
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-ink">"{r.question}"</p>
                  <p className="mt-1 text-xs text-muted">
                    Not found in documents · Asked by <span className="font-medium text-ink">{r.askedBy}</span> · {r.timestamp}
                  </p>
                </div>
              </div>
              <RippleButton
                onClick={() => setEditing(r)}
                className="btn-primary shrink-0 self-start sm:self-auto shadow-sm"
              >
                <FilePlus2 className="h-4 w-4" />
                Add / Update PDF
              </RippleButton>
            </motion.div>
          ))}
        </div>
      )}

      {resolved.length > 0 && (
        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Resolved History</h2>
          <div className="space-y-2">
            {resolved.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: DURATION.FAST,
                  delay: Math.min(i * 0.03, 0.2),
                  ease: EASING.SMOOTH,
                }}
                className="card flex items-center gap-3 p-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">"{r.question}"</p>
                  <p className="text-xs text-muted">
                    Resolved by {r.askedBy} on {r.timestamp}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {editing && (
        <DocumentEditor
          mode="create"
          departments={departments}
          saving={saving}
          initial={{
            name: editing.question.length > 60 ? `${editing.question.slice(0, 60)}…` : editing.question,
            department: departments[0] ?? 'HR',
            pages: 1,
            description: `Answers the request: "${editing.question}"`,
            content: [
              editing.question,
              '',
              'This document provides the official policy in response to the team request above.',
              'Add the full policy details here. Each line can be edited directly on the PDF page.',
              '',
              '1. Scope',
              '2. Requirements',
              '3. Effective date',
            ].join('\n'),
          }}
          onSave={(values) => handleSave(editing, values)}
          onClose={() => setEditing(null)}
        />
      )}
    </FadeUp>
  )
}