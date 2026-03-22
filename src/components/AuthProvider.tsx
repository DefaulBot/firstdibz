'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User, SupabaseClient } from '@supabase/supabase-js'
import { supabaseBrowser } from '@/lib/supabase/browser'

type AuthContextValue = {
  supabase: SupabaseClient | null
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  supabaseConfigured: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [supabaseConfigured, setSupabaseConfigured] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    let client: SupabaseClient | null = null
    try {
      client = supabaseBrowser()
      setSupabase(client)
      setSupabaseConfigured(true)
    } catch {
      setSupabase(null)
      setSupabaseConfigured(false)
      setLoading(false)
      return () => {
        mounted = false
      }
    }

    client.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      setLoading(false)
    })

    const { data: sub } = client.auth.onAuthStateChange((_event, next) => {
      setSession(next)
      setLoading(false)
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const value: AuthContextValue = {
    supabase,
    user: session?.user ?? null,
    session,
    loading,
    supabaseConfigured,
    signOut: async () => {
      if (!supabase) return
      await supabase.auth.signOut()
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider />')
  return ctx
}
