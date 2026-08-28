import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, ShieldCheck, BookOpen } from 'lucide-react'
import { getDocument } from '../services/api'
import type { Document } from '../types'
import { PDFViewer } from '../components/documents/PDFViewer'
import { SkeletonLoader } from '../components/common/SkeletonLoader'
import { ErrorState } from '../components/common/ErrorState'
import { useAuth } from '../context/AuthContext'

export default function Viewer() {
  const { user } = useAuth()
  const isManager = user?.role === 'manager' || user?.role === 'admin'
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const docId = searchParams.get('doc') ?? 'd5'
  const citedPage = Number(searchParams.get('page')) || 14

  const [doc, setDoc] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(citedPage)

  useEffect(() => {
    setLoading(true)
    getDocument(docId).then((d) => {
      if (d) {
        setDoc(d)
        setPage(Math.min(citedPage, d.pages || 32))
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="btn-secondary p-2">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="page-title text-2xl font-bold">Document Viewer</h1>
            <p className="flex items-center gap-1.5 text-sm text-muted">
              <FileText className="h-4 w-4 text-red-500 dark:text-red-400" /> {doc.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 dark:border-green-500/20 dark:bg-green-500/10">
          <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="text-xs font-medium text-green-700 dark:text-green-400">Authorized for your role</span>
        </div>
      </div>

      {searchParams.get('page') && docId !== 'd5' && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
          <BookOpen className="h-4 w-4" />
          Navigated to cited page {citedPage} — highlighted evidence from the AI answer.
        </div>
      )}

      <PDFViewer
        document={doc.name}
        currentPage={page}
        totalPages={doc.pages || 32}
        highlightPage={citedPage}
        onPageChange={setPage}
      />
    </div>
  )
}
