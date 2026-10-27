import { Link } from 'react-router-dom'

// Minimal Markdown renderer for notes: headings, paragraphs, lists, quotes, fenced code,
// rules, images, and inline bold / italic / code / links. Builds React elements only
// (no raw HTML), so note text can never inject markup.

const INLINE = /(`[^`]+`)|(!\[[^\]]*\]\([^)]+\))|(\[[^\]]+\]\([^)]+\))|(\*\*[^*]+\*\*)|(\*[^*\s][^*]*\*)/

function resolveAsset(src, base) {
  if (/^https?:\/\//.test(src) || src.startsWith('/')) return src
  return `${base}/${src.replace(/^\.\//, '')}`
}

function renderLink(label, href, key) {
  if (/^https?:\/\//.test(href) || href.startsWith('mailto:')) {
    return <a key={key} href={href} target="_blank" rel="noopener noreferrer">{label}</a>
  }
  if (href.startsWith('/')) return <Link key={key} to={href}>{label}</Link>
  return label // relative .md links are not routable on the site
}

function renderInline(text, base, keyPrefix = '') {
  const out = []
  let rest = text
  let i = 0
  while (rest) {
    const m = INLINE.exec(rest)
    if (!m) { out.push(rest); break }
    if (m.index > 0) out.push(rest.slice(0, m.index))
    const key = `${keyPrefix}${i++}`
    const token = m[0]
    if (m[1]) {
      out.push(<code key={key}>{token.slice(1, -1)}</code>)
    } else if (m[2]) {
      const [, alt, src] = token.match(/!\[([^\]]*)\]\(([^)]+)\)/)
      out.push(<img key={key} src={resolveAsset(src, base)} alt={alt} loading="lazy" />)
    } else if (m[3]) {
      const [, label, href] = token.match(/\[([^\]]+)\]\(([^)]+)\)/)
      out.push(renderLink(renderInline(label, base, `${key}-`), href, key))
    } else if (m[4]) {
      out.push(<strong key={key}>{renderInline(token.slice(2, -2), base, `${key}-`)}</strong>)
    } else {
      out.push(<em key={key}>{renderInline(token.slice(1, -1), base, `${key}-`)}</em>)
    }
    rest = rest.slice(m.index + token.length)
  }
  return out
}

// `base` is the public URL of the project folder, e.g. /notes/example-project.
// `topLevel` is the heading level a single `#` renders as (the page's own title sits above it).
export default function renderMarkdown(source, base, topLevel = 2) {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const blocks = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const key = blocks.length

    if (!line.trim()) { i++; continue }

    if (line.startsWith('```')) {
      const code = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++])
      i++
      blocks.push(<pre key={key}><code>{code.join('\n')}</code></pre>)
      continue
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/)
    if (heading) {
      const Tag = `h${Math.min(heading[1].length - 1 + topLevel, 6)}`
      blocks.push(<Tag key={key}>{renderInline(heading[2], base)}</Tag>)
      i++
      continue
    }

    if (/^(-{3,}|\*{3,})$/.test(line.trim())) { blocks.push(<hr key={key} />); i++; continue }

    if (line.startsWith('>')) {
      const quote = []
      while (i < lines.length && lines[i].startsWith('>')) quote.push(lines[i++].replace(/^>\s?/, ''))
      blocks.push(<blockquote key={key}>{renderInline(quote.join(' '), base)}</blockquote>)
      continue
    }

    const listItem = /^(\s*)([-*]|\d+\.)\s+(.*)$/
    if (listItem.test(line)) {
      const ordered = /^\s*\d+\./.test(line)
      const items = []
      while (i < lines.length && listItem.test(lines[i])) items.push(lines[i++].match(listItem)[3])
      const Tag = ordered ? 'ol' : 'ul'
      blocks.push(<Tag key={key}>{items.map((item, n) => <li key={n}>{renderInline(item, base)}</li>)}</Tag>)
      continue
    }

    const para = []
    while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|```|>|(\s*)([-*]|\d+\.)\s)/.test(lines[i])) para.push(lines[i++])
    blocks.push(<p key={key}>{renderInline(para.join(' '), base)}</p>)
  }

  return blocks
}
