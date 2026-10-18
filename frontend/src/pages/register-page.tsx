import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { AuthLayout, FieldError } from '@/components/auth-layout'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ApiError, signup } from '@/lib/api'
import { useAuth } from '@/lib/auth'

type Field = 'fullName' | 'email' | 'password' | 'passwordConfirmation'

export function RegisterPage() {
  const { setSession } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState<Record<Field, string>>({
    fullName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function update(field: Field, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (values.password !== values.passwordConfirmation) {
      setFieldErrors({ passwordConfirmation: 'Las contraseñas no coinciden' })
      return
    }

    setFieldErrors({})
    setSubmitting(true)
    try {
      const fullName = values.fullName.trim()
      const { token } = await signup({
        // El backend exige la clave aunque el nombre sea opcional.
        fullName: fullName || null,
        email: values.email.trim(),
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
      })
      setSession(token)
      navigate('/profile', { replace: true })
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fieldErrors).length > 0) {
        setFieldErrors(err.fieldErrors)
      } else {
        setError(
          err instanceof ApiError
            ? err.message
            : 'Ha ocurrido un error inesperado. Inténtalo de nuevo',
        )
      }
      setSubmitting(false)
    }
  }

  function fieldProps(field: Field) {
    const message = fieldErrors[field]
    return {
      id: field,
      value: values[field],
      onChange: (event: ChangeEvent<HTMLInputElement>) =>
        update(field, event.target.value),
      'aria-invalid': message ? true : undefined,
      'aria-describedby': message ? `${field}-error` : undefined,
    }
  }

  return (
    <AuthLayout
      title="Crea tu cuenta"
      description="Regístrate para empezar a usar FlowSync"
      footer={
        <p>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-foreground underline">
            Inicia sesión
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="grid gap-2">
          <Label htmlFor="fullName">
            Nombre completo{' '}
            <span className="font-normal text-muted-foreground">
              (opcional)
            </span>
          </Label>
          <Input type="text" autoComplete="name" {...fieldProps('fullName')} />
          <FieldError id="fullName-error" message={fieldErrors.fullName} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            {...fieldProps('email')}
          />
          <FieldError id="email-error" message={fieldErrors.email} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={32}
            {...fieldProps('password')}
          />
          {fieldErrors.password ? (
            <FieldError id="password-error" message={fieldErrors.password} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Entre 8 y 32 caracteres
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="passwordConfirmation">Repite la contraseña</Label>
          <Input
            type="password"
            autoComplete="new-password"
            required
            {...fieldProps('passwordConfirmation')}
          />
          <FieldError
            id="passwordConfirmation-error"
            message={fieldErrors.passwordConfirmation}
          />
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </Button>
      </form>
    </AuthLayout>
  )
}
