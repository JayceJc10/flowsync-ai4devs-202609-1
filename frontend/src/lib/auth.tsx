import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'

const TOKEN_KEY = 'flowsync.token'

type AuthContextValue = {
  token: string | null
  setSession: (token: string) => void
  clearSession: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

// localStorage puede lanzar (modo privado, almacenamiento bloqueado): en ese
// caso la sesión vive solo en memoria.
function readToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function writeToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Sin persistencia: se mantiene el token en el estado.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(readToken)

  const setSession = useCallback((next: string) => {
    writeToken(next)
    setToken(next)
  }, [])

  const clearSession = useCallback(() => {
    writeToken(null)
    setToken(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, setSession, clearSession }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return context
}
