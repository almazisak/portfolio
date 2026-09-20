import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import CaseLayout from './layouts/CaseLayout'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/work/:slug" element={<CaseLayout />} />
    </Routes>
  )
}
