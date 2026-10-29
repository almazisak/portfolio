import { Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import HomePage from './pages/HomePage/HomePage'
import BalatyPage from './pages/BalatyPage/BalatyPage'
import { NotesIndex, NotesProject, NotesEntry } from './pages/NotesPage/NotesPage'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work/balaty" element={<BalatyPage />} />
        <Route path="/notes" element={<NotesIndex />} />
        <Route path="/notes/:project" element={<NotesProject />} />
        <Route path="/notes/:project/:slug" element={<NotesEntry />} />
      </Routes>
      <Analytics />
    </>
  )
}
