import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import * as api from '@/lib/api';
import type { User } from '@/lib/api';

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

    let cancelled = false;
    setStatus('loading');

    api
      .getProfile(token)
      .then((profile) => {
        if (cancelled) return;
        setUser(profile);
        setStatus('authenticated');
      })
      .catch(() => {
        if (cancelled) return;
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
        setStatus('unauthenticated');
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

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
