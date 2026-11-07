import { defineConfig, fontProviders } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  site: 'https://almaz.design',
  // /notes has no page of its own: projects are entered from the home page.
  redirects: { '/notes': '/' },
  integrations: [react(), sitemap()],
  vite: {
    plugins: [svgr()],
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Geist',
      cssVariable: '--font-geist',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Geist Mono',
      cssVariable: '--font-geist-mono',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
    {
      provider: fontProviders.google(),
      name: 'Playfair Display',
      cssVariable: '--font-playfair',
      weights: ['400 900'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['serif'],
    },
  ],
})
