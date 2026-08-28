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
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-muted transition hover:bg-surface-soft hover:text-ink"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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
              <Link to="/login" className="btn-primary">
                Get Started <ChevronRight className="h-4 w-4" />
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
