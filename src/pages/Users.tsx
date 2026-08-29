import { useEffect, useState } from 'react'
import { UserPlus, Search, UserRound } from 'lucide-react'
import { getUsers, addUser, updateUserProfile, type NewUserInput } from '../services/api'
import type { User, UserRole } from '../types'
import { UserTable } from '../components/users/UserTable'
import { Modal } from '../components/common/Modal'
import { SkeletonLoader } from '../components/common/SkeletonLoader'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/common/Toast'
import { ErrorState } from '../components/common/ErrorState'

export default function Users() {
  const { user } = useAuth()
  const { toast } = useToast()
  const isAdmin = user?.role === 'admin'
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    department: 'HR',
    role: 'employee' as UserRole,
  })

  useEffect(() => {
    getUsers().then((u) => {
      setUsers(u)
      setLoading(false)
    })
  }, [])

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <h1 className="page-title text-2xl font-bold">User Management</h1>
        <ErrorState variant="unauthorized" title="Access Restricted" message="User management is restricted to administrators.">
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

  const filtered = users.filter((u) => {
    if (!search) return true
    const s = search.toLowerCase()
    return u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || u.department.toLowerCase().includes(s)
  })

  const openEdit = (u: User) => {
    setEditUser(u)
    setForm({
      name: u.name,
      email: u.email,
      username: u.username ?? u.email.split('@')[0],
      password: '',
      department: u.department,
      role: u.role,
    })
  }

  const handleAddSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      toast('error', 'Name, email and password are required')
      return
    }
    setSaving(true)
    const input: NewUserInput = {
      name: form.name,
      email: form.email,
      username: form.username || undefined,
      password: form.password,
      department: form.department,
      role: form.role,
    }
    const created = await addUser(input)
    setSaving(false)
    if (!created) {
      toast('error', 'A user with this email or username already exists')
      return
    }
    setUsers(await getUsers())
    setAddOpen(false)
    setForm({ name: '', email: '', username: '', password: '', department: 'HR', role: 'employee' })
    toast('success', `User created with username "${created.username ?? created.email.split('@')[0]}". You can share its credentials.`)
  }

  const handleEditSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!editUser) return
    setSaving(true)
    const updated = await updateUserProfile(editUser.id, {
      name: form.name,
      email: form.email,
      username: form.username,
      password: form.password || undefined,
      department: form.department,
      role: form.role,
    })
    setSaving(false)
    if (updated) {
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
      setEditUser(null)
      toast('success', form.password ? `${updated.name}'s credentials updated` : `${updated.name}'s details updated`)
    }
  }

  const modalFooter = (close: () => void, save: () => void, editing = false) => (
    <>
      <button onClick={close} className="btn-secondary">Cancel</button>
      <button onClick={save} className="btn-primary" disabled={saving}>
        {saving ? (editing ? 'Saving...' : 'Creating...') : editing ? 'Save' : 'Create User'}
      </button>
    </>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title text-2xl font-bold">User Management</h1>
          <p className="page-subtitle">Manage users and their access roles.</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary">
          <UserPlus className="h-4 w-4" /> Add User
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="input pl-10" />
      </div>

      {loading ? (
        <SkeletonLoader variant="library" />
      ) : (
        <UserTable
          users={filtered}
          onEdit={openEdit}
          onDelete={(u) => {
            setUsers((prev) => prev.filter((x) => x.id !== u.id))
            toast('info', `${u.name} removed`)
          }}
        />
      )}

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Create Employee Login"
        footer={modalFooter(() => setAddOpen(false), handleAddSubmit)}
      >
        <div className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" required />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" required />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Username</label>
              <input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="e.g. jane.doe"
                className="input"
              />
              <p className="mt-1 text-[11px] text-faint">Used for employee login. Defaults to email prefix if blank.</p>
            </div>
            <div>
              <label className="label">Password</label>
              <input
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Set employee password"
                className="input"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Department</label>
              <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="input">
                <option>HR</option><option>IT</option><option>Finance</option><option>Legal</option><option>Operations</option><option>Management</option>
              </select>
            </div>
            <div className="flex items-end">
              <p className="mb-0.5 text-xs text-muted">Created as <span className="font-semibold text-ink">Employee</span> access</p>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!editUser}
        onClose={() => setEditUser(null)}
        title={`Edit User — ${editUser?.name ?? ''}`}
        footer={modalFooter(() => setEditUser(null), () => handleEditSubmit(), true)}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
              {editUser?.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-ink">{editUser?.name}</p>
              <p className="text-sm text-muted">{editUser?.email}</p>
            </div>
          </div>
          <div>
            <label className="label">Username</label>
            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">Reset Password</label>
            <input
              type="text"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Leave blank to keep current password"
              className="input"
            />
          </div>
          <div>
            <label className="label">Department</label>
            <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="input" />
          </div>
        </div>
      </Modal>
    </div>
  )
}
