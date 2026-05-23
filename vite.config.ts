import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    headers: {
      // Prevent clickjacking
      'X-Frame-Options': 'DENY',
      // Prevent MIME-type sniffing
      'X-Content-Type-Options': 'nosniff',
      // Enable XSS filter in older browsers
      'X-XSS-Protection': '1; mode=block',
      // Restrict referrer information
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      // Permissions policy: disable unused browser features
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      // Content Security Policy
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob:",
        "connect-src 'self'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; '),
    },
  },
})
