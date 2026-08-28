import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import Sidebar from '../components/layout/Sidebar'
import MobileSidebar from '../components/layout/MobileSidebar'

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="corp-bg flex h-screen min-h-screen overflow-hidden">
      <Sidebar user={user ? { name: user.name, role: user.role } : null} logout={logout} />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} user={user} logout={logout} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          user={user ? { name: user.name, role: user.role, department: user.department } : null}
          onMenuClick={() => setMobileOpen(true)}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
