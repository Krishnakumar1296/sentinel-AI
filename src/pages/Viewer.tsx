import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, ShieldCheck, BookOpen, Pencil, Save, X as XIcon, RefreshCw } from 'lucide-react'
import { getDocument, updateDocument } from '../services/api'
import type { Document } from '../types'
import { PDFViewer } from '../components/documents/PDFViewer'
import { FullPDFEditor } from '../components/documents/FullPDFEditor'
import { SkeletonLoader } from '../components/common/SkeletonLoader'
import { ErrorState } from '../components/common/ErrorState'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/common/Toast'

export default function Viewer() {
  const { user } = useAuth()
  const isManager = user?.role === 'manager' || user?.role === 'admin'
  const isAdmin = user?.role === 'admin'
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const docId = searchParams.get('doc') ?? 'd5'
  const citedPage = Math.max(1, Number(searchParams.get('page')) || 14)

  const [doc, setDoc] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(citedPage)
  const [content, setContent] = useState('')
  const [editMode, setEditMode] = useState(searchParams.get('edit') === '1')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setLoading(true)
    getDocument(docId).then((d) => {
      if (d) {
        setDoc(d)
        setPage(Math.min(citedPage, d.pages || 32))
        setContent(d.content ?? '')
      }
      setLoading(false)
    })
  }, [docId, citedPage])

  if (!isManager) {
    return (
      <div className="space-y-6">
        <h1 className="page-title text-2xl font-bold">Document Viewer</h1>
        <ErrorState
          variant="unauthorized"
          title="Viewing Not Authorized"
          message="Your role is restricted to viewing AI answers and source references only. Direct document content is not available to employee accounts."
        >
          <button onClick={() => navigate('/search')} className="btn-primary">Back to AI Search</button>
        </ErrorState>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="page-title text-2xl font-bold">Document Viewer</h1>
        <SkeletonLoader variant="evidence" />
      </div>
    )
  }

  if (!doc) {
    return (
      <div className="space-y-6">
        <h1 className="page-title text-2xl font-bold">Document Viewer</h1>
        <ErrorState title="Document not found" message="The requested document could not be located." />
      </div>
    )
  }

  const handleSave = async () => {
    setSaving(true)
    const updated = await updateDocument(doc.id, {
      name: doc.name,
      department: doc.department,
      description: doc.description ?? '',
      content,
    })
    setSaving(false)
    if (updated) {
      setDoc(updated)
      setEditMode(false)
      setPage(1)
      navigate(`/viewer?doc=${doc.id}`, { replace: true })
      toast('success', `"${updated.name}" updated and uploaded. The team has been notified.`)
    }
  }

  const enterEdit = () => {
    setContent(doc.content ?? '')
    setEditMode(true)
    navigate(`/viewer?doc=${doc.id}&edit=1`, { replace: true })
  }

  const exitEdit = () => {
    setEditMode(false)
    setContent(doc.content ?? '')
    navigate(`/viewer?doc=${doc.id}`, { replace: true })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="btn-secondary p-2">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="page-title text-2xl font-bold">{editMode ? 'Edit PDF' : 'Document Viewer'}</h1>
            <p className="flex items-center gap-1.5 text-sm text-muted">
              <FileText className="h-4 w-4 text-red-500 dark:text-red-400" /> {doc.name}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {editMode ? (
            <>
              <button onClick={exitEdit} className="btn-secondary">
                <XIcon className="h-4 w-4" /> Discard
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Uploading...' : 'Save & Upload'}
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 dark:border-green-500/20 dark:bg-green-500/10">
                <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-700 dark:text-green-400">Authorized for your role</span>
              </div>
              {isAdmin && !editMode && (
                <button onClick={enterEdit} className="btn-primary">
                  <Pencil className="h-4 w-4" /> Edit PDF
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {editMode && (
        <div className="flex items-start gap-3 rounded-xl border border-brand-blue/30 bg-brand-blue/5 px-4 py-3 text-sm text-brand-blue">
          <RefreshCw className="mt-0.5 h-4 w-4 shrink-0" />
          You're editing the actual PDF document. Click any text directly on the page to update it, then hit Save & Upload to publish to the team.
        </div>
      )}

      {!editMode && searchParams.get('page') && docId !== 'd5' && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
          <BookOpen className="h-4 w-4" />
          Navigated to cited page {citedPage} — highlighted evidence from the AI answer.
        </div>
      )}

      {editMode ? (
        <FullPDFEditor
          value={content}
          documentName={doc.name}
          pages={doc.pages || 1}
          initialPage={Math.min(page, Math.max(1, doc.pages || 32))}
          onChange={setContent}
        />
      ) : (
        <PDFViewer
          document={doc.name}
          currentPage={page}
          totalPages={doc.pages || 32}
          highlightPage={citedPage}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}