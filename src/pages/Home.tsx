import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const games = [
  {
    id: 'this-or-that',
    label: 'This or That',
    desc: 'Rapid fire choices',
    ready: true,
    accent: '#e11d48',
    accentDim: 'rgba(225,29,72,0.15)',
    icon: <IconThisOrThat />,
  },
  {
    id: 'hangman',
    label: 'Hangman',
    desc: 'Guess the word',
    ready: true,
    accent: '#7c3aed',
    accentDim: 'rgba(124,58,237,0.12)',
    icon: <IconHangman />,
  },
  {
    id: 'word-chain',
    label: 'Word Chain',
    desc: 'Connect the words',
    ready: true,
    accent: '#f59e0b',
    accentDim: 'rgba(245,158,11,0.12)',
    icon: <IconWordChain />,
  },
  {
    id: 'countdown',
    label: 'Countdown',
    desc: 'Next big moment',
    ready: true,
    accent: '#f97316',
    accentDim: 'rgba(249,115,22,0.12)',
    icon: <IconCountdown />,
  },
  {
    id: 'draw',
    label: 'Draw Together',
    desc: 'Shared canvas',
    ready: false,
    accent: '#0ea5e9',
    accentDim: 'rgba(14,165,233,0.12)',
    icon: <IconDraw />,
  },
  {
    id: 'compass',
    label: 'Compass',
    desc: 'Find each other',
    ready: false,
    accent: '#10b981',
    accentDim: 'rgba(16,185,129,0.12)',
    icon: <IconCompass />,
  },
]

export default function Home() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ minHeight: '100dvh', background: '#080808', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Ambient top glow */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{
        background: 'radial-gradient(ellipse 120% 35% at 50% -5%, rgba(225,29,72,0.1) 0%, transparent 65%)',
      }} />

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '56px 24px 20px' }}>
        <div>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.05em' }}>LOVT</span>
          {profile?.display_name && (
            <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: 12, marginTop: 2, fontWeight: 400 }}>
              {profile.display_name}
            </p>
          )}
        </div>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(m => !m)}
            style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 3 }}
          >
            {[0,1,2].map(i => <span key={i} style={{ width: 14, height: 1.5, background: 'rgba(255,255,255,0.5)', borderRadius: 2, display: 'block' }} />)}
          </button>
          {menuOpen && (
            <div style={{ position: 'absolute', top: 44, right: 0, background: '#161616', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden', minWidth: 150, zIndex: 100, boxShadow: '0 16px 48px rgba(0,0,0,0.6)' }}>
              <button
                onClick={() => { setMenuOpen(false); supabase.auth.signOut() }}
                style={{ width: '100%', padding: '13px 18px', color: '#ff4d6d', fontSize: 14, textAlign: 'left', fontWeight: 600 }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Section heading */}
      <div style={{ padding: '0 24px 16px', position: 'relative', zIndex: 10 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>Play Together</p>
      </div>

      {/* Games grid */}
      <div style={{ padding: '0 24px', flex: 1, position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {games.map(game => (
            <button
              key={game.id}
              onClick={() => game.ready && navigate(`/game/${game.id}`)}
              className="active:scale-95 transition-transform"
              style={{
                padding: '18px 16px',
                borderRadius: 18,
                background: game.ready
                  ? `linear-gradient(145deg, ${game.accentDim} 0%, rgba(255,255,255,0.03) 100%)`
                  : 'rgba(255,255,255,0.02)',
                border: `1px solid ${game.ready ? game.accent + '30' : 'rgba(255,255,255,0.04)'}`,
                cursor: game.ready ? 'pointer' : 'default',
                opacity: game.ready ? 1 : 0.4,
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'left',
                boxShadow: game.ready ? `0 4px 24px ${game.accent}15` : 'none',
              }}
            >
              {/* Top accent line */}
              {game.ready && (
                <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, background: `linear-gradient(90deg, transparent, ${game.accent}80, transparent)` }} />
              )}

              {/* Icon */}
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: `${game.accent}18`,
                border: `1px solid ${game.accent}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 14,
              }}>
                {game.icon}
              </div>

              <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{game.label}</p>
              <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 11, marginTop: 4, fontWeight: 400 }}>{game.desc}</p>
              {!game.ready && (
                <p style={{ color: 'rgba(255,255,255,0.12)', fontSize: 9, letterSpacing: '0.18em', marginTop: 10, textTransform: 'uppercase', fontWeight: 700 }}>Coming Soon</p>
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: 32 }} />
    </div>
  )
}

function IconThisOrThat() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h12M10 4l6 6-6 6" stroke="#e11d48" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconHangman() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="6" r="2.5" stroke="#7c3aed" strokeWidth="1.6"/>
      <path d="M10 8.5v5M7.5 11h5M8 16l-1.5 2M12 16l1.5 2" stroke="#7c3aed" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}

function IconDraw() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 17l3-1 9-9a1.414 1.414 0 00-2-2L4 14l-1 3z" stroke="#0ea5e9" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M13 5l2 2" stroke="#0ea5e9" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}

function IconWordChain() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="5" cy="10" r="2.5" stroke="#f59e0b" strokeWidth="1.6"/>
      <circle cx="15" cy="10" r="2.5" stroke="#f59e0b" strokeWidth="1.6"/>
      <path d="M7.5 10h5" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="2 1.5"/>
    </svg>
  )
}

function IconCompass() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="#10b981" strokeWidth="1.6"/>
      <path d="M10 6l1.5 4.5L10 14l-1.5-3.5L10 6z" fill="#10b981" opacity="0.8"/>
      <circle cx="10" cy="10" r="1" fill="#10b981"/>
    </svg>
  )
}

function IconCountdown() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="#f97316" strokeWidth="1.6"/>
      <path d="M10 6v4l2.5 2.5" stroke="#f97316" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
