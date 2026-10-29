import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import HeroBar from '../../components/HeroBar/HeroBar'
import { formatDate, getNote, getProject } from '../../lib/notes'
import renderMarkdown from '../../lib/renderMarkdown'
import './NotesPage.css'


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

// With `revealTitle` the bar shows the title only once the page's own h1 has scrolled
// under it, so the two never appear together. 76px is roughly the bar's height.
function Shell({ title, backTo, revealTitle = false, children }) {
  const navigate = useNavigate()
  const mainRef = useRef(null)
  const [h1Visible, setH1Visible] = useState(true)

  useEffect(() => {
    const h1 = revealTitle && mainRef.current?.querySelector('h1')
    if (!h1) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => setH1Visible(entry.isIntersecting),
      { rootMargin: '-76px 0px 0px 0px' },
    )
    observer.observe(h1)
    return () => observer.disconnect()
  }, [revealTitle])

  return (
    <div className="notes-page">
      <HeroBar
        onBack={() => navigate(backTo)}
        title={title}
        showTitle={!revealTitle || !h1Visible}
        variant="notes"
      />
      <main ref={mainRef} className="notes-page__main">{children}</main>
      <footer className="notes-page__footer">
        <span>Almaz Isakov</span>
        <Link to="/" className="notes-page__footer-link">Home</Link>
      </footer>
    </div>
  )
}

function NotFound() {
  useDocumentTitle('Not found – Almaz Isakov')
  return (
    <Shell title="Not found" backTo="/" revealTitle>
      <h1 className="notes-page__title">Not found</h1>
      <p className="notes-page__lead">There is nothing at this address. <Link to="/">Back to home</Link></p>
    </Shell>
  )
}

// One post. In the feed the title (optional) is an h2 and the date links to the post's own
// page; on the post page the title is the page's h1 and the date is plain.
function Post({ project, note, feed }) {
  const permalink = `/notes/${project.slug}/${note.slug}`
  const label = `${note.title || project.title}, ${formatDate(note.date)}`
  const date = <time dateTime={note.date}>{formatDate(note.date)}</time>
  const Title = feed ? 'h2' : 'h1'
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
      <div className="notes-page__prose">
        {renderMarkdown(note.body, `/notes/${project.slug}`, feed && note.title ? 3 : 2)}
      </div>
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
    <Shell title={project.title} backTo="/" revealTitle>
      <header className="notes-page__head">
        <h1 className="notes-page__title">{project.title}</h1>
        {project.case && (
          <a className="notes-page__case" href={project.case} target="_blank" rel="noopener noreferrer">Read the case</a>
        )}
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
      <Post project={project} note={note} />
    </Shell>
  )
}
