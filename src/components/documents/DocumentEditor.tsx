import { useState } from 'react'
import { X, Save } from 'lucide-react'
import type { Document } from '../../types'
import { FullPDFEditor } from './FullPDFEditor'

interface DocumentEditorProps {
  mode: 'create' | 'edit'
  initial?: Pick<Document, 'name' | 'department' | 'description' | 'content' | 'pages'>
  departments?: string[]
  saving?: boolean
  onSave: (values: { name: string; department: string; description: string; content: string }) => void
  onClose: () => void
}

export function DocumentEditor({ mode, initial, departments = [], saving, onSave, onClose }: DocumentEditorProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [department, setDepartment] = useState(initial?.department ?? departments[0] ?? 'HR')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [content, setContent] = useState(initial?.content ?? '')

  const valid = name.trim().length > 0 && content.trim().length > 0

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-line bg-surface shadow-card-md animate-fade-in">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-ink">
              {mode === 'create' ? 'Add Document' : `Edit — ${initial?.name ?? ''}`}
            </h2>
            <p className="text-xs text-muted">
              {mode === 'create'
                ? 'Fill the missing knowledge and publish it to the knowledge base.'
                : 'Edits are published and the team is notified.'}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted transition hover:bg-surface-soft hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Document Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Remote Work Guidelines v2" className="input" />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Department</label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} className="input w-full">
              {(departments.length ? departments : ['HR', 'IT', 'Finance', 'Engineering', 'Operations', 'Legal']).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Short summary of what this document covers."
              className="input resize-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Document Content</label>
            <FullPDFEditor
              value={content}
              documentName={name.trim() || 'Untitled Document'}
              pages={initial?.pages ?? 1}
              onChange={setContent}
            />
            <p className="mt-1.5 text-[11px] text-faint">
              Open any page and click directly on the PDF text to edit it, then upload.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-line px-5 py-4">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button
            onClick={() => valid && onSave({ name: name.trim(), department, description: description.trim(), content })}
            disabled={!valid || saving}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Uploading...' : mode === 'create' ? 'Upload & Publish' : 'Save & Upload'}
          </button>
        </div>
      </div>
    </div>
  )
}