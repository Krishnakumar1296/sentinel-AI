import { Shield, User, Key, FileText, Search, Lock } from 'lucide-react'

const shieldLayers = [
  { label: 'AUTH', angle: 0, color: '#3B82F6' },
  { label: 'RBAC', angle: 60, color: '#7C3AED' },
  { label: 'PRIVATE DATA', angle: 120, color: '#06B6D4' },
  { label: 'VECTOR SEARCH', angle: 180, color: '#4F46E5' },
  { label: 'AUDIT', angle: 240, color: '#8B5CF6' },
  { label: 'AI', angle: 300, color: '#2563EB' },
]

const outerItems = [
  { label: 'User Identity', icon: <User className="w-4 h-4" />, position: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' },
  { label: 'Role Permissions', icon: <Key className="w-4 h-4" />, position: 'top-1/4 right-0 translate-x-1/2' },
  { label: 'Document Permissions', icon: <FileText className="w-4 h-4" />, position: 'bottom-1/4 right-0 translate-x-1/2' },
  { label: 'Retrieval Filtering', icon: <Search className="w-4 h-4" />, position: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2' },
  { label: 'Secure AI Response', icon: <Lock className="w-4 h-4" />, position: 'top-1/4 left-0 -translate-x-1/2' },
]

export default function SecuritySection() {
  return (
    <section id="security" className="section-padding bg-gradient-to-br from-slate-900 via-navy-900 to-slate-900 relative overflow-hidden">
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Background glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-5">
            <Shield className="w-3.5 h-3.5" />
            SECURITY FOUNDATION
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
            Security Isn't a Feature.{' '}
            <br />
            <span className="gradient-text">It's the Foundation.</span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-xl mx-auto">
            Every layer of Sentinel AI is engineered with security as the primary constraint. Not an afterthought — the core architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Shield visualization */}
          <div className="flex justify-center">
            <div className="relative w-72 h-72 lg:w-80 lg:h-80">
              {/* Outer floating items */}
              {outerItems.map((item, i) => {
                const angle = (i * 360) / outerItems.length
                const rad = (angle * Math.PI) / 180
                const r = 155
                const x = 50 + (r / 160) * 50 * Math.sin(rad)
                const y = 50 - (r / 160) * 50 * Math.cos(rad)
                return (
                  <div
                    key={item.label}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 backdrop-blur-sm whitespace-nowrap shadow-lg">
                      <span className="text-blue-400">{item.icon}</span>
                      <span className="text-[10px] font-semibold text-slate-300">{item.label}</span>
                    </div>
                  </div>
                )
              })}

              {/* Main shield */}
              <div className="absolute inset-8">
                <svg viewBox="0 0 200 240" className="w-full h-full shield-glow" fill="none">
                  {/* Shield outer */}
                  <path
                    d="M100 10 L185 45 L185 120 C185 165 145 200 100 225 C55 200 15 165 15 120 L15 45 Z"
                    fill="url(#shieldGrad)"
                    stroke="url(#shieldStroke)"
                    strokeWidth="2"
                  />
                  {/* Shield inner */}
                  <path
                    d="M100 30 L170 58 L170 118 C170 155 138 185 100 205 C62 185 30 155 30 118 L30 58 Z"
                    fill="url(#shieldInner)"
                    stroke="rgba(59,130,246,0.3)"
                    strokeWidth="1"
                  />

                  {/* Inner labels */}
                  {shieldLayers.map((layer, i) => {
                    const rows = [0, 1, 2, 3, 4, 5]
                    const col = i % 2
                    const row = Math.floor(i / 2)
                    const x = col === 0 ? 55 : 115
                    const y = 75 + row * 38
                    return (
                      <g key={layer.label}>
                        <rect x={x - 5} y={y - 11} width={col === 0 ? 50 : 60} height={18} rx="5" fill={layer.color} fillOpacity="0.2" stroke={layer.color} strokeOpacity="0.5" strokeWidth="0.8" />
                        <text x={x + (col === 0 ? 20 : 25)} y={y + 2} textAnchor="middle" fill={layer.color} fontSize="8" fontWeight="700" fontFamily="monospace">
                          {layer.label}
                        </text>
                      </g>
                    )
                  })}

                  <defs>
                    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1E2A6E" />
                      <stop offset="100%" stopColor="#0A0F2C" />
                    </linearGradient>
                    <linearGradient id="shieldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                    <linearGradient id="shieldInner" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1a2455" />
                      <stop offset="100%" stopColor="#0d1530" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div>
            {/* Core statement */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-500/20 p-6 mb-8">
              <p className="text-xl font-bold text-white mb-2">
                Authorization → Retrieval → Generation
              </p>
              <p className="text-slate-400 text-sm">
                Never retrieve what the user is not authorized to see.
              </p>
            </div>

            {/* Security pillars */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Zero-Trust Architecture', desc: 'Every request verified', icon: '🔐' },
                { label: 'End-to-End Encryption', desc: 'Data in transit & at rest', icon: '🔒' },
                { label: 'Audit Trail', desc: 'Complete query log', icon: '📋' },
                { label: 'Private Deployment', desc: 'No external data sharing', icon: '🏛️' },
                { label: 'RBAC Enforcement', desc: 'Granular permissions', icon: '👥' },
                { label: 'Source Attribution', desc: 'Verified answer grounding', icon: '📄' },
              ].map((item) => (
                <div key={item.label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3.5 hover:border-blue-500/40 transition-colors duration-200">
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="text-xs font-bold text-white mb-0.5">{item.label}</div>
                  <div className="text-[10px] text-slate-400">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
