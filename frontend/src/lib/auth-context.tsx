import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import * as api from '@/lib/api';
import { ApiError, type User } from '@/lib/api';

const TOKEN_STORAGE_KEY = 'flowsync_token';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthContextValue = {
  user: User | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    fullName: string | null,
    email: string,
    password: string,
    passwordConfirmation: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>(token ? 'loading' : 'unauthenticated');

  useEffect(() => {
    if (!token) {
      setStatus('unauthenticated');
      return;
    }

    // Skip re-hydrating when we already have the user in memory (e.g. right
    // after login/signup just set it) — only fetch on initial mount with a
    // stored token.
    if (user) return;

    let cancelled = false;
    setStatus('loading');

    api
      .getProfile(token)
      .then((profile) => {
        if (cancelled) return;
        setUser(profile);
        setStatus('authenticated');
      })
      .catch((error) => {
        if (cancelled) return;
        // Only an actual auth failure invalidates the stored token; a
        // transient network/server error shouldn't wipe a valid session.
        if (error instanceof ApiError && error.status === 401) {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          setToken(null);
        }
        setUser(null);
        setStatus('unauthenticated');
      });

    return () => {
      cancelled = true;
    };
  }, [token, user]);

  function persistSession(nextToken: string, nextUser: User) {
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
    setStatus('authenticated');
  }

  async function login(email: string, password: string) {
    const { user: loggedInUser, token: newToken } = await api.login({ email, password });
    persistSession(newToken, loggedInUser);
  }

  async function signup(
    fullName: string | null,
    email: string,
    password: string,
    passwordConfirmation: string,
  ) {
    const { user: newUser, token: newToken } = await api.signup({
      fullName,
      email,
      password,
      passwordConfirmation,
    });
    persistSession(newToken, newUser);
  }

  async function logout() {
    if (token) {
      await api.logout(token).catch(() => {});
    }
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
    setStatus('unauthenticated');
  }

  return (
    <AuthContext.Provider value={{ user, status, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
