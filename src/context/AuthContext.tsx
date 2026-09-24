import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from '../types'
import { auth, getIdToken, firebaseSignOut } from '../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  token: string | null
  login: (user: User, token?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  token: null,
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
  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem('sentinel_token')
  })

  const login = (u: User, t?: string) => {
    const activeToken = t || sessionStorage.getItem('sentinel_token') || ''
    setUser(u)
    setToken(activeToken)
    sessionStorage.setItem('sentinel_user', JSON.stringify(u))
    if (activeToken) sessionStorage.setItem('sentinel_token', activeToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    sessionStorage.removeItem('sentinel_user')
    sessionStorage.removeItem('sentinel_token')
    firebaseSignOut().catch(() => {})
  }

  // Refresh token periodically (Firebase tokens expire after 1 hour)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const newToken = await firebaseUser.getIdToken()
        setToken(newToken)
        sessionStorage.setItem('sentinel_token', newToken)
      }
    })
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
