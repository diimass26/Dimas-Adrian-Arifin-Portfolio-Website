'use client'

import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { createContext, useContext, useEffect, useState } from 'react'

type AuthContextType = {
  session: Session | null
  user: User | null
}

const AuthContext = createContext<AuthContextType>({ session: null, user: null })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
    }

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
    })

    getSession()

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)