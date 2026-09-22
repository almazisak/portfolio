import { Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import HomePage from './pages/HomePage/HomePage'
import CaseLayout from './layouts/CaseLayout'
import BalatyPage from './pages/BalatyPage/BalatyPage'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work/balaty" element={<BalatyPage />} />
        <Route path="/work/:slug" element={<CaseLayout />} />
      </Routes>
      <Analytics />
    </>
  )
}
