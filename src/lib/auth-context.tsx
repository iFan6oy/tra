'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type AppUser = {
  id: string
  name: string
  email: string
  role: string
  department: string | null
  workosId?: string
}

type AuthContextType = {
  user: AppUser | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

export function AuthProvider({ children, workosUser }: { children: ReactNode; workosUser?: { id: string; email: string; firstName?: string | null; lastName?: string | null } | null }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (workosUser) {
      // WorkOS user is logged in - find or create in our DB
      fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workosId: workosUser.id,
          email: workosUser.email,
          name: [workosUser.firstName, workosUser.lastName].filter(Boolean).join(' ') || workosUser.email,
        }),
      })
        .then(res => res.json())
        .then(setUser)
        .catch(() => {})
        .finally(() => setLoading(false))
    } else {
      // No WorkOS user - fallback to first manager (dev mode)
      fetch('/api/users')
        .then(res => res.json())
        .then(users => {
          const mgr = users.find((u: AppUser) => u.role === 'MANAGER') || users[0]
          setUser(mgr)
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [workosUser])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
