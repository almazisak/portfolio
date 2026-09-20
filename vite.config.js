import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import mdx from '@mdx-js/rollup'
import rehypeSlug from 'rehype-slug'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const SITE_URL = 'https://almaz.design'

// Link-preview crawlers don't run JS, so per-page OG tags have to be baked into
// static HTML. Emits dist/<route>/index.html; hosts serve real files before the SPA rewrite.
const ogPages = [
  {
    route: 'work/balaty',
    title: 'Balaty – Kyrgyz national sticker pack for Telegram',
    description: 'Kyrgyz characters that bring warmth, humor and cultural identity into everyday chats – free Telegram stickers supporting children from vulnerable backgrounds.',
    image: '/og/balaty.jpg',
  },
]

const escapeAttr = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')

function ogPagesPlugin() {
  let outDir
  return {
    name: 'og-pages',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    async writeBundle() {
      const template = await readFile(path.join(outDir, 'index.html'), 'utf8')
      for (const { route, title, description, image } of ogPages) {
        const tags = [
          ['name', 'description', description],
          ['property', 'og:type', 'website'],
          ['property', 'og:title', title],
          ['property', 'og:description', description],
          ['property', 'og:url', `${SITE_URL}/${route}`],
          ['property', 'og:image', `${SITE_URL}${image}`],
          ['property', 'og:image:width', '1200'],
          ['property', 'og:image:height', '630'],
          ['name', 'twitter:card', 'summary_large_image'],
        ]
          .map(([attr, key, content]) => `    <meta ${attr}="${key}" content="${escapeAttr(content)}" />`)
          .join('\n')
        const html = template
          .replace(/<title>.*?<\/title>/, `<title>${escapeAttr(title)}</title>`)
          .replace('  </head>', `${tags}\n  </head>`)
        const dir = path.join(outDir, route)
        await mkdir(dir, { recursive: true })
        await writeFile(path.join(dir, 'index.html'), html)
      }
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [
    { enforce: 'pre', ...mdx({ rehypePlugins: [rehypeSlug] }) },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
    svgr(),
    ogPagesPlugin(),
  ],
})
