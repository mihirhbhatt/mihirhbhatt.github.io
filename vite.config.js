import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // User site repository: https://mihirhbhatt.github.io/
  base: '/',
})
