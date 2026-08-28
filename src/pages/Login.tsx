import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, LogIn, ShieldCheck, Search, FileCheck, Users, UserRound, Shield, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../services/api'

const features = [
  { icon: ShieldCheck, title: 'Role-Based Security', desc: 'Every query filtered by your access level' },
  { icon: Search, title: 'AI-Powered Knowledge Search', desc: 'Instant answers from trusted documents' },
  { icon: FileCheck, title: 'Visual Answer Verification', desc: 'See the exact PDF page as evidence' },
  { icon: Users, title: 'Private Enterprise Knowledge', desc: 'Secure vault for company intelligence' },
]

type Portal = 'employee' | 'admin'

const portalConfig: Record<Portal, {
  title: string
  subtitle: string
  icon: typeof UserRound
  accent: string
  desc: string
  email: string
  password: string
}> = {
  employee: {
    title: 'Employee Portal',
    subtitle: 'Search knowledge & use your workspace',
    icon: UserRound,
    accent: 'from-blue-500 to-indigo-600',
    desc: 'Access confidential policy documents and AI-powered knowledge search.',
    email: 'emily@company.com',
    password: 'password123',
  },
  admin: {
    title: 'Admin Portal',
    subtitle: 'Full access & administration',
    icon: Shield,
    accent: 'from-rose-500 to-red-600',
    desc: 'Manage users, roles, security, analytics and the knowledge base.',
    email: 'krishna@company.com',
    password: 'password123',
  },
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [portal, setPortal] = useState<Portal>('employee')
  const cfg = portalConfig[portal]
  const [email, setEmail] = useState(cfg.email)
  const [password, setPassword] = useState(cfg.password)
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selectPortal = (p: Portal) => {
    setPortal(p)
    setEmail(portalConfig[p].email)
    setPassword(portalConfig[p].password)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await loginUser(email, password)
      if (!user) {
        setError('Invalid email or password')
        return
      }
      if (portal === 'admin' && user.role !== 'admin') {
        setError('This account does not have admin access. Use the Employee Portal.')
        return
      }
      if (portal === 'employee' && user.role === 'admin') {
        setError('Administrator account detected. Please use the Admin Portal.')
        return
      }
      login(user)
      navigate(user.role === 'admin' || user.role === 'manager' ? '/dashboard' : '/search')
    } catch {
      setError('Sign in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left — corporate visuals */}
      <div className="corp-bg-dark relative hidden w-1/2 flex-col justify-between p-12 lg:flex">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-bold text-[#123B5D] shadow-lg">
              S
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight text-white">SENTINEL AI</p>
              <p className="text-xs font-medium uppercase tracking-widest text-blue-100">Secure Enterprise Knowledge Intelligence</p>
            </div>
          </div>

          <div className="mt-24 max-w-lg">
            <h1 className="text-4xl font-bold leading-tight text-white">
              Search your organization's knowledge securely.
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-blue-100">
              AI-powered answers, role-based access, and verifiable document evidence — for your enterprise.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {features.map((f) => (
                <div key={f.title} className="flex gap-3 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-blue-200" />
                  <div>
                    <p className="text-sm font-semibold text-white">{f.title}</p>
                    <p className="mt-0.5 text-xs text-blue-100/90">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-blue-100/80">
          © {new Date().getFullYear()} Sentinel AI. Confidential. For authorized enterprise use only.
        </div>
      </div>

      {/* Right — login card */}
      <div className="flex w-full items-center justify-center bg-[#F7F9FC] px-6 py-10 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-xl font-bold text-white">S</div>
            <p className="mt-3 text-lg font-bold tracking-tight text-[#123B5D]">SENTINEL AI</p>
          </div>

          <div className="card p-8 shadow-card-md">
            <div className="mb-6 flex items-center justify-center">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${cfg.accent} text-white shadow-lg`}>
                <cfg.icon className="h-7 w-7" />
              </div>
            </div>

            <h2 className="text-center text-2xl font-bold text-[#172033]">{cfg.title}</h2>
            <p className="mt-1 text-center text-sm text-[#64748B]">{cfg.subtitle}</p>

            {/* Portal selector */}
            <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1.5">
              {(Object.keys(portalConfig) as Portal[]).map((p) => {
                const pc = portalConfig[p]
                const active = portal === p
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => selectPortal(p)}
                    className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      active ? 'bg-white text-[#172033] shadow-sm' : 'text-[#64748B] hover:text-[#172033]'
                    }`}
                  >
                    <pc.icon className={`h-4 w-4 ${active ? '' : 'opacity-60'}`} />
                    {pc.title.split(' ')[0]}
                  </button>
                )
              })}
            </div>

            <p className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-[#64748B]">
              <Lock className="h-3.5 w-3.5 shrink-0" />
              {cfg.desc}
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="input pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" /> Sign in to {cfg.title.split(' ')[0]}
                  </>
                )}
              </button>

              <div className="text-center">
                <button type="button" className="flex items-center justify-center gap-1 text-sm font-medium text-[#64748B] hover:text-[#2563EB]">
                  <ArrowLeft className="h-3.5 w-3.5" /> Forgot password?
                </button>
              </div>
            </form>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <div className="flex items-center justify-center gap-2 text-xs text-[#64748B]">
                <Lock className="h-3.5 w-3.5" />
                Secure enterprise authentication
              </div>
              <p className="mt-1.5 text-center text-xs text-[#64748B]">Your access is protected by role-based security</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
