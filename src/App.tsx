import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Pair from './pages/Pair'
import Home from './pages/Home'

function Spinner() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-[#0d0d0d]">
      <div
        className="w-2 h-2 rounded-full animate-ping"
        style={{ backgroundColor: '#e11d48' }}
      />
    </div>
  )
}

export default function App() {
  const { user, profile, loading } = useAuth()

  if (loading) return <Spinner />

  const paired = !!profile?.couple_id

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={!user ? <Landing /> : paired ? <Navigate to="/home" /> : <Navigate to="/pair" />}
        />
        <Route
          path="/auth"
          element={!user ? <Auth /> : paired ? <Navigate to="/home" /> : <Navigate to="/pair" />}
        />
        <Route
          path="/pair"
          element={!user ? <Navigate to="/" /> : paired ? <Navigate to="/home" /> : <Pair />}
        />
        <Route
          path="/home"
          element={!user ? <Navigate to="/" /> : !paired ? <Navigate to="/pair" /> : <Home />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
