import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Eye, EyeOff, Lock, LogIn, ShieldCheck, Search, FileCheck, Users,
  UserRound, Shield, Sun, Moon, Sparkles, CheckCircle2,
  KeyRound
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { loginUser } from '../services/api'
import { Sentinel3DCore } from '../components/common/Sentinel3DCore'
import { Text3D } from '../components/common/Text3D'

const features = [
  { icon: ShieldCheck, title: 'Role-Based Access', desc: 'Granular clearance filtering per employee role' },
  { icon: Search, title: 'Neural Vector Search', desc: 'Instant precision answers grounded in enterprise docs' },
  { icon: FileCheck, title: 'Visual Evidence', desc: 'Page-level PDF citation and visual source grounding' },
  { icon: Users, title: 'Private Vault', desc: 'Strictly isolated organizational knowledge perimeter' },
]

type Portal = 'employee' | 'admin'

const portalConfig: Record<Portal, {
  title: string
  subtitle: string
  icon: typeof UserRound
  desc: string
}> = {
  employee: {
    title: 'Employee Access',
    subtitle: 'Search authorized policies and company records',
    icon: UserRound,
    desc: 'Access verified company policies, technical docs & conversational AI.',
  },
  admin: {
    title: 'Security Administration',
    subtitle: 'Manage clearances, audit trails, and indexing',
    icon: Shield,
    desc: 'Manage users, clearances, vector re-indexing & live security audit logs.',
  },
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [portal, setPortal] = useState<Portal>('employee')

  const cfg = portalConfig[portal]

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectPortal = (p: Portal) => {
    setPortal(p)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const user = await loginUser(username, password)
      if (!user) {
        setError('Invalid credentials. Please verify your username and password.')
        setLoading(false)
        return
      }

      login(user)
      const isPrivileged = user.role === 'manager' || user.role === 'admin'
      navigate(isPrivileged ? '/dashboard' : '/search', { replace: true })
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials. Please verify your username and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors antialiased selection:bg-blue-600 selection:text-white">
      {/* Ambient Background Lights */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/[0.05] dark:bg-blue-600/[0.05] blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/[0.04] dark:bg-indigo-600/[0.05] blur-[140px]" />

      {/* Top Header */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-5 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-base shadow-sm">
            S
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              Sentinel AI
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Enterprise Knowledge Vault</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 px-3.5 py-1 text-xs text-slate-600 dark:text-slate-400 shadow-sm">
            <KeyRound className="h-3.5 w-3.5 text-blue-500" />
            <span>Encrypted Session</span>
          </div>
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 transition-colors hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white shadow-sm"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Main Content Showcase */}
      <div className="relative z-10 flex min-h-screen w-full flex-col lg:flex-row pt-20 lg:pt-0">
        {/* Left Side — Executive Showcase */}
        <div className="relative flex w-full flex-col justify-between p-8 lg:w-7/12 lg:p-14">
          <div className="my-auto flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-3.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-blue-500" />
              <span>Verified Enterprise Knowledge Intelligence</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl leading-[1.15]">
              Private Intelligence.<br />
              <Text3D color="ocean" className="block sm:inline">
                Fortified by Design.
              </Text3D>
            </h1>

            <p className="mt-4 max-w-xl text-base text-slate-600 dark:text-slate-400 sm:text-lg leading-relaxed">
              AI-driven semantic retrieval with verified source citations, guaranteed role-based isolation,
              and immutable compliance audit trails.
            </p>

            {/* 3D Security Vault Emblem */}
            <div className="my-8 flex w-full justify-center lg:justify-start">
              <Sentinel3DCore size="hero" interactive={true} showTelemetry={true} />
            </div>

            {/* Feature Highlights */}
            <div className="grid w-full max-w-xl grid-cols-2 gap-3 pt-2">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-slate-200/90 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/60 p-3.5 transition-colors hover:border-blue-400/40 shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <f.icon className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{f.title}</p>
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800/80 pt-4 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Vector RAG Ready
              </span>
              <span>•</span>
              <span>Role Clearance Active</span>
            </div>
            <span>Sentinel v2.4 Enterprise</span>
          </div>
        </div>

        {/* Right Side — High-End Authentication Card */}
        <div className="relative flex w-full items-center justify-center p-6 lg:w-5/12 lg:p-12">
          <div className="w-full max-w-md">
            {/* Clean Enterprise Card */}
            <div className="relative rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/95 p-8 shadow-xl shadow-slate-200/60 dark:shadow-2xl backdrop-blur-xl">
              {/* Segmented Portal Switcher */}
              <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800">
                {(Object.keys(portalConfig) as Portal[]).map((p) => {
                  const pc = portalConfig[p]
                  const active = portal === p
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => selectPortal(p)}
                      className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium transition-all ${
                        active
                          ? 'bg-blue-600 text-white shadow-sm font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-900'
                      }`}
                    >
                      <pc.icon className="h-3.5 w-3.5" />
                      {p === 'employee' ? 'Employee' : 'Admin'}
                    </button>
                  )
                })}
              </div>

              {/* Portal Header */}
              <div className="mt-6 flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-500 border border-blue-500/20">
                  <cfg.icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{cfg.title}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{cfg.subtitle}</p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Work email or username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 pr-10 transition-colors focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      if (portal === 'admin') {
                        setUsername('admin@sentinel.ai')
                        setPassword('AdminPassword123!')
                      } else {
                        setUsername('emily@company.com')
                        setPassword('password123')
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Auto-fill {portal === 'admin' ? 'Admin' : 'Employee'} credentials</span>
                  </button>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                    {portal === 'admin' ? 'admin@sentinel.ai' : 'emily@company.com'}
                  </span>
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 p-2.5 text-xs text-rose-600 dark:text-rose-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-2.5 text-sm"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </form>

              {/* Security Footer */}
              <div className="mt-5 flex items-center justify-center gap-2 border-t border-slate-200 dark:border-slate-800 pt-3.5 text-[11px] text-slate-500 dark:text-slate-400">
                <Lock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                <span>Encrypted enterprise authentication</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
