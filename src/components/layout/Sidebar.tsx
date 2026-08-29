import { NavLink, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import {
  LayoutDashboard,
  MessagesSquare,
  Files,
  FilePlus2,
  History,
  BarChart3,
  Users,
  FolderOpen,
  FileText,
  ChevronDown,
  LogOut,
  Shield,
  Sparkles,
  MessageSquarePlus,
  MessageCircleMore,
  MessageSquareDashed,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { UserRole } from '../../types'
import { getChats } from '../../services/api'
import type { ChatSession } from '../../services/api'

interface SidebarProps {
  user: { name: string; role: UserRole } | null
  logout: () => void
}

export default function Sidebar({ user, logout }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const role = user?.role ?? 'employee'
  const [docsOpen, setDocsOpen] = useState(true)
  const [chats, setChats] = useState<ChatSession[]>([])

  const isManager = role === 'manager' || role === 'admin'
  const isAdmin = role === 'admin'
  const activeChatId = location.pathname === '/search' ? searchParams.get('chat') : null

  useEffect(() => {
    getChats().then(setChats)
  }, [location])

  const linkBase =
    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:bg-surface-soft hover:text-ink transition-colors duration-150'

  const activeClass = 'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium bg-brand-blue/10 text-brand-blue'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar-width hidden h-screen shrink-0 flex-col border-r border-line bg-surface lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-line px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
          S
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-tight text-ink">SENTINEL</p>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted">
            Secure Intelligence
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-faint">
          Workspace
        </p>

        {!isAdmin && (
          <button
            onClick={() => navigate(`/search?new=${Date.now()}`)}
            className={linkBase}
          >
            <MessageSquarePlus className="h-[18px] w-[18px]" />
            New Chat
          </button>
        )}

        {role === 'manager' && (
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? activeClass : linkBase)}>
            <LayoutDashboard className="h-[18px] w-[18px]" />
            Dashboard
          </NavLink>
        )}

        {!isAdmin && (
          <NavLink to="/search" className={({ isActive }) => (isActive ? activeClass : linkBase)}>
            <MessagesSquare className="h-[18px] w-[18px]" />
            AI Knowledge Search
          </NavLink>
        )}

        {!isAdmin && chats.filter((c) => c.messages.length > 0).length > 0 && (
          <div className="mt-1">
            <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-faint">
              Recent Chats
            </p>
            {chats.filter((c) => c.messages.length > 0).slice(0, 6).map((c) => (
              <NavLink
                key={c.id}
                to={`/search?chat=${c.id}`}
                className={({ isActive }) =>
                  isActive || activeChatId === c.id ? activeClass : `${linkBase} truncate`
                }
              >
                <MessageCircleMore className="h-[18px] w-[18px] shrink-0" />
                <span className="truncate">{c.title}</span>
              </NavLink>
            ))}
          </div>
        )}

        {role === 'manager' && (
          <NavLink to="/about" className={({ isActive }) => (isActive ? activeClass : linkBase)}>
            <Sparkles className="h-[18px] w-[18px]" />
            Why Sentinel AI
          </NavLink>
        )}

        {isManager && (
          <>
            <button
              onClick={() => setDocsOpen((o) => !o)}
              className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:bg-surface-soft hover:text-ink transition-colors duration-150"
            >
              <Files className="h-[18px] w-[18px]" />
              Documents
              <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${docsOpen ? 'rotate-90' : ''}`} />
            </button>
            {docsOpen && (
              <div className="mb-1 ml-3 border-l border-line pl-3">
                <NavLink to="/documents" className={({ isActive }) => (isActive ? activeClass : linkBase)}>
                  <FileText className="h-[18px] w-[18px]" />
                  All Documents
                </NavLink>
                <NavLink to="/upload" className={({ isActive }) => (isActive ? activeClass : linkBase)}>
                  <FilePlus2 className="h-[18px] w-[18px]" />
                  Upload Document
                </NavLink>
              </div>
            )}
          </>
        )}

        {!isAdmin && (
          <NavLink to="/history" className={({ isActive }) => (isActive ? activeClass : linkBase)}>
            <History className="h-[18px] w-[18px]" />
            Search History
          </NavLink>
        )}

        {isManager && (
          <NavLink to="/analytics" className={({ isActive }) => (isActive ? activeClass : linkBase)}>
            <BarChart3 className="h-[18px] w-[18px]" />
            Analytical Gap
          </NavLink>
        )}

        {isAdmin && (
          <>
            <p className="mb-1 mt-5 px-3 text-[11px] font-semibold uppercase tracking-wider text-faint">
              Administration
            </p>
            <NavLink to="/users" className={({ isActive }) => (isActive ? activeClass : linkBase)}>
              <Users className="h-[18px] w-[18px]" />
              Users
            </NavLink>
            <NavLink to="/requests" className={({ isActive }) => (isActive ? activeClass : linkBase)}>
              <MessageSquareDashed className="h-[18px] w-[18px]" />
              Knowledge Requests
            </NavLink>
          </>
        )}
      </nav>

      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-lg bg-surface-muted px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
            {user?.name?.charAt(0) ?? 'K'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink capitalize">{user?.name ?? 'Krishna Kumar'}</p>
            <p className="text-xs font-medium uppercase tracking-wide text-brand-blue">{role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md p-1.5 text-muted transition hover:bg-surface-soft hover:text-red-500"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between px-1">
          <p className="flex items-center gap-1.5 text-[10px] text-faint">
            <Shield className="h-3 w-3 text-green-500" />
            Secure · RBAC
          </p>
        </div>
      </div>
    </aside>
  )
}
