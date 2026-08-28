import { Link } from 'react-router-dom'
import { ChevronRight, CheckCircle2, Shield, Brain, Database, Lock, Search } from 'lucide-react'

const trustItems = [
  'Role-Based Access',
  'Private Document Vault',
  'Visual Source Proof',
]

const floatingCards = [
  { label: 'RBAC Protected', value: 'Active', color: 'blue', icon: <Shield className="w-4 h-4" /> },
  { label: 'Answer Confidence', value: '98.7%', color: 'violet', icon: <Brain className="w-4 h-4" /> },
  { label: 'Documents Indexed', value: '1,248', color: 'cyan', icon: <Database className="w-4 h-4" /> },
]

function HeroIllustration() {
  return (
    <div className="relative w-full max-w-[540px] mx-auto">
      {/* Outer glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 via-violet-200/20 to-cyan-200/20 rounded-3xl blur-3xl scale-110" />

      {/* Main dashboard card */}
      <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-slate-800 tracking-wider uppercase">Sentinel AI</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-600 font-medium">Secure Session</span>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative mb-5">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
            <Search className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">What is the employee leave policy?</span>
          </div>
        </div>

        {/* AI Response card */}
        <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl p-4 mb-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
              <Brain className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-semibold text-blue-700">AI Answer</span>
            <span className="ml-auto text-xs text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Verified
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Employees are eligible for <strong>18 days</strong> of annual leave per year, accrued monthly. Additional sick leave of 12 days applies...
          </p>
        </div>

        {/* Source card */}
        <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center">
              <span className="text-red-500 text-[8px] font-bold">PDF</span>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800">Employee_Handbook.pdf</div>
              <div className="text-[10px] text-slate-400">Page 24 · HR Policy</div>
            </div>
          </div>
          <div className="text-xs text-blue-600 font-medium flex items-center gap-1 cursor-pointer hover:text-blue-700">
            View Source <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between text-center">
          <div>
            <div className="text-sm font-bold text-slate-800">96%</div>
            <div className="text-[10px] text-slate-400">Confidence</div>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <div className="text-sm font-bold text-slate-800">1.2s</div>
            <div className="text-[10px] text-slate-400">Response</div>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <div className="text-sm font-bold emerald-600 text-emerald-600">✓</div>
            <div className="text-[10px] text-slate-400">Source Verified</div>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <div className="text-sm font-bold text-slate-800">RBAC</div>
            <div className="text-[10px] text-slate-400">Enforced</div>
          </div>
        </div>

        {/* Security indicator  */}
        <div className="absolute top-4 right-4 w-16 h-16 opacity-5">
          <Shield className="w-full h-full text-blue-600" />
        </div>
      </div>

      {/* Floating cards */}
      <div className="absolute -left-4 top-12 animate-float">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 px-3 py-2.5 flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Access</div>
            <div className="text-xs font-bold text-slate-800">RBAC Active</div>
          </div>
        </div>
      </div>

      <div className="absolute -right-4 top-1/3 animate-float-delayed">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 px-3 py-2.5 flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Confidence</div>
            <div className="text-xs font-bold text-slate-800">98.7%</div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-4 left-1/4 animate-float-slow">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 px-3 py-2.5 flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Documents</div>
            <div className="text-xs font-bold text-slate-800">1,248 Indexed</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-[#0A2540]"
    >
      {/* Dark building background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(10,37,64,0.2), rgba(18,59,93,0.35)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Decorative background blobs */}
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-600/20 to-violet-600/20 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />

      {/* Particle dots */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-blue-400/40 particle"
          style={{
            left: `${15 + i * 13}%`,
            top: `${20 + (i % 3) * 20}%`,
            animationDelay: `${i * 0.8}s`,
          }}
        />
      ))}

      <div className="container-custom w-full py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <div className="max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-cyan-300 bg-white/10 border border-white/20 mb-6 w-fit">
              <Shield className="w-3.5 h-3.5" />
              SECURE ENTERPRISE AI
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
              Your Enterprise Knowledge.{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Secured by Intelligence.
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              Search internal company knowledge with confidence. Sentinel AI combines role-based security, intelligent document retrieval, and visual source verification in one secure platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link to="/login" className="btn-primary text-base py-3.5 px-7 justify-center">
                Get Started
                <ChevronRight className="w-5 h-5" />
              </Link>
              <button
                onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary text-base py-3.5 px-7 justify-center"
              >
                Explore Platform
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-5">
              {trustItems.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Illustration */}
          <div className="hidden lg:block">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  )
}
