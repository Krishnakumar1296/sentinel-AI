import { Shield, Eye, Database, Search, AlertTriangle, Activity, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    category: 'Access Control',
    title: 'Role-Based Access Control',
    description: 'Search results are filtered according to the user\'s role and permissions — unauthorized documents remain invisible.',
    gradient: 'from-blue-500 to-blue-600',
    hoverGlow: 'hover:shadow-glow-blue',
  },
  {
    icon: <Eye className="w-6 h-6" />,
    category: 'Verification',
    title: 'Visual Document Grounding',
    description: 'Display the exact PDF page used to generate each answer, so users can verify AI responses directly.',
    gradient: 'from-violet-500 to-violet-600',
    hoverGlow: 'hover:shadow-glow-violet',
  },
  {
    icon: <Database className="w-6 h-6" />,
    category: 'Privacy',
    title: 'Private Vector Vault',
    description: 'Keep enterprise knowledge inside a protected private vector database — never shared with external AI providers.',
    gradient: 'from-cyan-500 to-cyan-600',
    hoverGlow: 'hover:shadow-glow-blue',
  },
  {
    icon: <Search className="w-6 h-6" />,
    category: 'Intelligence',
    title: 'Semantic Document Search',
    description: 'Find relevant information using semantic similarity instead of simple keyword matching for far more accurate results.',
    gradient: 'from-indigo-500 to-indigo-600',
    hoverGlow: 'hover:shadow-glow-violet',
  },
  {
    icon: <AlertTriangle className="w-6 h-6" />,
    category: 'Analytics',
    title: 'Knowledge Gap Detection',
    description: 'Capture unanswered questions and surface missing documentation so managers can close knowledge gaps proactively.',
    gradient: 'from-amber-500 to-orange-600',
    hoverGlow: 'hover:shadow-glow-blue',
  },
  {
    icon: <Activity className="w-6 h-6" />,
    category: 'Quality',
    title: 'AI Faithfulness Analytics',
    description: 'Monitor answer quality, retrieval performance, and source attribution accuracy across all user queries.',
    gradient: 'from-emerald-500 to-teal-600',
    hoverGlow: 'hover:shadow-glow-blue',
  },
]

export default function Features() {
  return (
    <section id="features" className="section-padding bg-gradient-to-b from-slate-50 to-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="badge mx-auto mb-5 w-fit">Features</div>
          <h2 className="section-title mb-5">
            Everything You Need for{' '}
            <span className="gradient-text">Trusted Enterprise AI</span>
          </h2>
          <p className="section-subtitle mx-auto">
            A complete suite of security, intelligence, and analytics tools built specifically for enterprise knowledge management.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`feature-card group border border-slate-100 ${feature.hoverGlow}`}
            >
              {/* Category label */}
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 block">
                {feature.category}
              </span>

              {/* Icon */}
              <div className={`feature-icon bg-gradient-to-br from-slate-50 to-slate-100 group-hover:from-gradient-start group-hover:to-gradient-end`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${feature.gradient} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-base font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">{feature.description}</p>

              {/* Arrow */}
              <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Learn more <ArrowRight className="w-3.5 h-3.5" />
              </div>

              {/* Subtle gradient glow on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
