import { http } from "./http";

export type FetchOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
};

/**
 * Compatibility wrapper so existing code that used `authFetch` keeps working, but
 * uses the axios singleton under the hood. Returns response.data and throws a
 * normalized Error with `status` and `body` properties on failures.
 */
export async function authFetch<T = any>(input: string, init?: FetchOptions): Promise<T> {
  const url = input;
  try {
    const method = (init?.method ?? "GET").toLowerCase();
    const config: any = { url, method };

    if (init?.headers) config.headers = init.headers;
    if (init?.body !== undefined) {
      // If body is a JSON string (previous behavior), try to parse it, otherwise send as-is.
      if (typeof init.body === "string") {
        try {
          config.data = JSON.parse(init.body);
        } catch {
          config.data = init.body;
        }
      } else {
        config.data = init.body;
      }
    }

    const response = await http.request<T>(config);
    return response.data as T;
  } catch (err: any) {
    const status = err?.response?.status;
    const body = err?.response?.data ?? err?.message;
    const e: any = new Error(body?.message ?? body ?? err?.message ?? "HTTP error");
    e.status = status;
    e.body = body;
    throw e;
  }
}
