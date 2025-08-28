import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      content: [ "./index.html", "./src/**/*.{js,ts,jsx,tsx}" ],
      theme: {
        extend: {
          fontFamily: {
            'sans': ['Poppins', 'sans-serif'],
          },
          colors: {
            'primary': {
              '600': '#2563eb',
              '700': '#1d4ed8',
            },
            'secondary': '#4f46e5',
          }
        },
      },
      plugins: [tailwindcss(),],
      
    }),
  ],
  server: {
    proxy: { '/api': 'http://localhost:5000' },
  },
})