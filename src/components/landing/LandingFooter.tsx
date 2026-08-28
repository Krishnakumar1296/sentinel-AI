import { Link } from 'react-router-dom'
import { Shield, Lock, CheckCircle2 } from 'lucide-react'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'AI Knowledge Search', href: '/login' },
      { label: 'Documents', href: '/login' },
      { label: 'Analytics', href: '/login' },
      { label: 'Security Center', href: '/login' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#features' },
      { label: 'Why Sentinel AI', href: '#how-it-works' },
      { label: 'Security', href: '#security' },
      { label: 'Contact', href: '#cta' },
    ],
  },
  {
    title: 'Legal & Trust',
    links: [
      { label: 'Privacy Policy', href: '#security' },
      { label: 'Terms of Service', href: '#cta' },
      { label: 'Data Handling', href: '#security' },
      { label: 'Compliance', href: '#security' },
    ],
  },
]

export default function LandingFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
                <Shield className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold uppercase tracking-widest text-ink">Sentinel</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-blue">AI</span>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Secure enterprise knowledge intelligence — AI-powered answers backed by verifiable document evidence.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted">
              <Lock className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              <span>Protected environment · RBAC enforced</span>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-ink">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.href}
                      onClick={(e) => {
                        if (l.href.startsWith('#')) {
                          e.preventDefault()
                          document.querySelector(l.href)?.scrollIntoView({ behavior: 'smooth' })
                        }
                      }}
                      className="text-sm text-muted transition hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line-soft pt-6 sm:flex-row">
          <p className="flex items-center gap-1.5 text-xs text-faint">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
            © {new Date().getFullYear()} Sentinel AI. Confidential. For authorized enterprise use.
          </p>
          <p className="text-xs text-faint">Secure · Private · Trusted</p>
        </div>
      </div>
    </footer>
  )
}
