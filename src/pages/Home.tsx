import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const games = [
  { id: 'this-or-that', icon: '⚡', label: 'This or That', desc: 'Rapid fire choices', ready: true },
  { id: 'hangman', icon: '✏️', label: 'Hangman', desc: 'Guess the word', ready: false },
  { id: 'draw', icon: '🎨', label: 'Draw Together', desc: 'Shared canvas', ready: false },
  { id: 'word-chain', icon: '🔗', label: 'Word Chain', desc: 'Connect the words', ready: false },
  { id: 'compass', icon: '🧭', label: 'Compass', desc: 'Find each other', ready: false },
  { id: 'countdown', icon: '📅', label: 'Countdown', desc: 'Next big moment', ready: false },
]

export default function Home() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-dvh bg-[#0a0a0a] flex flex-col overflow-hidden">

      <div className="pointer-events-none fixed inset-0 z-0" style={{
        background: 'radial-gradient(ellipse 100% 40% at 50% 0%, rgba(225,29,72,0.07) 0%, transparent 60%)',
      }} />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-14 pb-6">
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>Lovt</h1>
          {profile?.display_name && (
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, marginTop: 3 }}>
              Hey, {profile.display_name}
            </p>
          )}
        </div>
        <button
          onClick={() => setMenuOpen(m => !m)}
          style={{ color: 'rgba(255,255,255,0.25)', fontSize: 22, padding: '4px 8px' }}
        >
          ···
        </button>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: 90, right: 24, zIndex: 50,
          background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14, overflow: 'hidden', minWidth: 160,
        }}>
          <button
            onClick={() => { setMenuOpen(false); supabase.auth.signOut() }}
            style={{ width: '100%', padding: '14px 20px', color: '#ff4d6d', fontSize: 14, textAlign: 'left', fontWeight: 500 }}
          >
            Sign Out
          </button>
        </div>
      )}

      {/* Section label */}
      <div className="relative z-10 px-6 mb-4">
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
          Play Together
        </p>
      </div>

      {/* Games grid */}
      <div className="relative z-10 px-6 flex-1">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {games.map(game => (
            <button
              key={game.id}
              onClick={() => game.ready && navigate(`/game/${game.id}`)}
              className="text-left active:scale-95 transition-transform"
              style={{
                padding: '20px 18px',
                borderRadius: 20,
                background: game.ready ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                border: game.ready ? '1px solid rgba(255,255,255,0.09)' : '1px solid rgba(255,255,255,0.04)',
                cursor: game.ready ? 'pointer' : 'default',
                opacity: game.ready ? 1 : 0.45,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {game.ready && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                  background: 'linear-gradient(90deg, transparent, rgba(225,29,72,0.4), transparent)',
                }} />
              )}
              <div style={{ fontSize: 28, marginBottom: 10 }}>{game.icon}</div>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>{game.label}</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 3 }}>{game.desc}</p>
              {!game.ready && (
                <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 10, letterSpacing: '0.15em', marginTop: 8, textTransform: 'uppercase' }}>Soon</p>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="h-8" />
    </div>
  )
}
