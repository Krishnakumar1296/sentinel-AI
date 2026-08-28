import { Lock, FileSearch, AlertTriangle } from 'lucide-react'

const problems = [
  {
    icon: <Lock className="w-7 h-7" />,
    title: 'Unprotected Sensitive Data',
    description:
      'Standard AI search may expose restricted HR, financial, executive, or legal documents without proper role-based controls — creating serious compliance and security risks.',
    tag: 'Security Risk',
    tagColor: 'text-red-600 bg-red-50 border-red-100',
    iconBg: 'from-red-500 to-rose-600',
    border: 'hover:border-red-200',
    illustration: (
      <svg viewBox="0 0 200 120" className="w-full h-24 opacity-60" fill="none">
        <rect x="20" y="20" width="160" height="80" rx="12" fill="#FEE2E2" stroke="#FCA5A5" strokeWidth="1.5"/>
        <rect x="40" y="40" width="80" height="10" rx="5" fill="#FCA5A5"/>
        <rect x="40" y="58" width="120" height="6" rx="3" fill="#FECACA"/>
        <rect x="40" y="72" width="100" height="6" rx="3" fill="#FECACA"/>
        <circle cx="155" cy="35" r="18" fill="#EF4444" opacity="0.8"/>
        <path d="M149 35 L153 39 L161 31" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="155" cy="35" r="10" stroke="white" strokeWidth="1.5" fill="none"/>
        <path d="M148 28 L162 42" stroke="white" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    icon: <FileSearch className="w-7 h-7" />,
    title: 'No Visual Verification',
    description:
      'Text-only AI answers make it nearly impossible for employees to verify whether the response is actually supported by the source document — eroding trust in AI-generated outputs.',
    tag: 'Trust Issue',
    tagColor: 'text-amber-600 bg-amber-50 border-amber-100',
    iconBg: 'from-amber-500 to-orange-600',
    border: 'hover:border-amber-200',
    illustration: (
      <svg viewBox="0 0 200 120" className="w-full h-24 opacity-60" fill="none">
        <rect x="20" y="15" width="90" height="90" rx="10" fill="#FEF3C7" stroke="#FCD34D" strokeWidth="1.5"/>
        <rect x="35" y="30" width="60" height="7" rx="3.5" fill="#FCD34D"/>
        <rect x="35" y="46" width="55" height="5" rx="2.5" fill="#FDE68A"/>
        <rect x="35" y="58" width="50" height="5" rx="2.5" fill="#FDE68A"/>
        <rect x="35" y="70" width="45" height="5" rx="2.5" fill="#FDE68A"/>
        <rect x="120" y="30" width="60" height="60" rx="10" fill="white" stroke="#E5E7EB" strokeWidth="1.5"/>
        <rect x="130" y="44" width="40" height="6" rx="3" fill="#E5E7EB"/>
        <rect x="130" y="56" width="35" height="4" rx="2" fill="#F3F4F6"/>
        <rect x="130" y="64" width="30" height="4" rx="2" fill="#F3F4F6"/>
        <path d="M115 60 L120 60" stroke="#D97706" strokeWidth="2" strokeDasharray="3 2"/>
        <circle cx="112" cy="60" r="6" fill="#F59E0B" opacity="0.8"/>
        <path d="M109 60 L115 60" stroke="white" strokeWidth="1.5"/>
        <line x1="109" y1="60" x2="115" y2="60" stroke="#F59E0B" strokeWidth="1"/>
      </svg>
    ),
  },
  {
    icon: <AlertTriangle className="w-7 h-7" />,
    title: 'Hidden Knowledge Gaps',
    description:
      'Failed searches disappear into thin air instead of helping managers identify which documents, policies, or procedures are missing from the knowledge base.',
    tag: 'Visibility Gap',
    tagColor: 'text-violet-600 bg-violet-50 border-violet-100',
    iconBg: 'from-violet-500 to-purple-600',
    border: 'hover:border-violet-200',
    illustration: (
      <svg viewBox="0 0 200 120" className="w-full h-24 opacity-60" fill="none">
        <rect x="20" y="80" width="20" height="25" rx="4" fill="#DDD6FE"/>
        <rect x="50" y="55" width="20" height="50" rx="4" fill="#C4B5FD"/>
        <rect x="80" y="40" width="20" height="65" rx="4" fill="#A78BFA"/>
        <rect x="110" y="60" width="20" height="45" rx="4" fill="none" stroke="#C4B5FD" strokeDasharray="4 2" strokeWidth="1.5"/>
        <rect x="140" y="35" width="20" height="70" rx="4" fill="#7C3AED"/>
        <path d="M30 60 L60 38 L90 25 L120 42 L150 20" stroke="#7C3AED" strokeWidth="2" strokeDasharray="4 2" fill="none"/>
        <circle cx="120" cy="42" r="4" fill="#EF4444"/>
        <line x1="117" y1="39" x2="123" y2="45" stroke="white" strokeWidth="1.5"/>
        <line x1="117" y1="45" x2="123" y2="39" stroke="white" strokeWidth="1.5"/>
      </svg>
    ),
  },
]

export default function ProblemSection() {
  return (
    <section className="section-padding bg-gradient-to-b from-white to-slate-50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="badge mx-auto mb-5 w-fit">The Problem</div>
          <h2 className="section-title mb-5 max-w-3xl mx-auto">
            Enterprise Knowledge Shouldn't Come{' '}
            <span className="gradient-text">With Security Risks</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Traditional AI search systems create serious security, verification, and knowledge visibility problems for enterprise organizations.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((p) => (
            <div
              key={p.title}
              className={`card p-7 border border-slate-100 ${p.border} transition-all duration-300 group`}
            >
              {/* Tag */}
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${p.tagColor} mb-4`}>
                {p.tag}
              </span>

              {/* Illustration */}
              <div className="mb-4 rounded-xl overflow-hidden bg-slate-50/50 p-2">
                {p.illustration}
              </div>

              {/* Icon */}
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.iconBg} flex items-center justify-center text-white mb-4 shadow-md`}>
                {p.icon}
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-3">{p.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
