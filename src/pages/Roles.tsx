import { useNavigate } from 'react-router-dom'
import { KeyRound, Users, ShieldCheck } from 'lucide-react'
import { PermissionMatrix } from '../components/users/PermissionMatrix'
import { useAuth } from '../context/AuthContext'
import { ErrorState } from '../components/common/ErrorState'

export default function Roles() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <h1 className="page-title text-2xl font-bold">Roles &amp; Permissions</h1>
        <ErrorState variant="unauthorized" title="Access Restricted" message="Role management is restricted to administrators.">
          <div className="mx-auto max-w-xs space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Your role</span>
              <span className="font-semibold capitalize text-ink">{user?.role ?? 'employee'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Required role</span>
              <span className="font-semibold text-ink">Admin</span>
            </div>
          </div>
        </ErrorState>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title text-2xl font-bold">Role &amp; Permission Management</h1>
        <p className="page-subtitle">
          Define what each role can access. These controls are enforced by the backend at every request.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: Users, name: 'Employee', desc: 'Search and view documents' },
          { icon: KeyRound, name: 'Manager', desc: 'Upload, analytics, gaps' },
          { icon: ShieldCheck, name: 'Admin', desc: 'Full access + administration' },
        ].map((r) => (
          <div key={r.name} className="card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
                <r.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-ink">{r.name}</p>
                <p className="text-xs text-muted">{r.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold text-ink">Permissions Matrix</h2>
        <PermissionMatrix />
        <p className="mt-3 text-xs text-muted">
          Note: Frontend role hiding is a UI feature only. The backend must enforce authorization before any document retrieval.
        </p>
      </div>

      <div className="card flex items-center gap-3 p-5">
        <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
        <p className="text-sm text-muted">
          Managing users?{' '}
          <button onClick={() => navigate('/users')} className="font-medium text-brand-blue hover:text-brand-blue">Go to User Management</button>
        </p>
      </div>
    </div>
  )
}
