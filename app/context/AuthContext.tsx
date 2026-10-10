import { createContext, useCallback, useContext, useState, type PropsWithChildren } from 'react';
import { clearAuthSession, readAccessToken, readAuthUser, saveAuthSession } from '../auth/session';
import { login as loginRequest, logout as logoutRequest } from '../services/authService';
import type { AuthResponse, AuthUser } from '../types/identity';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState(readAccessToken);
  const [user, setUser] = useState(readAuthUser);

  const login = useCallback(async (username: string, password: string): Promise<AuthResponse> => {
    const session = await loginRequest(username, password);
    saveAuthSession(session.accessToken, session.user);
    setToken(session.accessToken);
    setUser(session.user);
    return session;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      if (token) await logoutRequest();
    } finally {
      clearAuthSession();
      setToken(null);
      setUser(null);
    }
  }, [token]);

  const value = { user, isAuthenticated: Boolean(token && user), login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
}
