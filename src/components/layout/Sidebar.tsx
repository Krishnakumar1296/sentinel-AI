import { NavLink, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  MessagesSquare,
  Files,
  FilePlus2,
  History,
  BarChart3,
  Users,
  FileText,
  ChevronDown,
  LogOut,
  Shield,
  Sparkles,
  Plus,
  MessageCircle,
  MessageSquareDashed,
  Layers,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { UserRole } from '../../types'
import { getChats } from '../../services/api'
import type { ChatSession } from '../../services/api'
import { EASING, DURATION } from '../animations/motion-tokens'

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
    'relative group flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-[#b4b4b4] hover:text-slate-900 dark:hover:text-[#ececec] hover:bg-slate-100 dark:hover:bg-[#212121] transition-colors z-10'

  const activeClass =
    'relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-blue-700 dark:text-white z-10'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const renderLinkWithIndicator = (
    to: string,
    icon: React.ReactNode,
    label: string,
    isActiveCheck?: boolean,
    badge?: React.ReactNode
  ) => {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          (isActiveCheck !== undefined ? isActiveCheck : isActive) ? activeClass : linkBase
        }
      >
        {({ isActive }) => {
          const currentActive = isActiveCheck !== undefined ? isActiveCheck : isActive
          return (
            <>
              {currentActive && (
                <motion.div
                  layoutId="sidebarActivePill"
                  className="absolute inset-0 rounded-xl bg-blue-50/80 dark:bg-[#2f2f2f] border border-blue-200/80 dark:border-white/[0.12] -z-10 shadow-xs"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              {icon}
              <span className="truncate">{label}</span>
              {badge && <span className="ml-auto shrink-0">{badge}</span>}
            </>
          )
        }}
      </NavLink>
    )
  }

  return (
    <aside className="sidebar-width hidden h-screen shrink-0 flex-col border-r border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#171717] lg:flex select-none">
      {/* Executive Brand Header */}
      <motion.div 
        className="flex h-16 items-center gap-3 border-b border-slate-200 dark:border-white/[0.08] px-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATION.NORMAL }}
      >
        <motion.div
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(isManager ? '/dashboard' : '/search')}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm border border-slate-800 dark:bg-[#262626] dark:border-white/[0.12] cursor-pointer"
        >
          <Layers className="h-4 w-4 text-blue-400 dark:text-emerald-400" />
        </motion.div>
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="font-display text-sm font-bold tracking-tight text-slate-900 dark:text-[#ececec]">
              Sentinel
            </span>
            <span className="rounded bg-slate-100 dark:bg-[#262626] border dark:border-white/[0.1] px-1 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-[#b4b4b4]">
              AI
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-[#8e8e8e] font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Enterprise Knowledge</span>
          </div>
        </div>
      </motion.div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {/* New Inquiry Action */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: DURATION.FAST, ease: EASING.SMOOTH }}
          onClick={() => navigate(`/search?new=${Date.now()}`)}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 py-2 px-3 text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Inquiry</span>
        </motion.button>

        <p className="px-3 pb-1 pt-1 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-[#737373] uppercase">
          Workspace
        </p>

        {isManager &&
          renderLinkWithIndicator('/dashboard', <LayoutDashboard className="h-4 w-4 shrink-0" />, 'Dashboard')}

        {renderLinkWithIndicator('/search', <MessagesSquare className="h-4 w-4 shrink-0" />, 'Knowledge Search')}

        {/* Recent Conversations */}
        {chats.filter((c) => c.messages.length > 0).length > 0 && (
          <div className="pt-2">
            <p className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              Recent Inquiries
            </p>
            {chats.filter((c) => c.messages.length > 0).slice(0, 4).map((c) => {
              const isChatActive = activeChatId === c.id
              return renderLinkWithIndicator(
                `/search?chat=${c.id}`,
                <MessageCircle className="h-3.5 w-3.5 shrink-0 text-slate-400" />,
                c.title,
                isChatActive
              )
            })}
          </div>
        )}

        {/* Documents Section */}
        {isManager && (
          <>
            <motion.button
              whileHover={{ x: 2 }}
              transition={{ duration: DURATION.FAST }}
              onClick={() => setDocsOpen((o) => !o)}
              className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              <Files className="h-4 w-4" />
              <span>Document Repository</span>
              <motion.div
                animate={{ rotate: docsOpen ? 180 : 0 }}
                transition={{ duration: DURATION.FAST, ease: EASING.SMOOTH }}
                className="ml-auto"
              >
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </motion.div>
            </motion.button>
            <AnimatePresence initial={false}>
              {docsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: DURATION.FAST, ease: EASING.SMOOTH }}
                  className="overflow-hidden mb-1 ml-3 border-l border-slate-200 dark:border-slate-800 pl-3 space-y-0.5"
                >
                  {renderLinkWithIndicator('/documents', <FileText className="h-3.5 w-3.5" />, 'All Documents')}
                  {renderLinkWithIndicator('/upload', <FilePlus2 className="h-3.5 w-3.5" />, 'Upload & Ingest')}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {renderLinkWithIndicator('/history', <History className="h-4 w-4 shrink-0" />, 'Audit History')}

        {isManager &&
          renderLinkWithIndicator('/analytics', <BarChart3 className="h-4 w-4 shrink-0 text-emerald-500" />, 'Knowledge Analytics')}

        {role === 'manager' &&
          renderLinkWithIndicator('/requests', <MessageSquareDashed className="h-4 w-4 shrink-0 text-indigo-500" />, 'Knowledge Requests')}

        {renderLinkWithIndicator('/about', <Sparkles className="h-4 w-4 shrink-0 text-indigo-500" />, 'Platform Capabilities')}

        {/* Administration Section (Admin Only) */}
        {isAdmin && (
          <>
            <p className="px-3 pb-1 pt-4 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-[#737373] uppercase">
              Administration
            </p>
            {renderLinkWithIndicator(
              '/security',
              <Shield className="h-4 w-4 shrink-0 text-emerald-400" />,
              'Security Command',
              undefined,
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
            {renderLinkWithIndicator('/users', <Users className="h-4 w-4 shrink-0 text-blue-400" />, 'Users & Clearances')}
            {renderLinkWithIndicator('/roles', <Layers className="h-4 w-4 shrink-0 text-amber-400" />, 'Roles & Permissions')}
            {renderLinkWithIndicator('/requests', <MessageSquareDashed className="h-4 w-4 shrink-0 text-indigo-400" />, 'Knowledge Requests')}
          </>
        )}
      </nav>

      {/* Footer Profile & Compliance Status */}
      <div className="border-t border-slate-200 dark:border-white/[0.08] p-3">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          transition={{ duration: DURATION.FAST }}
          className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#212121] p-2.5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 dark:bg-[#2f2f2f] border dark:border-white/[0.1] text-xs font-semibold text-white shadow-xs">
            {user?.name?.charAt(0)?.toUpperCase() ?? 'K'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-xs font-semibold text-slate-900 dark:text-[#ececec] capitalize">
              {user?.name ?? 'Krishna Kumar'}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-emerald-400">
              {role}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </motion.button>
        </motion.div>
        <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-slate-500 dark:text-[#8e8e8e]">
          <span className="flex items-center gap-1.5">
            <Shield className="h-3 w-3 text-emerald-500" />
            <span>FIPS-140-3 Active</span>
          </span>
          <span className="font-mono text-[10px] text-slate-400 dark:text-[#666666]">v1.2</span>
        </div>
      </div>
    </aside>
  )
}

