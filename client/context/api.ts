// client/context/api.ts
export const BACKEND = import.meta.env.VITE_BACKEND_URL || '';

type Json = any;

async function request(path: string, options: RequestInit = {}) {
  // ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = BACKEND ? `${BACKEND}${normalizedPath}` : normalizedPath;

  // attach token if present
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: options.credentials ?? 'include', // keep default include for cookies; override if needed
  });

  if (!res.ok) {
    // try to parse error response
    let text = '';
    try {
      text = await res.text();
    } catch {}
    throw new Error(`API error ${res.status}: ${text || res.statusText}`);
  }

  if (res.status === 204) return null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
}

export const api = {
  get: <T = any>(path: string) => request(path, { method: 'GET' }) as Promise<T>,
  post: <T = any>(path: string, body?: any) =>
    request(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }) as Promise<T>,
  put: <T = any>(path: string, body?: any) =>
    request(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }) as Promise<T>,
  del: <T = any>(path: string) => request(path, { method: 'DELETE' }) as Promise<T>,
};
