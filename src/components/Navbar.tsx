import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Shield, Menu, X, ChevronRight } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'Security', href: '#security' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Analytics', href: '#analytics' },
  { label: 'About', href: '#about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const isDashboard = location.pathname === '/dashboard'

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? 'bg-white/95 backdrop-blur-lg shadow-sm border-b border-slate-100'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg group-hover:shadow-glow-blue transition-all duration-300">
              <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold text-navy-900 tracking-widest uppercase">Sentinel</span>
              <span className="text-[10px] font-semibold tracking-[0.2em] text-blue-600 uppercase">AI</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          {!isDashboard && (
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="nav-link"
                >
                  {link.label}
                </button>
              ))}
            </div>
          )}

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isDashboard ? (
              <Link to="/" className="nav-link flex items-center gap-1">
                ← Back to site
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/login"
                  className="btn-primary text-sm py-2.5"
                >
                  Get Started
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? 'max-h-96 pb-4' : 'max-h-0'
          }`}
        >
          <div className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="flex gap-2 mt-3 px-2">
              <Link
                to="/login"
                className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 hover:border-blue-300"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/login"
                className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-violet-600 text-white"
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
