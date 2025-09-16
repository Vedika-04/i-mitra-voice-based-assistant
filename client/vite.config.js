// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      "localhost", // Default
      "127.0.0.1", // Default
      "b9a9cf69fd5a.ngrok-free.app", // Replace with your Ngrok domain
      // Add other trusted hosts if needed, e.g., '.your-local-domain.com'
    ],
    // Optional: If using HTTPS with Ngrok, you might need to configure HMR
    // hmr: {
    //   clientPort: 443, // Use 80 for HTTP tunnels
    // },
  },
});
