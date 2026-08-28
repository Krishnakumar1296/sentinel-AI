import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, MessagesSquare, Files, FilePlus2, History,
  Lightbulb, BarChart3, ShieldCheck, Settings, Users, KeyRound,
  ScrollText, FolderOpen, FileText, ChevronDown, X, LogOut,
} from 'lucide-react'
import { useState } from 'react'
import type { User, UserRole } from '../../types'

interface MobileSidebarProps {
  open: boolean
  onClose: () => void
  user: User | null
  logout: () => void
}

interface BareUser {
  name: string
  role: UserRole
}

export default function MobileSidebar({ open, onClose, user, logout }: MobileSidebarProps) {
  const navigate = useNavigate()
  const role = user?.role ?? 'employee'
  const [docsOpen, setDocsOpen] = useState(true)

  const isManager = role === 'manager' || role === 'admin'
  const isAdmin = role === 'admin'

  const linkBase =
    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#172033] transition-colors duration-150'
  const activeClass = 'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium bg-blue-50 text-[#2563EB]'

  if (!open) return null

  const bareUser: BareUser | null = user ? { name: user.name, role: user.role } : null

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-[#E2E8F0] bg-white shadow-xl animate-slide-in">
        <div className="flex h-16 items-center justify-between border-b border-[#E2E8F0] px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
              S
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-tight text-[#123B5D]">SENTINEL</p>
              <p className="text-[10px] font-medium uppercase tracking-widest text-[#64748B]">Secure Intelligence</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-[#64748B] hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Workspace</p>
          {isManager && (
            <NavLink to="/dashboard" onClick={onClose} className={({ isActive }) => (isActive ? activeClass : linkBase)}>
              <LayoutDashboard className="h-[18px] w-[18px]" /> Dashboard
            </NavLink>
          )}
          <NavLink to="/search" onClick={onClose} className={({ isActive }) => (isActive ? activeClass : linkBase)}>
            <MessagesSquare className="h-[18px] w-[18px]" /> AI Knowledge Search
          </NavLink>
          {isManager && (
            <>
              <button
                onClick={() => setDocsOpen((o) => !o)}
                className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
              >
                <Files className="h-[18px] w-[18px]" /> Documents
                <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${docsOpen ? 'rotate-90' : ''}`} />
              </button>
              {docsOpen && (
                <div className="mb-1 ml-3 border-l border-[#E2E8F0] pl-3">
                  <NavLink to="/documents" onClick={onClose} className={({ isActive }) => (isActive ? activeClass : linkBase)}>
                    <FileText className="h-[18px] w-[18px]" /> All Documents
                  </NavLink>
                  <NavLink to="/documents?scope=mine" onClick={onClose} className={({ isActive }) => (isActive ? activeClass : linkBase)}>
                    <FolderOpen className="h-[18px] w-[18px]" /> My Documents
                  </NavLink>
                  <NavLink to="/upload" onClick={onClose} className={({ isActive }) => (isActive ? activeClass : linkBase)}>
                    <FilePlus2 className="h-[18px] w-[18px]" /> Upload Document
                  </NavLink>
                </div>
              )}
            </>
          )}
          <NavLink to="/history" onClick={onClose} className={({ isActive }) => (isActive ? activeClass : linkBase)}>
            <History className="h-[18px] w-[18px]" /> Search History
          </NavLink>
          {isManager && (
            <NavLink to="/gaps" onClick={onClose} className={({ isActive }) => (isActive ? activeClass : linkBase)}>
              <Lightbulb className="h-[18px] w-[18px]" /> Knowledge Gaps
            </NavLink>
          )}
          {isManager && (
            <NavLink to="/analytics" onClick={onClose} className={({ isActive }) => (isActive ? activeClass : linkBase)}>
              <BarChart3 className="h-[18px] w-[18px]" /> Analytics
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/security" onClick={onClose} className={({ isActive }) => (isActive ? activeClass : linkBase)}>
              <ShieldCheck className="h-[18px] w-[18px]" /> Security Center
            </NavLink>
          )}
          <NavLink to="/settings" onClick={onClose} className={({ isActive }) => (isActive ? activeClass : linkBase)}>
            <Settings className="h-[18px] w-[18px]" /> Settings
          </NavLink>
          {isAdmin && (
            <>
              <p className="mb-1 mt-5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Administration</p>
              <NavLink to="/users" onClick={onClose} className={({ isActive }) => (isActive ? activeClass : linkBase)}>
                <Users className="h-[18px] w-[18px]" /> Users
              </NavLink>
              <NavLink to="/roles" onClick={onClose} className={({ isActive }) => (isActive ? activeClass : linkBase)}>
                <KeyRound className="h-[18px] w-[18px]" /> Roles &amp; Permissions
              </NavLink>
              <NavLink to="/security" onClick={onClose} className={({ isActive }) => (isActive ? activeClass : linkBase)}>
                <ScrollText className="h-[18px] w-[18px]" /> Audit Logs
              </NavLink>
            </>
          )}
        </nav>

        <div className="border-t border-[#E2E8F0] p-3">
          <div className="flex items-center gap-3 rounded-lg bg-[#F7F9FC] px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
              {bareUser?.name?.charAt(0) ?? 'K'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#172033] capitalize">{bareUser?.name ?? 'Krishna Kumar'}</p>
              <p className="text-xs font-medium uppercase tracking-wide text-[#2563EB] capitalize">{role}</p>
            </div>
            <button onClick={handleLogout} className="rounded-md p-1.5 text-[#64748B] hover:bg-slate-200 hover:text-red-500" title="Sign out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}
