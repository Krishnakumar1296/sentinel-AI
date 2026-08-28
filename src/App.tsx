import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/common/Toast'
import Login from './pages/Login'
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
import DashboardLayout from './layouts/DashboardLayout'

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="search" element={<Search />} />
            <Route path="documents" element={<Documents />} />
            <Route path="upload" element={<Upload />} />
            <Route path="viewer" element={<Viewer />} />
            <Route path="history" element={<History />} />
            <Route path="gaps" element={<KnowledgeGaps />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="security" element={<Security />} />
            <Route path="users" element={<Users />} />
            <Route path="roles" element={<Roles />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
