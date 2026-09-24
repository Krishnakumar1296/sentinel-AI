import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell, Menu, LogOut, Search, ShieldCheck, Sun, Moon, ChevronDown,
  UserRound, Mail, Building2, CheckCircle2, AlertTriangle, XCircle, Info,
  CheckCheck, BellOff, Layers
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../../services/api'
import type { Notification, UserRole } from '../../types'

interface NavbarProps {
  user: { name: string; role: UserRole; department: string; email?: string } | null
  onMenuClick: () => void
  onLogout: () => void
}

export default function Navbar({ user, onMenuClick, onLogout }: NavbarProps) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loadingNotifs, setLoadingNotifs] = useState(false)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    let active = true
    setLoadingNotifs(true)
    getNotifications().then((n) => {
      if (active) {
        setNotifications(n)
        setLoadingNotifs(false)
      }
    })
    return () => { active = false }
  }, [])

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    markNotificationRead(id).catch(() => {})
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    markAllNotificationsRead().catch(() => {})
  }

  const notifIcons: Record<Notification['type'], { icon: typeof Info; styles: string }> = {
    success: { icon: CheckCircle2, styles: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' },
    warning: { icon: AlertTriangle, styles: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40' },
    error: { icon: XCircle, styles: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40' },
    info: { icon: Info, styles: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40' },
  }

  return (
    <header className="relative z-30 flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#090D16]/95 px-4 backdrop-blur-md lg:gap-6 lg:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Branding */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white border border-slate-800 dark:bg-blue-600 dark:border-blue-500">
          <Layers className="h-4 w-4 text-blue-400 dark:text-white" />
        </div>
        <span className="font-display text-sm font-bold tracking-tight text-slate-900 dark:text-white">
          Sentinel <span className="text-blue-600 dark:text-blue-400">AI</span>
        </span>
      </div>

      {/* Global Knowledge Quick Search */}
      <div className="hidden max-w-lg flex-1 md:flex">
        <div className="group relative w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
          <input
            placeholder="Search enterprise documents, policies, or knowledge..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                navigate(`/search?q=${encodeURIComponent(e.currentTarget.value)}`)
              }
            }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 py-2 pl-10 pr-4 text-xs font-normal text-slate-900 dark:text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/15"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="ml-auto flex items-center gap-2 lg:gap-3">
        {/* Active RBAC Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>RBAC Protected</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-semibold text-white shadow-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 z-20 mt-3 w-84 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-xl animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <p className="font-display text-xs font-semibold text-slate-900 dark:text-slate-100">Notifications</p>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {loadingNotifs ? (
                    <div className="p-6 text-center text-xs text-slate-400">Loading notifications...</div>
                  ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                      <BellOff className="h-6 w-6 text-slate-300 dark:text-slate-600" />
                      <span>No active notifications</span>
                    </div>
                  ) : (
                    notifications.map((n) => {
                      const IconCfg = notifIcons[n.type] ?? notifIcons.info
                      const Icon = IconCfg.icon
                      return (
                        <button
                          key={n.id}
                          onClick={() => markRead(n.id)}
                          className={`flex w-full items-start gap-3 p-3.5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                            !n.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                          }`}
                        >
                          <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${IconCfg.styles}`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-display text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{n.title}</span>
                              {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />}
                            </div>
                            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">{n.message}</p>
                            <span className="mt-1 block text-[10px] text-slate-400">{n.timestamp}</span>
                          </div>
                        </button>
                      )
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 pr-2.5 text-left transition-colors hover:border-slate-300 dark:hover:border-slate-700 shadow-xs"
            title="View your profile"
            aria-label="Open profile"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-semibold text-white shadow-xs">
              {user?.name?.charAt(0)?.toUpperCase() ?? 'K'}
            </div>
            <div className="hidden text-right sm:block">
              <p className="font-display text-xs font-semibold leading-tight text-slate-900 dark:text-slate-100 capitalize">{user?.name ?? 'Krishna Kumar'}</p>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {user?.role ?? 'employee'}
                </span>
              </div>
            </div>
            <ChevronDown className={`hidden h-3.5 w-3.5 text-slate-400 transition-transform sm:block ${profileOpen ? 'rotate-180' : ''}`} />
          </button>
          {profileOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 z-20 mt-3 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-xl animate-fade-in">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-xs">
                    {user?.name?.charAt(0)?.toUpperCase() ?? 'K'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100 truncate capitalize">{user?.name ?? 'Krishna Kumar'}</p>
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                      <UserRound className="h-3 w-3" /> {user?.role ?? 'employee'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2.5 border-b border-slate-100 dark:border-slate-800 p-4 text-xs">
                  {user?.email && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  )}
                  {user?.department && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="capitalize">{user.department} Department</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium pt-1">
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                    <span>Role-Based Access Clearance</span>
                  </div>
                </div>
                <div className="p-1.5">
                  <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Logout Button */}
        <button
          onClick={onLogout}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-rose-600 hover:border-rose-200 dark:hover:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shadow-xs"
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
