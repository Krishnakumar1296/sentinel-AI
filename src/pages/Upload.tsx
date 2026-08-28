import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UploadCloud, CheckCircle2 } from 'lucide-react'
import { uploadDocument } from '../services/api'
import type { Document } from '../types'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/common/Toast'
import { UploadZone } from '../components/documents/UploadZone'
import { ProgressStepper } from '../components/documents/ProgressStepper'
import { ErrorState } from '../components/common/ErrorState'

export default function Upload() {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [done, setDone] = useState(false)
  const [name, setName] = useState('')
  const [dept, setDept] = useState('HR')
  const [access, setAccess] = useState('employee')
  const [description, setDescription] = useState('')

  const isManager = user?.role === 'manager' || user?.role === 'admin'

  useEffect(() => {
    if (file) setName(file.name.replace('.pdf', ''))
  }, [file])

  if (!isManager) {
    return (
      <div className="space-y-6">
        <h1 className="page-title text-2xl font-bold">Upload Enterprise Document</h1>
        <ErrorState
          variant="unauthorized"
          title="Access Restricted"
          message="You don't have permission to upload documents to the knowledge vault."
        >
          <div className="mx-auto max-w-xs space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Your role</span>
              <span className="font-semibold capitalize text-[#172033]">{user?.role ?? 'employee'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Required role</span>
              <span className="font-semibold text-[#172033]">Manager</span>
            </div>
            <p className="text-xs text-[#64748B]">Contact your administrator if you believe this access is required.</p>
          </div>
        </ErrorState>
      </div>
    )
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      toast('error', 'Please select a PDF file to upload')
      return
    }
    setProcessing(true)
    setDone(false)
    await uploadDocument(file, {
      name,
      department: dept,
      access: access as Document['access'],
      description,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title text-2xl font-bold">Upload Enterprise Document</h1>
        <p className="page-subtitle">Add internal documents to the secure knowledge vault.</p>
      </div>

      {done ? (
        <div className="card flex flex-col items-center p-10 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-7 w-7 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-[#172033]">Document Uploaded Successfully</h2>
          <p className="mt-1 text-sm text-[#64748B]">
            <span className="font-medium text-[#172033]">{name || file?.name}</span> is now available in the secure knowledge vault.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => {
                setDone(false)
                setProcessing(false)
                setFile(null)
                setName('')
                setDescription('')
              }}
              className="btn-secondary"
            >
              Upload Another
            </button>
            <button onClick={() => navigate('/documents')} className="btn-primary">View Documents</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <UploadZone onFile={setFile} />
            <div className="mt-5">
              <ProgressStepper
                running={processing}
                onComplete={() => {
                  setProcessing(false)
                  setDone(true)
                  toast('success', 'Document processed and added to the vault')
                }}
              />
            </div>
          </div>

          <form onSubmit={handleUpload} className="card h-fit p-6">
            <h2 className="text-base font-semibold text-[#172033]">Document Information</h2>
            <div className="mt-5 space-y-4">
              <div>
                <label className="label">Document Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. HR Handbook" className="input" />
              </div>
              <div>
                <label className="label">Department</label>
                <select value={dept} onChange={(e) => setDept(e.target.value)} className="input">
                  <option>HR</option>
                  <option>IT</option>
                  <option>Finance</option>
                  <option>Legal</option>
                  <option>Operations</option>
                  <option>Management</option>
                </select>
              </div>
              <div>
                <label className="label">Access Role</label>
                <select value={access} onChange={(e) => setAccess(e.target.value)} className="input">
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Briefly describe the document contents..." className="input resize-none" />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => navigate('/documents')} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={!file || processing} className="btn-primary flex-1 disabled:opacity-60">
                {processing ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <UploadCloud className="h-4 w-4" />
                )}
                Upload &amp; Process
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
