// Lightweight API helper that injects JWT from localStorage into Authorization header.
// Use this with react-query's `useQuery`/`useMutation` by passing it as the fetcher.

export type FetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

// If VITE_API_BASE_URL is provided, use it; otherwise keep requests relative so the dev-server proxy can forward them.
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || "";

export async function authFetch<T = any>(input: string, init?: FetchOptions): Promise<T> {
  // If API_BASE is set, prefix it. If not, keep relative paths so Vite proxy can be used in dev.
  const url = input.startsWith("/") ? (API_BASE ? `${API_BASE}${input}` : input) : input;
  const token = localStorage.getItem("jwt_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers ?? {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { method: init?.method ?? "GET", headers, body: init?.body });
  const text = await res.text();
  const contentType = res.headers.get("content-type") || "";

  if (!res.ok) {
    const err: any = new Error(text || res.statusText || `HTTP error ${res.status}`);
    err.status = res.status;
    err.body = text;
    throw err;
  }

  if (contentType.includes("application/json")) return JSON.parse(text) as T;
  return text as unknown as T;
}
