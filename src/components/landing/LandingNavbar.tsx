import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Menu, X, ChevronRight, Sun, Moon, LayoutDashboard } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Security', href: '#security' },
  { label: 'Pricing', href: '#cta' },
]

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  const openDashboard = () => {
    navigate(user?.role === 'admin' || user?.role === 'manager' ? '/dashboard' : '/search')
  }

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? 'border-b border-line bg-surface/90 backdrop-blur-md shadow-sm'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-sm">
            <Shield className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold uppercase tracking-widest text-ink">Sentinel</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-blue">AI</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="text-sm font-medium text-muted transition hover:text-ink"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden items-center gap-3 md:flex">
          {/* GitHub Star Badge (matching Animate UI header) */}
          <a
            href="https://github.com/Krishnakumar1296/sentinel-AI"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/90 px-3 py-1 text-xs font-medium text-neutral-300 transition-colors hover:border-neutral-700 hover:text-white"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>4330</span>
            <span className="text-amber-400">★</span>
          </a>

          {/* Pill Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/90 p-1 text-xs text-neutral-400 transition-colors hover:text-white"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            <div className={`flex h-5 w-5 items-center justify-center rounded-full transition-transform ${theme === 'dark' ? 'bg-neutral-800 text-amber-300' : 'text-neutral-500'}`}>
              <Sun className="h-3 w-3" />
            </div>
            <div className={`flex h-5 w-5 items-center justify-center rounded-full transition-transform ${theme === 'dark' ? 'text-neutral-500' : 'bg-neutral-200 text-neutral-900'}`}>
              <Moon className="h-3 w-3" />
            </div>
          </button>

          {isAuthenticated ? (
            <button onClick={openDashboard} className="btn-primary">
              <LayoutDashboard className="h-4 w-4" /> Open Dashboard
            </button>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-muted transition hover:text-ink">
                Login
              </Link>
              <Link to="/login" className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-neutral-200 shadow-sm">
                Get Started <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-muted transition hover:bg-surface-soft hover:text-ink"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="rounded-lg p-2 text-muted transition hover:bg-surface-soft hover:text-ink"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-line bg-surface px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted transition hover:bg-surface-soft hover:text-ink"
              >
                {link.label}
              </button>
            ))}
            <div className="mt-2 flex gap-2 border-t border-line-soft px-1 pt-3">
              {isAuthenticated ? (
                <button onClick={() => { setMobileOpen(false); openDashboard() }} className="btn-primary flex-1 justify-center">
                  <LayoutDashboard className="h-4 w-4" /> Open Dashboard
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary flex-1 justify-center">
                    Login
                  </Link>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 justify-center">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
