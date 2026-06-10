'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { ApiError, api, clearToken, getToken, setToken } from '@/lib/api'
import type { PlantProgress, User } from '@/lib/types'

interface AuthState {
  user: User | null
  plant: PlantProgress | null
  loading: boolean
  login: (identifier: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  refresh: () => Promise<void>
  setPlant: (plant: PlantProgress) => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [plant, setPlant] = useState<PlantProgress | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null)
      setPlant(null)
      setLoading(false)
      return
    }
    try {
      const me = await api.auth.me()
      setUser(me.user)
      setPlant(me.plant)
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearToken()
        setUser(null)
        setPlant(null)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const login = async (identifier: string, password: string) => {
    const res = await api.auth.login({ identifier, password })
    setToken(res.token)
    setUser(res.user)
    await refresh()
  }

  const register = async (username: string, email: string, password: string) => {
    const res = await api.auth.register({ username, email, password })
    setToken(res.token)
    setUser(res.user)
    await refresh()
  }

  const logout = () => {
    clearToken()
    setUser(null)
    setPlant(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, plant, loading, login, register, logout, refresh, setPlant }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
