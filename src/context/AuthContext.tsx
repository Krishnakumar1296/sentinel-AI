import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from '../types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = sessionStorage.getItem('sentinel_user')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const login = (u: User) => {
    setUser(u)
    sessionStorage.setItem('sentinel_user', JSON.stringify(u))
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('sentinel_user')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
