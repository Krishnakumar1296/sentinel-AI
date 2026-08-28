import { Shield, CheckCircle2, ArrowRight } from 'lucide-react'

const pipelineSteps = [
  { label: 'USER', color: 'from-blue-500 to-blue-600', description: 'Authenticated identity' },
  { label: 'AUTHENTICATION', color: 'from-indigo-500 to-indigo-600', description: 'Identity verified' },
  { label: 'ROLE CHECK', color: 'from-violet-500 to-violet-600', description: 'Permissions evaluated' },
  { label: 'AUTHORIZED DOCS', color: 'from-purple-500 to-purple-600', description: 'Scope filtered', highlight: true },
  { label: 'SEMANTIC RETRIEVAL', color: 'from-cyan-500 to-cyan-600', description: 'Relevant chunks found' },
  { label: 'AI GENERATION', color: 'from-blue-500 to-blue-600', description: 'Answer synthesized' },
  { label: 'VISUAL SOURCE PROOF', color: 'from-emerald-500 to-emerald-600', description: 'Evidence provided' },
]

const highlights = [
  'Authorization enforced before any retrieval begins',
  'Document scope limited by user role and permissions',
  'Every answer paired with verifiable source evidence',
  'Sensitive documents never enter the retrieval pipeline',
]

export default function SolutionSection() {
  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Pipeline Visualization */}
          <div className="relative">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-violet-100/30 to-cyan-100/20 rounded-3xl blur-2xl" />

            <div className="relative bg-gradient-to-br from-slate-900 to-navy-900 rounded-3xl p-8 overflow-hidden border border-slate-800">
              {/* Grid overlay */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Shield backdrop */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-5">
                <Shield className="w-48 h-48 text-white" />
              </div>

              {/* Header */}
              <div className="relative mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-400 tracking-widest uppercase">Secure Pipeline</span>
                </div>
                <p className="text-white text-sm font-bold">Authorization → Retrieval → Generation</p>
              </div>

              {/* Pipeline */}
              <div className="relative flex flex-col gap-1">
                {pipelineSteps.map((step, i) => (
                  <div key={step.label} className="relative">
                    <div
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                        step.highlight
                          ? 'bg-gradient-to-r from-blue-500/20 to-violet-500/20 border border-blue-500/30'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      {/* Step number */}
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                        <span className="text-white text-[10px] font-black">{String(i + 1).padStart(2, '0')}</span>
                      </div>

                      <div className="flex-1">
                        <span className="text-white text-xs font-bold tracking-wide">{step.label}</span>
                        <div className="text-slate-400 text-[10px] mt-0.5">{step.description}</div>
                      </div>

                      {step.highlight && (
                        <div className="flex-shrink-0">
                          <Shield className="w-4 h-4 text-blue-400" />
                        </div>
                      )}
                    </div>

                    {/* Connector */}
                    {i < pipelineSteps.length - 1 && (
                      <div className="flex items-center justify-center ml-4 my-0.5">
                        <div className="w-0.5 h-3 bg-gradient-to-b from-slate-600 to-slate-700 relative">
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-500/60" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Warning notice */}
              <div className="relative mt-6 rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3">
                <p className="text-amber-400 text-xs font-semibold text-center">
                  ⚠️ Authorization happens BEFORE retrieval — always.
                </p>
              </div>
            </div>
          </div>

          {/* Right — Content */}
          <div>
            <div className="badge mb-6 w-fit">The Solution</div>
            <h2 className="section-title mb-6">
              One Secure Layer Between{' '}
              <span className="gradient-text">Your Questions and Enterprise Knowledge</span>
            </h2>
            <p className="text-slate-500 text-base leading-relaxed mb-8">
              Sentinel AI enforces a strict authorization-first pipeline. Before any document is retrieved, the user's identity is verified and their permissions are evaluated. Only then does semantic search occur — exclusively within their authorized document scope.
            </p>

            {/* Highlights */}
            <div className="flex flex-col gap-4 mb-8">
              {highlights.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <span className="text-sm text-slate-700 font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* Core principle box */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 border border-blue-100 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Core Security Principle</span>
              </div>
              <p className="text-slate-800 font-semibold text-sm leading-relaxed">
                USER AUTHORIZATION → DOCUMENT ACCESS FILTERING → RETRIEVAL → AI ANSWER
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Never allow retrieval before authorization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
