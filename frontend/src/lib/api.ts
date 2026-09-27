const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api/v1';

export class ApiError extends Error {
  messages: string[];

  constructor(messages: string[]) {
    super(messages.join(' '));
    this.messages = messages;
  }
}

type ApiErrorBody = { errors?: { message?: string }[] };

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!response.ok) {
    let messages = [`Error ${response.status}: no se pudo completar la solicitud.`];
    try {
      const body = (await response.json()) as ApiErrorBody;
      if (body.errors?.length) {
        messages = body.errors.map((e) => e.message ?? messages[0]);
      }
    } catch {
      // response body was not JSON, keep the generic message
    }
    throw new ApiError(messages);
  }

  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
}

export type User = {
  id: number;
  fullName: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
  initials: string;
};

type AuthResponse = { data: { user: User; token: string } };

export async function signup(payload: {
  fullName: string | null;
  email: string;
  password: string;
  passwordConfirmation: string;
}) {
  const { data } = await request<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data;
}

export async function login(payload: { email: string; password: string }) {
  const { data } = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data;
}

export async function getProfile(token: string) {
  const { data } = await request<{ data: User }>('/account/profile', { method: 'GET' }, token);
  return data;
}

export function logout(token: string) {
  return request<{ message: string }>('/account/logout', { method: 'POST' }, token);
}
