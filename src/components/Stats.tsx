import { Shield, Eye, Database, BarChart3 } from 'lucide-react'

const stats = [
  {
    number: '01',
    icon: <Shield className="w-6 h-6" />,
    title: 'Role-Gated Search',
    description: 'Unauthorized documents remain completely inaccessible — enforced at the retrieval layer.',
    gradient: 'from-blue-500 to-blue-600',
    bg: 'from-blue-50 to-blue-50/50',
    border: 'border-blue-100',
  },
  {
    number: '02',
    icon: <Eye className="w-6 h-6" />,
    title: 'Visual Grounding',
    description: 'Every answer can be verified directly against the source document page.',
    gradient: 'from-violet-500 to-violet-600',
    bg: 'from-violet-50 to-violet-50/50',
    border: 'border-violet-100',
  },
  {
    number: '03',
    icon: <Database className="w-6 h-6" />,
    title: 'Private Knowledge',
    description: 'Enterprise documents stay inside your protected environment — never exposed externally.',
    gradient: 'from-cyan-500 to-cyan-600',
    bg: 'from-cyan-50 to-cyan-50/50',
    border: 'border-cyan-100',
  },
  {
    number: '04',
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Knowledge Analytics',
    description: 'Track unanswered queries and identify missing documentation gaps in real time.',
    gradient: 'from-indigo-500 to-indigo-600',
    bg: 'from-indigo-50 to-indigo-50/50',
    border: 'border-indigo-100',
  },
]

export default function Stats() {
  return (
    <section className="py-16 bg-white border-y border-slate-100">
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.number}
              className={`relative rounded-2xl bg-gradient-to-br ${stat.bg} border ${stat.border} p-6 overflow-hidden group hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}
            >
              {/* Number watermark */}
              <span className="absolute top-3 right-4 text-4xl font-black text-slate-100 select-none">
                {stat.number}
              </span>

              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white mb-4 shadow-md`}>
                {stat.icon}
              </div>

              {/* Content */}
              <h3 className="text-sm font-bold text-slate-800 mb-1.5">{stat.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
