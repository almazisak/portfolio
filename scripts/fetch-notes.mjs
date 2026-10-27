// Pulls the public notes repo and turns it into src/lib/notes.generated.json
// plus public/notes/<project>/assets/*. Runs before `dev` and `build`.
//
//   NOTES_SRC=../portfolio-notes npm run dev   use a local checkout instead of cloning
//
// Folders and files starting with `_` are skipped (templates, drafts).
import { execFileSync } from 'node:child_process'
import { cp, mkdir, mkdtemp, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO_URL = 'https://github.com/almazisak/portfolio-notes.git'
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outJson = path.join(root, 'src/lib/notes.generated.json')
const outAssets = path.join(root, 'public/notes')

const exists = (p) => stat(p).then(() => true, () => false)

// Flat `key: value` frontmatter. Trailing `# comment` is dropped (the project template has one).
function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, body: text }
  const data = {}
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/)
    if (!m) continue
    data[m[1]] = m[2].replace(/\s+#.*$/, '').replace(/^(['"])(.*)\1$/, '$2').trim()
  }
  return { data, body: match[2].trim() }
}

async function readSource() {
  if (process.env.NOTES_SRC) return { dir: path.resolve(root, process.env.NOTES_SRC), cleanup: async () => {} }
  const dir = await mkdtemp(path.join(tmpdir(), 'notes-'))
  execFileSync('git', ['clone', '--depth', '1', '--quiet', REPO_URL, dir], { stdio: 'inherit' })
  return { dir, cleanup: () => rm(dir, { recursive: true, force: true }) }
}

async function build(dir) {
  const projects = []
  await rm(outAssets, { recursive: true, force: true })

  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('_') || entry.name.startsWith('.')) continue
    const projectDir = path.join(dir, entry.name)
    const indexPath = path.join(projectDir, 'index.md')
    if (!(await exists(indexPath))) continue

    const { data: meta, body: intro } = parseFrontmatter(await readFile(indexPath, 'utf8'))
    const assetsDir = path.join(projectDir, 'assets')
    const hasAssets = await exists(assetsDir)
    if (hasAssets) await cp(assetsDir, path.join(outAssets, entry.name, 'assets'), { recursive: true })

    let cover = ''
    if (meta.cover) {
      const rel = meta.cover.replace(/^\.\//, '')
      if (await exists(path.join(projectDir, rel))) cover = `/notes/${entry.name}/${rel}`
    }

    const entries = []
    const seen = new Set()
    for (const file of await readdir(projectDir)) {
      const m = file.match(/^(\d{4}-\d{2}-\d{2})(?:-(.+))?\.md$/)
      if (!m || file.startsWith('_')) continue
      // `YYYY-MM-DD-slug.md`; without a slug the date itself is the URL part
      const [, date, name] = m
      const slug = name || date
      if (seen.has(slug)) throw new Error(`Duplicate note slug "${slug}" in ${entry.name}`)
      seen.add(slug)
      const { data, body } = parseFrontmatter(await readFile(path.join(projectDir, file), 'utf8'))
      entries.push({ slug, date: data.date || date, title: data.title || '', body })
    }
    entries.sort((a, b) => b.date.localeCompare(a.date))

    projects.push({
      slug: entry.name,
      title: meta.title || entry.name,
      status: meta.status || '',
      summary: meta.summary || '',
      case: meta.case || '',
      cover,
      intro,
      entries,
    })
  }

  projects.sort((a, b) => (b.entries[0]?.date ?? '').localeCompare(a.entries[0]?.date ?? ''))
  await mkdir(path.dirname(outJson), { recursive: true })
  await writeFile(outJson, JSON.stringify({ projects }, null, 2) + '\n')
  console.log(`notes: ${projects.length} project(s), ${projects.reduce((n, p) => n + p.entries.length, 0)} note(s)`)
}

let source
try {
  source = await readSource()
  await build(source.dir)
} catch (error) {
  // On Vercel a missing source must fail the deploy; locally keep working offline.
  if (process.env.VERCEL) throw error
  if (await exists(outJson)) {
    console.warn(`notes: could not fetch (${error.message}); keeping the previous ${path.relative(root, outJson)}`)
  } else {
    await mkdir(path.dirname(outJson), { recursive: true })
    await writeFile(outJson, JSON.stringify({ projects: [] }) + '\n')
    console.warn(`notes: could not fetch (${error.message}); wrote an empty list`)
  }
} finally {
  await source?.cleanup()
}
