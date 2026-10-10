const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '');

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

function getErrorMessage(payload: unknown, fallback: string): { message: string; code?: string } {
  if (!payload || typeof payload !== 'object') return { message: fallback };

  const body = payload as {
    error?: { message?: string; code?: string };
    detail?: string | Array<{ msg?: string }>;
    message?: string;
  };
  const detail = Array.isArray(body.detail)
    ? body.detail.map((item) => item.msg).filter(Boolean).join(' ')
    : body.detail;

  return {
    message: body.error?.message || detail || body.message || fallback,
    code: body.error?.code,
  };
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = sessionStorage.getItem('carmencita.auth.access-token');
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const error = getErrorMessage(payload, `La solicitud no pudo completarse (${response.status}).`);
    throw new ApiError(error.message, response.status, error.code);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}
