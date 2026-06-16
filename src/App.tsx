import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Pair from './pages/Pair'
import Home from './pages/Home'
import Guest from './pages/Guest'
import ThisOrThat from './pages/games/ThisOrThat'
import Hangman from './pages/games/Hangman'
import WordChain from './pages/games/WordChain'
import Countdown from './pages/games/Countdown'

function Spinner() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-[#0a0a0a]">
      <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: '#e11d48' }} />
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
        <Route path="/" element={!user ? <Landing /> : paired ? <Navigate to="/home" /> : <Navigate to="/pair" />} />
        <Route path="/auth" element={!user ? <Auth /> : paired ? <Navigate to="/home" /> : <Navigate to="/pair" />} />
        <Route path="/pair" element={!user ? <Navigate to="/" /> : paired ? <Navigate to="/home" /> : <Pair />} />
        <Route path="/home" element={!user ? <Navigate to="/" /> : !paired ? <Navigate to="/pair" /> : <Home />} />
        <Route path="/guest" element={<Guest />} />
        <Route path="/game/this-or-that" element={<ThisOrThat />} />
        <Route path="/game/hangman" element={<Hangman />} />
        <Route path="/game/word-chain" element={<WordChain />} />
        <Route path="/game/countdown" element={<Countdown />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
