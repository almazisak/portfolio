import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
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

// Notes come from the public notes repo (scripts/fetch-notes.mjs). They have no 1200×630
// image, so their previews are text-only.
const plainText = (md) => md.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[#>*_`]/g, '').replace(/(^|\s)-\s/g, '$1').replace(/\s+/g, ' ').trim()
const clip = (text, max = 160) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text)

async function notesPages(root) {
  let projects = []
  try {
    projects = JSON.parse(await readFile(path.join(root, 'src/lib/notes.generated.json'), 'utf8')).projects
  } catch {
    return []
  }
  return [
    ...projects.flatMap((project) => [
      {
        route: `notes/${project.slug}`,
        title: `${project.title} – Notes – Almaz Isakov`,
        description: clip(project.summary || plainText(project.intro)),
      },
      ...project.entries.map((note) => ({
        route: `notes/${project.slug}/${note.slug}`,
        title: `${note.title || note.date} – ${project.title} – Almaz Isakov`,
        description: clip(plainText(note.body)),
      })),
    ]),
  ]
}

function ogPagesPlugin() {
  let outDir
  let root
  return {
    name: 'og-pages',
    apply: 'build',
    configResolved(config) {
      root = config.root
      outDir = path.resolve(config.root, config.build.outDir)
    },
    async writeBundle() {
      const template = await readFile(path.join(outDir, 'index.html'), 'utf8')
      for (const { route, title, description, image } of [...ogPages, ...(await notesPages(root))]) {
        const tags = [
          ['name', 'description', description],
          ['property', 'og:type', 'website'],
          ['property', 'og:title', title],
          ['property', 'og:description', description],
          ['property', 'og:url', `${SITE_URL}/${route}`],
          ...(image
            ? [
                ['property', 'og:image', `${SITE_URL}${image}`],
                ['property', 'og:image:width', '1200'],
                ['property', 'og:image:height', '630'],
              ]
            : []),
          ['name', 'twitter:card', image ? 'summary_large_image' : 'summary'],
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
    react(),
    svgr(),
    ogPagesPlugin(),
  ],
})
