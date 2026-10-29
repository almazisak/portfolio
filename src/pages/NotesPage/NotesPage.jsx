import { useEffect, useId, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import HeroBar from '../../components/HeroBar/HeroBar'
import { formatDate, getNote, getProject } from '../../lib/notes'
import renderMarkdown from '../../lib/renderMarkdown'
import './NotesPage.css'

const STATUS_LABEL = { exploring: 'Exploring', 'in progress': 'In progress', shipped: 'Shipped' }

function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title
    document.title = title
    return () => { document.title = previous }
  }, [title])
}

// Open on top, unless the URL points at a post inside the feed.
function useScrollToHash(key) {
  useEffect(() => {
    const id = window.location.hash.slice(1)
    const target = id && document.getElementById(id)
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [key])
}

function Shell({ title, backTo, children }) {
  const navigate = useNavigate()
  return (
    <div className="notes-page">
      <HeroBar onBack={() => navigate(backTo)} title={title} showTitle />
      <main className="notes-page__main">{children}</main>
      <footer className="notes-page__footer">
        <span>Almaz Isakov</span>
        <Link to="/" className="notes-page__footer-link">Home</Link>
      </footer>
    </div>
  )
}

function Status({ value }) {
  if (!value) return null
  return <span className="notes-page__status">{STATUS_LABEL[value] ?? value}</span>
}

function NotFound() {
  useDocumentTitle('Not found – Almaz Isakov')
  return (
    <Shell title="Not found" backTo="/">
      <h1 className="notes-page__title">Not found</h1>
      <p className="notes-page__lead">There is nothing at this address. <Link to="/">Back to home</Link></p>
    </Shell>
  )
}

// Feed posts taller than this are collapsed behind "Read more". The extra slack keeps a post
// that overflows by a line or two from being collapsed for almost nothing.
const COLLAPSED_HEIGHT = 320
const COLLAPSE_SLACK = 48

function PostBody({ children, collapsible, startOpen }) {
  const ref = useRef(null)
  const id = useId()
  const [overflowing, setOverflowing] = useState(false)
  const [open, setOpen] = useState(startOpen)

  useEffect(() => {
    const el = ref.current
    if (!collapsible || !el) return undefined
    // Fires once on observe and again whenever the width (and so the height) changes.
    const observer = new ResizeObserver(() => {
      setOverflowing(el.scrollHeight > COLLAPSED_HEIGHT + COLLAPSE_SLACK)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [collapsible])

  const collapsed = collapsible && overflowing && !open
  return (
    <>
      <div
        ref={ref}
        id={id}
        className={`notes-post__body${collapsed ? ' notes-post__body--collapsed' : ''}`}
        style={collapsed ? { maxHeight: COLLAPSED_HEIGHT } : undefined}
      >
        {children}
      </div>
      {collapsible && overflowing && (
        <button type="button" className="notes-post__toggle" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
          {open ? 'Show less' : 'Read more'}
        </button>
      )}
    </>
  )
}

// One post. In the feed the title (optional) is an h2 and the date links to the post's own
// page; on the post page the title is the page's h1 and the date is plain.
function Post({ project, note, feed }) {
  const permalink = `/notes/${project.slug}/${note.slug}`
  const label = `${note.title || project.title}, ${formatDate(note.date)}`
  const date = <time dateTime={note.date}>{formatDate(note.date)}</time>
  const Title = feed ? 'h2' : 'h1'
  const startOpen = feed && window.location.hash === `#${note.slug}`
  return (
    <article className="notes-post" id={feed ? note.slug : undefined}>
      <p className="notes-post__date">
        {feed ? <Link to={permalink} aria-label={`${label}: open post`}>{date}</Link> : date}
      </p>
      {note.title ? (
        <Title className="notes-post__title">{note.title}</Title>
      ) : (
        !feed && <h1 className="notes-post__sr">{label}</h1>
      )}
      <PostBody collapsible={feed} startOpen={startOpen}>
        <div className="notes-page__prose">
          {renderMarkdown(note.body, `/notes/${project.slug}`, feed && note.title ? 3 : 2)}
        </div>
      </PostBody>
    </article>
  )
}

// /notes has no page of its own: projects are entered from the home page.
export function NotesIndex() {
  return <Navigate to="/" replace />
}

export function NotesProject() {
  const { project: slug } = useParams()
  const project = getProject(slug)
  useDocumentTitle(project ? `${project.title} – Notes – Almaz Isakov` : 'Not found – Almaz Isakov')
  useScrollToHash(slug)
  if (!project) return <NotFound />

  return (
    <Shell title={project.title} backTo="/">
      <header className="notes-page__head">
        <h1 className="notes-page__title">{project.title}</h1>
        <div className="notes-page__badges">
          <Status value={project.status} />
          {project.case && (
            <a className="notes-page__case" href={project.case} target="_blank" rel="noopener noreferrer">Read the case</a>
          )}
        </div>
        {project.cover && <img className="notes-page__cover" src={project.cover} alt="" />}
        <div className="notes-page__prose">
          {project.intro
            ? renderMarkdown(project.intro, `/notes/${project.slug}`)
            : project.summary && <p>{project.summary}</p>}
        </div>
      </header>
      <div className="notes-feed">
        {project.entries.map(note => <Post key={note.slug} project={project} note={note} feed />)}
      </div>
    </Shell>
  )
}

export function NotesEntry() {
  const { project: projectSlug, slug } = useParams()
  const project = getProject(projectSlug)
  const note = getNote(projectSlug, slug)
  useDocumentTitle(note ? `${note.title || formatDate(note.date)} – ${project.title} – Almaz Isakov` : 'Not found – Almaz Isakov')
  useScrollToHash(`${projectSlug}/${slug}`)
  if (!note) return <NotFound />

  return (
    <Shell title={project.title} backTo={`/notes/${project.slug}`}>
      <p className="notes-page__crumb"><Link to={`/notes/${project.slug}`}>← {project.title}</Link></p>
      <Post project={project} note={note} />
    </Shell>
  )
}
