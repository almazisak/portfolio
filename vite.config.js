import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import mdx from '@mdx-js/rollup'
import rehypeSlug from 'rehype-slug'

export default defineConfig({
  base: '/',
  plugins: [
    { enforce: 'pre', ...mdx({ rehypePlugins: [rehypeSlug] }) },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    svgr(),
  ],
})
