import axios, { type AxiosInstance } from "axios";

export class HttpClient {
  private static _instance: HttpClient | null = null;
  private client: AxiosInstance;

  private constructor() {
    const rawBase = (import.meta.env.VITE_API_BASE_URL as string) || "";
    // In development, use relative URLs so Vite proxy can intercept them
    // In production, use the absolute baseURL
    const base = import.meta.env.DEV ? undefined : (rawBase.replace(/\/+$/, "") || undefined);

    this.client = axios.create({
      baseURL: base,
      headers: { "Content-Type": "application/json" },
      timeout: 10000, // Timeout de 10s para evitar hangs
    });

    // Attach JWT from localStorage (if present) to each request.
    // We read from localStorage at request time so updates to the token (login/logout)
    // are reflected without needing to recreate the axios instance.
    this.client.interceptors.request.use((config) => {
      try {
        // Try both localStorage and sessionStorage (AuthProvider may store token in either)
        const token = localStorage.getItem("jwt_token") ?? sessionStorage.getItem("jwt_token");
        if (token) {
          config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` } as any;
        }
      } catch (e) {
        // reading storage may fail in some edge cases; ignore and continue
      }
      return config;
    });

    // Response interceptor: if server returns 401, clear stored session and redirect to login
    this.client.interceptors.response.use(
      (r) => r,
      (err) => {
        try {
          const status = err?.response?.status;
          if (status === 401) {
            try {
              localStorage.removeItem("jwt_token");
              localStorage.removeItem("user");
              sessionStorage.removeItem("jwt_token");
              sessionStorage.removeItem("user");
            } catch {}
            // redirect to login page so user can re-authenticate
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
          }
        } catch (e) {
          // ignore
        }
        return Promise.reject(err);
      }
    );
  }

  static get instance(): AxiosInstance {
    if (!HttpClient._instance) {
      HttpClient._instance = new HttpClient();
    }
    return HttpClient._instance.client;
  }
}