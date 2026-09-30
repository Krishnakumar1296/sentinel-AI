import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Upload, FileX2, Plus, ShieldCheck } from 'lucide-react'
import { getDocuments } from '../services/api'
import type { Document } from '../types'
import { DocumentTable } from '../components/documents/DocumentTable'
import { EmptyState } from '../components/common/EmptyState'
import { SkeletonLoader } from '../components/common/SkeletonLoader'
import { useAuth } from '../context/AuthContext'
import { ErrorState } from '../components/common/ErrorState'
import { CyberCard3D } from '../components/common/CyberCard3D'
import { FadeUp } from '../components/animations/FadeUp'
import { DURATION, EASING } from '../components/animations/motion-tokens'
import { RippleButton } from '../components/animate/RippleButton'

export default function Documents() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dept, setDept] = useState('all')
  const [access, setAccess] = useState('all')

  const scope = searchParams.get('scope')
  const isManager = user?.role === 'manager' || user?.role === 'admin'
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    getDocuments().then((d) => {
      setDocs(d)
      setLoading(false)
    })
  }, [])

  if (!isManager) {
    return (
      <div className="space-y-6">
        <h1 className="page-title text-2xl font-bold">Document Library</h1>
        <ErrorState
          variant="unauthorized"
          title="Access Restricted"
          message="The document library is not available to your role. You can still ask questions through AI Knowledge Search."
        >
          <button onClick={() => navigate('/search')} className="btn-primary">Go to AI Search</button>
        </ErrorState>
      </div>
    )
  }

  const filtered = docs.filter((d) => {
    if (scope === 'mine' && d.uploadedBy !== user?.name) return false
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false
    if (dept !== 'all' && d.department !== dept) return false
    if (access === 'restricted' && d.access === 'employee') return false
    if (access === 'authorized' && d.access !== 'employee') return false
    return true
  })

  const departments = Array.from(new Set(docs.map((d) => d.department)))

  return (
    <div className="space-y-6">
      <FadeUp delay={0.05} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#212121] px-3 py-1 text-xs font-medium text-slate-600 dark:text-[#8e8e8e] mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-[#10a37f]" />
            <span>Encrypted Repository</span>
          </div>
          <h1 className="page-title font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-[#ececec]">
            Document Repository
          </h1>
          <p className="page-subtitle text-xs sm:text-sm text-slate-500 dark:text-[#8e8e8e]">
            Manage and explore authorized enterprise knowledge with automatic vector chunking.
          </p>
        </div>
        {isManager && (
          <RippleButton
            onClick={() => navigate('/upload')}
            className="btn-primary"
          >
            <Upload className="h-4 w-4" />
            Upload Document
          </RippleButton>
        )}
      </FadeUp>

      <FadeUp delay={0.1}>
        <CyberCard3D className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-[#8e8e8e]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter repository documents by keyword..."
                className="input pl-10 text-sm font-normal transition-all duration-200 focus:ring-2 focus:ring-[#10a37f]/20"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select value={dept} onChange={(e) => setDept(e.target.value)} className="input w-auto text-xs font-normal">
                <option value="all">All Departments</option>
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <select value={access} onChange={(e) => setAccess(e.target.value)} className="input w-auto text-xs font-normal">
                <option value="all">All Clearance Levels</option>
                <option value="authorized">Authorized Only</option>
                <option value="restricted">Restricted Clearance</option>
              </select>
            </div>
          </div>
        </CyberCard3D>
      </FadeUp>

      {loading ? (
        <SkeletonLoader variant="library" />
      ) : filtered.length > 0 ? (
        <FadeUp delay={0.15}>
          <DocumentTable documents={filtered} onEdit={isAdmin ? (d) => navigate(`/viewer?doc=${d.id}&edit=1`) : undefined} />
        </FadeUp>
      ) : (
        <EmptyState
          icon={FileX2}
          title="No documents found"
          description="There are no documents matching your filters."
          action={
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSearch('')
                setDept('all')
                setAccess('all')
              }}
              className="btn-secondary"
            >
              Clear Filters
            </motion.button>
          }
        />
      )}

      {isManager && (
        <FadeUp delay={0.2} className="flex items-center gap-3 rounded-2xl border border-dashed border-line bg-surface/60 p-5">
          <Plus className="h-5 w-5 text-faint" />
          <p className="text-sm text-muted">
            New knowledge missing?{' '}
            <button onClick={() => navigate('/upload')} className="font-medium text-brand-blue hover:text-brand-blue">
              Upload a document
            </button>{' '}
            to strengthen your knowledge base.
          </p>
        </FadeUp>
      )}

    </div>
  )
}

