const API_URL = (
  import.meta.env.VITE_API_URL ?? 'http://localhost:3333'
).replace(/\/+$/, '')

export type User = {
  id: number
  fullName: string | null
  email: string
  createdAt: string
  updatedAt: string | null
  initials: string
}

export type AuthResponse = {
  user: User
  token: string
}

type ValidationError = {
  field?: string
  rule?: string
  message: string
}

/**
 * Error de la API ya traducido a algo que se puede enseñar al usuario.
 * `fieldErrors` solo se rellena con los errores de validación (422).
 */
export class ApiError extends Error {
  status: number
  fieldErrors: Record<string, string>

  constructor(
    status: number,
    message: string,
    fieldErrors: Record<string, string> = {},
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

const RULE_MESSAGES: Record<string, string> = {
  required: 'Este campo es obligatorio',
  email: 'Introduce un email válido',
  minLength: 'Es demasiado corto',
  maxLength: 'Es demasiado largo',
  sameAs: 'Las contraseñas no coinciden',
  'database.unique': 'Ya existe una cuenta con este email',
}

const FIELD_MESSAGES: Record<string, Record<string, string>> = {
  password: {
    minLength: 'La contraseña debe tener al menos 8 caracteres',
    maxLength: 'La contraseña no puede tener más de 32 caracteres',
  },
  passwordConfirmation: {
    minLength: 'Las contraseñas no coinciden',
    maxLength: 'Las contraseñas no coinciden',
  },
}

function messageFor({ field, rule, message }: ValidationError) {
  if (!rule) return message
  return (
    (field && FIELD_MESSAGES[field]?.[rule]) ?? RULE_MESSAGES[rule] ?? message
  )
}

function toApiError(status: number, payload: unknown): ApiError {
  const errors: ValidationError[] =
    payload && typeof payload === 'object' && 'errors' in payload
      ? ((payload as { errors: ValidationError[] }).errors ?? [])
      : []

  if (status === 422) {
    const fieldErrors: Record<string, string> = {}
    for (const error of errors) {
      if (error.field && !fieldErrors[error.field]) {
        fieldErrors[error.field] = messageFor(error)
      }
    }
    return new ApiError(status, 'Revisa los campos del formulario', fieldErrors)
  }
  if (status === 401) {
    return new ApiError(
      status,
      'Tu sesión ha caducado. Vuelve a iniciar sesión',
    )
  }
  if (status === 429) {
    return new ApiError(status, 'Demasiados intentos. Espera un momento')
  }
  return new ApiError(
    status,
    'Ha ocurrido un error inesperado. Inténtalo de nuevo',
  )
}

type RequestOptions = {
  method?: 'GET' | 'POST'
  body?: unknown
  token?: string | null
}

async function request<T>(
  path: string,
  { method = 'GET', body, token }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor')
  }

  const payload: unknown = await response.json().catch(() => null)
  if (!response.ok) throw toApiError(response.status, payload)
  return payload as T
}

export async function signup(input: {
  fullName: string | null
  email: string
  password: string
  passwordConfirmation: string
}) {
  const { data } = await request<{ data: AuthResponse }>(
    '/api/v1/auth/signup',
    { method: 'POST', body: input },
  )
  return data
}

export async function login(input: { email: string; password: string }) {
  try {
    const { data } = await request<{ data: AuthResponse }>(
      '/api/v1/auth/login',
      { method: 'POST', body: input },
    )
    return data
  } catch (error) {
    // E_INVALID_CREDENTIALS llega como 400: no decimos cuál de los dos falla.
    if (error instanceof ApiError && error.status === 400) {
      throw new ApiError(400, 'Email o contraseña incorrectos')
    }
    throw error
  }
}

export async function getProfile(token: string) {
  const { data } = await request<{ data: User }>('/api/v1/account/profile', {
    token,
  })
  return data
}

export async function logout(token: string) {
  await request<{ message: string }>('/api/v1/account/logout', {
    method: 'POST',
    token,
  })
}
