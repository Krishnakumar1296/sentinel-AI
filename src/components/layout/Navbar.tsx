import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Menu, LogOut, Search, ShieldCheck } from 'lucide-react'
import type { UserRole } from '../../types'

interface NavbarProps {
  user: { name: string; role: UserRole; department: string } | null
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
  const navigate = useNavigate()

  return (
    <header className="relative z-30 flex h-16 shrink-0 items-center gap-3 border-b border-[#E2E8F0] bg-white/85 px-4 backdrop-blur-md lg:gap-6 lg:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-md p-1.5 text-[#64748B] transition hover:bg-slate-100 lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="hidden md:block lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
            S
          </div>
          <span className="text-sm font-bold tracking-tight text-[#123B5D]">SENTINEL AI</span>
        </div>
      </div>

      <div className="hidden max-w-xl flex-1 md:flex">
        <div className="group relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          <input
            placeholder="Ask anything about your company knowledge..."
            className="w-full rounded-lg border border-[#E2E8F0] bg-slate-50 py-2 pl-9 pr-4 text-sm text-[#172033] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:bg-white focus:ring-2 focus:ring-[#2563EB]/10"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 lg:gap-4">
        <button
          onClick={() => navigate('/search')}
          className="rounded-lg p-2 text-[#64748B] transition hover:bg-slate-100 hover:text-[#172033] md:hidden"
          title="Search"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative rounded-lg p-2 text-[#64748B] transition hover:bg-slate-100 hover:text-[#172033]"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#2563EB]" />
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-lg animate-fade-in">
                <div className="border-b border-[#E2E8F0] px-4 py-3">
                  <p className="text-sm font-semibold text-[#172033]">Notifications</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="flex gap-3 border-b border-slate-50 px-4 py-3 transition hover:bg-slate-50">
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.dot}`} />
                      <div>
                        <p className="text-sm font-medium text-[#172033]">{n.title}</p>
                        <p className="text-xs text-[#64748B]">{n.body}</p>
                        <p className="mt-1 text-[11px] text-slate-400">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="hidden items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-2.5 py-1.5 lg:flex">
          <ShieldCheck className="h-4 w-4 text-green-600" />
          <span className="text-xs font-medium text-green-700">Secure</span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
            {user?.name?.charAt(0) ?? 'K'}
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold leading-tight text-[#172033]">{user?.name ?? 'Krishna Kumar'}</p>
            <p className="text-xs font-medium uppercase tracking-wide text-[#64748B] capitalize">{user?.role ?? 'employee'}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="rounded-lg p-2 text-[#64748B] transition hover:bg-slate-100 hover:text-red-500"
          title="Sign out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
