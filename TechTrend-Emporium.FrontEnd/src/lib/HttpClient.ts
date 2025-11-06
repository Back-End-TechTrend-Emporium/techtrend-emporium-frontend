import axios, { type AxiosInstance } from "axios";

export class HttpClient {
  private static _instance: HttpClient | null = null;
  private client: AxiosInstance;

  private constructor() {
    const rawBase = (import.meta.env.VITE_API_BASE_URL as string) || "";
    const base = rawBase.replace(/\/+$/, "") || undefined; // remove trailing slashes

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
        const token = localStorage.getItem("jwt_token");
        if (token) {
          config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` } as any;
        }
      } catch (e) {
        // reading localStorage may fail in some edge cases; ignore and continue
      }
      return config;
    });
  }

  static get instance(): AxiosInstance {
    if (!HttpClient._instance) {
      HttpClient._instance = new HttpClient();
    }
    return HttpClient._instance.client;
  }
}