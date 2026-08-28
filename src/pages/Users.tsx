import { useEffect, useState } from 'react'
import { UserPlus, Search } from 'lucide-react'
import { getUsers, updateUserRole } from '../services/api'
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
  const [form, setForm] = useState({ name: '', email: '', department: 'HR', role: 'employee' as UserRole })

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
              <span className="text-[#64748B]">Your role</span>
              <span className="font-semibold capitalize text-[#172033]">{user?.role ?? 'employee'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Required role</span>
              <span className="font-semibold text-[#172033]">Admin</span>
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

  const handleEditRole = async (target: User, role: UserRole) => {
    const updated = await updateUserRole(target.id, role)
    if (updated) {
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
      toast('success', `${target.name}'s role updated to ${role}`)
    }
  }

  const openEdit = (u: User) => {
    setEditUser(u)
    setForm({ name: u.name, email: u.email, department: u.department, role: u.role })
  }

  const handleAddSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const newUser: User = {
      id: `u${Date.now()}`,
      name: form.name,
      email: form.email,
      department: form.department,
      role: form.role,
      status: 'active',
      lastActive: 'Just now',
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setUsers((prev) => [...prev, newUser])
    setAddOpen(false)
    setForm({ name: '', email: '', department: 'HR', role: 'employee' })
    toast('success', 'User added successfully')
  }

  const modalFooter = (close: () => void, save: () => void) => (
    <>
      <button onClick={close} className="btn-secondary">Cancel</button>
      <button onClick={save} className="btn-primary">Save</button>
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
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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
        title="Add New User"
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Department</label>
              <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="input">
                <option>HR</option><option>IT</option><option>Finance</option><option>Legal</option><option>Operations</option><option>Management</option>
              </select>
            </div>
            <div>
              <label className="label">Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })} className="input">
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!editUser}
        onClose={() => setEditUser(null)}
        title={`Edit User — ${editUser?.name ?? ''}`}
        footer={modalFooter(
          () => setEditUser(null),
          () => {
            if (editUser) {
              handleEditRole(editUser, form.role)
              setEditUser(null)
            }
          },
        )}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
              {editUser?.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-[#172033]">{editUser?.name}</p>
              <p className="text-sm text-[#64748B]">{editUser?.email}</p>
            </div>
          </div>
          <div>
            <label className="label">Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })} className="input">
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
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
