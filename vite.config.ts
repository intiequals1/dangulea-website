import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Im Build erlaubt die CSP in index.html nur das Inline-Skript mit passendem Hash.
// Der Dev-Server braucht für React Refresh ein zusätzliches Inline-Skript.
const devInlineScripts = {
  name: 'dev-inline-scripts',
  apply: 'serve' as const,
  transformIndexHtml: (html: string) => html.replace(/script-src 'self' 'sha256-[^']+'/, "script-src 'self' 'unsafe-inline'"),
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), devInlineScripts],
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
        "script-src 'self' 'unsafe-inline' https://apis.google.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob:",
        "connect-src 'self' https://sheets.googleapis.com https://oauth2.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com",
        "frame-src https://dangulea-intern.firebaseapp.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; '),
    },
  },
})
