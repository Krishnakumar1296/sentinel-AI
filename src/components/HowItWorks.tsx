import { LogIn, UserCheck, Search, FileText } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: <LogIn className="w-6 h-6" />,
    title: 'Authenticate',
    description: 'User securely signs into Sentinel AI with enterprise SSO or credentials. Identity is verified before any system access.',
    color: 'from-blue-500 to-blue-600',
    lightColor: 'bg-blue-50 border-blue-100',
    accentText: 'text-blue-600',
  },
  {
    number: '02',
    icon: <UserCheck className="w-6 h-6" />,
    title: 'Authorize',
    description: 'The system evaluates the user\'s role and determines exactly which document categories and files they are permitted to access.',
    color: 'from-violet-500 to-violet-600',
    lightColor: 'bg-violet-50 border-violet-100',
    accentText: 'text-violet-600',
  },
  {
    number: '03',
    icon: <Search className="w-6 h-6" />,
    title: 'Retrieve',
    description: 'Only chunks from the user\'s authorized document set are semantically searched. Unauthorized content is never included in the retrieval pool.',
    color: 'from-cyan-500 to-cyan-600',
    lightColor: 'bg-cyan-50 border-cyan-100',
    accentText: 'text-cyan-600',
  },
  {
    number: '04',
    icon: <FileText className="w-6 h-6" />,
    title: 'Verify',
    description: 'AI generates a precise response with exact document and page evidence. Users can view the source page to confirm every claim.',
    color: 'from-emerald-500 to-emerald-600',
    lightColor: 'bg-emerald-50 border-emerald-100',
    accentText: 'text-emerald-600',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="badge mx-auto mb-5 w-fit">How It Works</div>
          <h2 className="section-title mb-5">
            From Question to{' '}
            <span className="gradient-text">Verified Answer</span>
          </h2>
          <p className="section-subtitle mx-auto">
            A four-step process that guarantees security and transparency at every layer.
          </p>
        </div>

        {/* Steps — Desktop horizontal */}
        <div className="hidden md:block">
          {/* Connector line */}
          <div className="relative mb-8">
            <div className="absolute top-9 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-violet-200 via-cyan-200 to-emerald-200" />
            <div className="grid grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <div key={step.number} className="flex flex-col items-center text-center">
                  {/* Circle */}
                  <div className={`relative w-18 h-18 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg mb-5 z-10`}
                    style={{ width: '4.5rem', height: '4.5rem' }}
                  >
                    {step.icon}
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center">
                      <span className="text-[9px] font-black text-slate-600">{step.number}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Steps — Mobile vertical */}
        <div className="md:hidden flex flex-col gap-6">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {/* Vertical connector */}
              {i < steps.length - 1 && (
                <div className="absolute left-7 top-16 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-violet-200 -mb-6" />
              )}

              <div className={`${step.lightColor} border rounded-2xl p-5`}>
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                    {step.icon}
                  </div>
                  <div>
                    <div className={`text-xs font-black ${step.accentText} mb-1`}>STEP {step.number}</div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-100 rounded-full px-5 py-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-semibold text-slate-700">
              Authorization is enforced at every step — never bypassed.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
