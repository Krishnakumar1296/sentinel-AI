import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './components/common/Toast'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Search from './pages/Search'
import Documents from './pages/Documents'
import Upload from './pages/Upload'
import Viewer from './pages/Viewer'
import History from './pages/History'
import KnowledgeGaps from './pages/KnowledgeGaps'
import Analytics from './pages/Analytics'
import Security from './pages/Security'
import Users from './pages/Users'
import Roles from './pages/Roles'
import Settings from './pages/Settings'
import About from './pages/About'
import DashboardLayout from './layouts/DashboardLayout'

function mainPath(role?: string) {
  return role === 'admin' || role === 'manager' ? '/dashboard' : '/search'
}

function LoginRoute() {
  const { user, isAuthenticated } = useAuth()
  if (isAuthenticated) {
    return <Navigate to={mainPath(user?.role)} replace />
  }
  return <Login />
}

function LandingRoute() {
  return <Landing />
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ThemeProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/" element={<LandingRoute />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
            </Route>
            <Route path="/search" element={<DashboardLayout />}>
              <Route index element={<Search />} />
            </Route>
            <Route path="/documents" element={<DashboardLayout />}>
              <Route index element={<Documents />} />
            </Route>
            <Route path="/upload" element={<DashboardLayout />}>
              <Route index element={<Upload />} />
            </Route>
            <Route path="/viewer" element={<DashboardLayout />}>
              <Route index element={<Viewer />} />
            </Route>
            <Route path="/history" element={<DashboardLayout />}>
              <Route index element={<History />} />
            </Route>
            <Route path="/gaps" element={<DashboardLayout />}>
              <Route index element={<KnowledgeGaps />} />
            </Route>
            <Route path="/analytics" element={<DashboardLayout />}>
              <Route index element={<Analytics />} />
            </Route>
            <Route path="/security" element={<DashboardLayout />}>
              <Route index element={<Security />} />
            </Route>
            <Route path="/users" element={<DashboardLayout />}>
              <Route index element={<Users />} />
            </Route>
            <Route path="/roles" element={<DashboardLayout />}>
              <Route index element={<Roles />} />
            </Route>
            <Route path="/settings" element={<DashboardLayout />}>
              <Route index element={<Settings />} />
            </Route>
            <Route path="/about" element={<DashboardLayout />}>
              <Route index element={<About />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        </BrowserRouter>
        </ThemeProvider>
        </AuthProvider>
      </ToastProvider>
  )
}

export default App
