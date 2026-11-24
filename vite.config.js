import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// React + Tailwind CSS. Las peticiones a /api (REST) y /graphql (GraphQL)
// se redirigen al backend mock que corre en el puerto 4000.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000',
      '/graphql': 'http://localhost:4000'
    }
  }
});
