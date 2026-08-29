import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FilePlus2, CheckCircle2, Clock, MessageSquareDashed } from 'lucide-react'
import { getKnowledgeRequests, getDocuments, publishDocumentForRequest, type DocumentEdits } from '../services/api'
import type { Document, KnowledgeRequest } from '../types'
import { DocumentEditor } from '../components/documents/DocumentEditor'
import { EmptyState } from '../components/common/EmptyState'
import { SkeletonLoader } from '../components/common/SkeletonLoader'
import { ErrorState } from '../components/common/ErrorState'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/common/Toast'

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
      <div className="space-y-6">
        <h1 className="page-title text-2xl font-bold">Knowledge Requests</h1>
        <ErrorState
          variant="unauthorized"
          title="Access Restricted"
          message="Only administrators and managers can review knowledge requests."
        >
          <button onClick={() => navigate('/search')} className="btn-primary">Go to AI Search</button>
        </ErrorState>
      </div>
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
    <div className="space-y-6">
      <div>
        <h1 className="page-title text-2xl font-bold">Knowledge Requests</h1>
        <p className="page-subtitle">
          Questions the AI could not answer from the documents. Publish or update a PDF to close the gap.
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
          {pending.map((r) => (
            <div key={r.id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-ink">"{r.question}"</p>
                  <p className="mt-0.5 text-xs text-muted">
                    Not found in documents · Asked by {r.askedBy} · {r.timestamp}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditing(r)}
                className="btn-primary shrink-0"
              >
                <FilePlus2 className="h-4 w-4" />
                Add / Update PDF
              </button>
            </div>
          ))}
        </div>
      )}

      {resolved.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Resolved</h2>
          <div className="space-y-2">
            {resolved.map((r) => (
              <div key={r.id} className="card flex items-center gap-3 p-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">"{r.question}"</p>
                  <p className="text-xs text-muted">
                    Resolved by {r.askedBy} on {r.timestamp}
                  </p>
                </div>
              </div>
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
    </div>
  )
}