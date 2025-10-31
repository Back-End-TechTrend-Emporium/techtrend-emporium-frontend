import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
    mutations: {
      // global mutation error handler: if backend returns 401, clear token and reload so user can login
      onError: (err: any) => {
        try {
          if (err?.status === 401) {
            localStorage.removeItem("jwt_token");
            localStorage.removeItem("user");
            // reload to reset app state; user will be redirected to login
            window.location.reload();
          }
        } catch (e) {
          // ignore
        }
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>
);
