import type { AuthUser } from '../types/identity';

const TOKEN_KEY = 'carmencita.auth.access-token';
const USER_KEY = 'carmencita.auth.user';

export function readAccessToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function readAuthUser(): AuthUser | null {
  const storedUser = sessionStorage.getItem(USER_KEY);
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    sessionStorage.removeItem(USER_KEY);
    return null;
  }
}

export function saveAuthSession(accessToken: string, user: AuthUser): void {
  sessionStorage.setItem(TOKEN_KEY, accessToken);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}
