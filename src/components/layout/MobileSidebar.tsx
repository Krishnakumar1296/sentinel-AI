import { NavLink, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import {
  LayoutDashboard, MessagesSquare, Files, FilePlus2, History,
  BarChart3, Users,
  FileText, ChevronDown, X, LogOut, Sparkles, Plus, MessageCircle, MessageSquareDashed, Layers
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { User, UserRole } from '../../types'
import { getChats } from '../../services/api'
import type { ChatSession } from '../../services/api'

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
    'group flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
  const activeClass =
    'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-50/80 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/60 transition-colors'

  if (!open) return null

  const bareUser: BareUser | null = user ? { name: user.name, role: user.role } : null

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <aside className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090D16] shadow-xl animate-slide-in">
        <div className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white border border-slate-800 dark:bg-blue-600 dark:border-blue-500">
              <Layers className="h-4 w-4 text-blue-400 dark:text-white" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                  Sentinel
                </span>
                <span className="rounded bg-slate-100 dark:bg-slate-800 px-1 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                  AI
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Enterprise Knowledge</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {!isAdmin && (
            <button
              onClick={() => { onClose(); navigate(`/search?new=${Date.now()}`) }}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Inquiry</span>
            </button>
          )}

          <p className="px-3 pb-1 pt-1 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">Workspace</p>
          {role === 'manager' && (
            <NavLink to="/dashboard" onClick={onClose} className={({ isActive }) => (isActive ? activeClass : linkBase)}>
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </NavLink>
          )}
          {!isAdmin && (
            <NavLink to="/search" onClick={onClose} className={({ isActive }) => (isActive ? activeClass : linkBase)}>
              <MessagesSquare className="h-4 w-4" /> Knowledge Search
            </NavLink>
          )}
          {!isAdmin && chats.filter((c) => c.messages.length > 0).length > 0 && (
            <div className="pt-3">
              <p className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">Recent Inquiries</p>
              {chats.filter((c) => c.messages.length > 0).slice(0, 6).map((c) => (
                <NavLink
                  key={c.id}
                  to={`/search?chat=${c.id}`}
                  onClick={onClose}
                  className={({ isActive }) => (isActive || activeChatId === c.id ? activeClass : `${linkBase} truncate`)}
                >
                  <MessageCircle className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{c.title}</span>
                </NavLink>
              ))}
            </div>
          )}
          {role === 'manager' && (
            <NavLink to="/about" onClick={onClose} className={({ isActive }) => (isActive ? activeClass : linkBase)}>
              <Sparkles className="h-4 w-4 text-indigo-500" /> Platform Capabilities
            </NavLink>
          )}
          {isManager && (
            <>
              <button
                onClick={() => setDocsOpen((o) => !o)}
                className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                <Files className="h-4 w-4" /> <span>Document Repository</span>
                <ChevronDown className={`ml-auto h-3.5 w-3.5 text-slate-400 transition-transform ${docsOpen ? 'rotate-180' : ''}`} />
              </button>
              {docsOpen && (
                <div className="mb-1 ml-3 border-l border-slate-200 dark:border-slate-800 pl-3 space-y-0.5">
                  <NavLink to="/documents" onClick={onClose} className={({ isActive }) => (isActive ? activeClass : linkBase)}>
                    <FileText className="h-3.5 w-3.5" /> All Documents
                  </NavLink>
                  <NavLink to="/upload" onClick={onClose} className={({ isActive }) => (isActive ? activeClass : linkBase)}>
                    <FilePlus2 className="h-3.5 w-3.5" /> Upload & Ingest
                  </NavLink>
                </div>
              )}
            </>
          )}
          {!isAdmin && (
            <NavLink to="/history" onClick={onClose} className={({ isActive }) => (isActive ? activeClass : linkBase)}>
              <History className="h-4 w-4" /> Audit History
            </NavLink>
          )}
          {isManager && (
            <NavLink to="/analytics" onClick={onClose} className={({ isActive }) => (isActive ? activeClass : linkBase)}>
              <BarChart3 className="h-4 w-4 text-emerald-500" /> Knowledge Analytics
            </NavLink>
          )}
          {isAdmin && (
            <>
              <p className="px-3 pb-1 pt-4 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">Administration</p>
              <NavLink to="/users" onClick={onClose} className={({ isActive }) => (isActive ? activeClass : linkBase)}>
                <Users className="h-4 w-4 text-blue-500" /> Users & Clearances
              </NavLink>
              <NavLink to="/requests" onClick={onClose} className={({ isActive }) => (isActive ? activeClass : linkBase)}>
                <MessageSquareDashed className="h-4 w-4 text-indigo-500" /> Access Requests
              </NavLink>
            </>
          )}
        </nav>

        <div className="border-t border-slate-200 dark:border-slate-800 p-3">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-semibold text-white shadow-xs">
              {bareUser?.name?.charAt(0)?.toUpperCase() ?? 'K'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-xs font-semibold text-slate-900 dark:text-slate-100 capitalize">{bareUser?.name ?? 'Krishna Kumar'}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">{role}</p>
            </div>
            <button onClick={handleLogout} className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors" title="Sign out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}

