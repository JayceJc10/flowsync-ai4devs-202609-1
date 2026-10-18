import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ApiError, getProfile, logout } from '@/lib/api'
import type { User } from '@/lib/api'
import { useAuth } from '@/lib/auth'

type State =
  | { status: 'loading' }
  | { status: 'ready'; user: User }
  | { status: 'error'; message: string }

export function ProfilePage() {
  const { token, clearSession } = useAuth()
  const navigate = useNavigate()
  const [state, setState] = useState<State>({ status: 'loading' })
  const [reloadKey, setReloadKey] = useState(0)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    if (!token) return
    let cancelled = false
    getProfile(token)
      .then((user) => {
        if (!cancelled) setState({ status: 'ready', user })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        if (err instanceof ApiError && err.status === 401) {
          // Token caducado o revocado: ProtectedRoute redirige a /login.
          clearSession()
          return
        }
        setState({
          status: 'error',
          message:
            err instanceof ApiError
              ? err.message
              : 'No se pudo cargar tu perfil',
        })
      })
    return () => {
      cancelled = true
    }
  }, [token, clearSession, reloadKey])

  async function handleLogout() {
    setLoggingOut(true)
    if (token) {
      // Si la revocación falla, la sesión local se cierra igualmente.
      await logout(token).catch(() => undefined)
    }
    clearSession()
    navigate('/login', { replace: true })
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Tu perfil</CardTitle>
          <CardDescription>Datos de tu cuenta en FlowSync</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {state.status === 'loading' && (
            <p className="text-sm text-muted-foreground">Cargando perfil…</p>
          )}
          {state.status === 'error' && (
            <Alert variant="destructive">
              <AlertDescription>
                {state.message}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-fit"
                  onClick={() => {
                    setState({ status: 'loading' })
                    setReloadKey((key) => key + 1)
                  }}
                >
                  Reintentar
                </Button>
              </AlertDescription>
            </Alert>
          )}
          {state.status === 'ready' && <ProfileDetails user={state.user} />}
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? 'Cerrando sesión…' : 'Cerrar sesión'}
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}

function ProfileDetails({ user }: { user: User }) {
  const createdAt = new Date(user.createdAt).toLocaleDateString('es-ES', {
    dateStyle: 'long',
  })

  return (
    <div className="flex items-center gap-4">
      <div
        aria-hidden="true"
        className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-medium text-primary-foreground"
      >
        {user.initials}
      </div>
      <dl className="grid gap-1 text-sm">
        <div>
          <dt className="sr-only">Nombre</dt>
          <dd className="text-base font-medium">
            {user.fullName ?? 'Sin nombre'}
          </dd>
        </div>
        <div>
          <dt className="sr-only">Email</dt>
          <dd className="text-muted-foreground">{user.email}</dd>
        </div>
        <div>
          <dt className="sr-only">Miembro desde</dt>
          <dd className="text-muted-foreground">Miembro desde {createdAt}</dd>
        </div>
      </dl>
    </div>
  )
}
