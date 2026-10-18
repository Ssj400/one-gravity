import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base relativa: el sitio funciona en GitHub Pages bajo cualquier subruta.
export default defineConfig({
  plugins: [react()],
  base: "./",
  worker: { format: "es" },
});
