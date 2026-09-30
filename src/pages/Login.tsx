import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye, EyeOff, Lock, LogIn, ShieldCheck, Search, FileCheck, Users,
  UserRound, Shield, Sun, Moon, Sparkles, CheckCircle2,
  KeyRound
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { loginUser } from '../services/api'
import { Text3D } from '../components/common/Text3D'

const features = [
  { icon: ShieldCheck, title: 'Role-Based Access', desc: 'Granular clearance filtering per employee role' },
  { icon: Search, title: 'Neural Vector Search', desc: 'Instant precision answers grounded in enterprise docs' },
  { icon: FileCheck, title: 'Visual Evidence', desc: 'Page-level PDF citation and visual source grounding' },
  { icon: Users, title: 'Private Vault', desc: 'Strictly isolated organizational knowledge perimeter' },
]

type Portal = 'employee' | 'manager' | 'admin'

const portalConfig: Record<Portal, {
  title: string
  subtitle: string
  icon: typeof UserRound
  desc: string
  defaultEmail: string
  defaultPass: string
}> = {
  employee: {
    title: 'Employee Access',
    subtitle: 'Search authorized policies and company records',
    icon: UserRound,
    desc: 'Access verified company policies, technical docs & conversational AI.',
    defaultEmail: 'emily@company.com',
    defaultPass: 'password123',
  },
  manager: {
    title: 'Department Manager',
    subtitle: 'Upload documents, view gap analytics & approve requests',
    icon: KeyRound,
    desc: 'Manage departmental document vaults, gap metrics, and knowledge requests.',
    defaultEmail: 'sarah@company.com',
    defaultPass: 'password123',
  },
  admin: {
    title: 'Security Administration',
    subtitle: 'Manage clearances, audit trails, and zero-trust controls',
    icon: Shield,
    desc: 'Manage users, clearances, vector re-indexing & live security audit logs.',
    defaultEmail: 'admin@sentinel.ai',
    defaultPass: 'AdminPassword123!',
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
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 dark:bg-[#212121] font-sans text-slate-900 dark:text-[#ececec] transition-colors antialiased selection:bg-neutral-700 selection:text-white">
      {/* Ambient Background Lights */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.02] blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-[500px] w-[500px] rounded-full bg-neutral-500/[0.03] blur-[140px]" />

      {/* Top Header */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-5 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 dark:bg-[#262626] border dark:border-white/[0.12] text-white font-bold text-base shadow-sm">
            S
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-[#ececec]">
              Sentinel AI
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-[#8e8e8e]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Enterprise Knowledge Vault</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/[0.08] bg-white/90 dark:bg-[#262626] px-3.5 py-1 text-xs text-slate-600 dark:text-[#b4b4b4] shadow-sm">
            <KeyRound className="h-3.5 w-3.5 text-blue-500 dark:text-emerald-400" />
            <span>Encrypted Session</span>
          </div>
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#262626] text-slate-600 dark:text-[#b4b4b4] transition-colors hover:border-slate-300 dark:hover:border-white/[0.18] hover:text-slate-900 dark:hover:text-white shadow-sm"
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
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/[0.08] bg-white/90 dark:bg-[#262626] px-3.5 py-1 text-xs font-medium text-slate-600 dark:text-[#b4b4b4] shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-blue-500 dark:text-emerald-400" />
              <span>Verified Enterprise Knowledge Intelligence</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-[#ececec] sm:text-5xl lg:text-6xl leading-[1.15]">
              Private Intelligence.<br />
              <Text3D color="ocean" className="block sm:inline">
                Fortified by Design.
              </Text3D>
            </h1>

            <p className="mt-4 max-w-xl text-base text-slate-600 dark:text-[#8e8e8e] sm:text-lg leading-relaxed">
              AI-driven semantic retrieval with verified source citations, guaranteed role-based isolation,
              and immutable compliance audit trails.
            </p>

            {/* Feature Highlights */}
            <div className="grid w-full max-w-xl grid-cols-2 gap-3 pt-2">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border border-slate-200/90 dark:border-white/[0.08] bg-white/90 dark:bg-[#262626] p-3.5 transition-colors hover:border-slate-300 dark:hover:border-white/[0.18] shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-[#2f2f2f] dark:text-emerald-400">
                      <f.icon className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-[#ececec]">{f.title}</p>
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-500 dark:text-[#8e8e8e] leading-snug">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 dark:border-white/[0.08] pt-4 text-[11px] text-slate-500 dark:text-[#8e8e8e]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-[#b4b4b4] font-medium">
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
            <div className="relative rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#171717] p-8 shadow-xl backdrop-blur-xl">
              {/* Segmented Portal Switcher with layoutId Pill */}
              <div className="relative grid grid-cols-3 gap-1 rounded-xl bg-slate-100 dark:bg-[#262626] p-1 border border-slate-200 dark:border-white/[0.08]">
                {(Object.keys(portalConfig) as Portal[]).map((p) => {
                  const pc = portalConfig[p]
                  const active = portal === p
                  const label = p === 'employee' ? 'Employee' : p === 'manager' ? 'Manager' : 'Admin'
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => selectPortal(p)}
                      className={`relative flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-colors z-10 ${
                        active
                          ? 'text-white font-semibold'
                          : 'text-slate-600 dark:text-[#8e8e8e] hover:text-slate-900 dark:hover:text-[#ececec]'
                      }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="portalTabPill"
                          className="absolute inset-0 rounded-lg bg-blue-600 dark:bg-[#2f2f2f] dark:border dark:border-white/[0.12] shadow-sm -z-10"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <pc.icon className="h-3.5 w-3.5" />
                      <span className="truncate">{label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Portal Header */}
              <motion.div
                key={portal}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-6 flex items-center gap-3.5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-[#262626] dark:text-emerald-400 border border-blue-500/20 dark:border-white/[0.1]">
                  <cfg.icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-[#ececec] tracking-tight">{cfg.title}</h2>
                  <p className="text-xs text-slate-500 dark:text-[#8e8e8e]">{cfg.subtitle}</p>
                </div>
              </motion.div>

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
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 pr-10 transition-all duration-200 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      required
                    />
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </motion.button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      setUsername(cfg.defaultEmail)
                      setPassword(cfg.defaultPass)
                    }}
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Auto-fill {portal === 'admin' ? 'Admin' : portal === 'manager' ? 'Manager' : 'Employee'}</span>
                  </motion.button>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                    {cfg.defaultEmail}
                  </span>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -4 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 p-2.5 text-xs text-rose-600 dark:text-rose-300 overflow-hidden"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15 }}
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
                </motion.button>
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

