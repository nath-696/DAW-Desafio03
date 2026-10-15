import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// El proxy reenvía /api/countries/* a Rest Countries v5 agregando la API key en el servidor.
// Así el navegador llama a su mismo origen (sin problemas de CORS) y la key no viaja en el código del cliente.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api/countries": {
          target: "https://api.restcountries.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/countries/, "/countries/v5"),
          headers: { Authorization: `Bearer ${env.VITE_RESTCOUNTRIES_API_KEY ?? ""}` },
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => proxyReq.removeHeader("origin"));
          },
        },
      },
    },
  };
});
