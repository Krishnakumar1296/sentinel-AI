import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Menu, LogOut, Search, ShieldCheck, Sun, Moon, ChevronDown, Settings, UserRound, Mail, Building2 } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import type { UserRole } from '../../types'

interface NavbarProps {
  user: { name: string; role: UserRole; department: string; email?: string } | null
  onMenuClick: () => void
  onLogout: () => void
}

const notifications = [
  { id: 1, title: 'Document Processing Complete', body: 'Security Policy.pdf is now available.', time: '2 minutes ago', dot: 'bg-green-500' },
  { id: 2, title: 'Knowledge Gap Detected', body: 'A frequently asked question has no matching document.', time: '15 minutes ago', dot: 'bg-amber-500' },
  { id: 3, title: 'Security Alert', body: 'Unauthorized document access attempt blocked.', time: '1 hour ago', dot: 'bg-red-500' },
]

export default function Navbar({ user, onMenuClick, onLogout }: NavbarProps) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="relative z-30 flex h-16 shrink-0 items-center gap-3 border-b border-line bg-canvas-soft/85 px-4 backdrop-blur-md lg:gap-6 lg:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-md p-1.5 text-muted transition hover:bg-surface-soft lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="hidden md:block lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
            S
          </div>
          <span className="text-sm font-bold tracking-tight text-ink">SENTINEL AI</span>
        </div>
      </div>

      <div className="hidden max-w-xl flex-1 md:flex">
        <div className="group relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
          <input
            placeholder="Ask anything about your company knowledge..."
            className="w-full rounded-lg border border-line bg-surface-muted py-2 pl-9 pr-4 text-sm text-ink outline-none transition placeholder:text-faint focus:border-brand-blue focus:bg-surface focus:ring-2 focus:ring-brand-blue/10"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 lg:gap-4">
        <button
          onClick={() => navigate('/search')}
          className="rounded-lg p-2 text-muted transition hover:bg-surface-soft hover:text-ink md:hidden"
          title="Search"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>

        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-muted transition hover:bg-surface-soft hover:text-ink"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative rounded-lg p-2 text-muted transition hover:bg-surface-soft hover:text-ink"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-blue" />
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-line bg-surface shadow-card-md animate-fade-in">
                <div className="border-b border-line px-4 py-3">
                  <p className="text-sm font-semibold text-ink">Notifications</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="flex gap-3 border-b border-line-soft px-4 py-3 transition hover:bg-surface-soft">
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.dot}`} />
                      <div>
                        <p className="text-sm font-medium text-ink">{n.title}</p>
                        <p className="text-xs text-muted">{n.body}</p>
                        <p className="mt-1 text-[11px] text-faint">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="hidden items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-2.5 py-1.5 dark:border-green-500/20 dark:bg-green-500/10 lg:flex">
          <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="text-xs font-medium text-green-700 dark:text-green-400">Secure</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2.5 rounded-lg p-1.5 pr-2 text-left transition hover:bg-surface-soft"
            title="View your profile"
            aria-label="Open profile"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
              {user?.name?.charAt(0) ?? 'K'}
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight text-ink">{user?.name ?? 'Krishna Kumar'}</p>
              <p className="text-xs font-medium uppercase tracking-wide text-muted capitalize">{user?.role ?? 'employee'}</p>
            </div>
            <ChevronDown className={`hidden h-4 w-4 text-faint transition-transform sm:block ${profileOpen ? 'rotate-180' : ''}`} />
          </button>
          {profileOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-line bg-surface shadow-card-md animate-fade-in">
                <div className="flex items-center gap-3 border-b border-line px-4 py-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
                    {user?.name?.charAt(0) ?? 'K'}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold capitalize text-ink">{user?.name ?? 'Krishna Kumar'}</p>
                    <span className="inline-flex items-center gap-1 rounded-full border border-brand-blue/30 bg-brand-blue/10 px-2 py-0.5 text-[11px] font-medium capitalize text-brand-blue">
                      <UserRound className="h-3 w-3" /> {user?.role ?? 'employee'}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 border-b border-line px-4 py-4">
                  {user?.email && (
                    <div className="flex items-center gap-2.5 text-sm text-muted">
                      <Mail className="h-4 w-4 shrink-0 text-faint" />
                      <span className="min-w-0 truncate">{user.email}</span>
                    </div>
                  )}
                  {user?.department && (
                    <div className="flex items-center gap-2.5 text-sm text-muted">
                      <Building2 className="h-4 w-4 shrink-0 text-faint" />
                      <span className="capitalize">{user.department}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5 text-sm text-muted">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                    <span>Access protected by RBAC</span>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => { setProfileOpen(false); navigate('/settings') }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-ink"
                  >
                    <Settings className="h-4 w-4" /> Account Settings
                  </button>
                  <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-red-500"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <button
          onClick={onLogout}
          className="rounded-lg p-2 text-muted transition hover:bg-surface-soft hover:text-red-500"
          title="Sign out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
