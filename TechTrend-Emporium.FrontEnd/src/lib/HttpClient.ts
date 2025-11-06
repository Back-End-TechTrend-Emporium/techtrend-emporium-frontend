import axios, { type AxiosInstance } from "axios";

export class HttpClient {
  private static _instance: HttpClient | null = null;
  private client: AxiosInstance;

  private constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: { "Content-Type": "application/json" },
      timeout: 10000, // Timeout de 10s para evitar hangs
    });
  }

  static get instance(): AxiosInstance {
    if (!HttpClient._instance) {
      HttpClient._instance = new HttpClient();
    }
    return HttpClient._instance.client;
  }
}