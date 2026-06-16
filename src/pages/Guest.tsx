import { useNavigate } from 'react-router-dom'

const games = [
  { id: 'this-or-that', label: 'This or That', desc: 'Rapid fire choices', accent: '#e11d48', soon: false },
  { id: 'hangman', label: 'Hangman', desc: 'Guess the word', accent: '#7c3aed', soon: false },
  { id: 'word-chain', label: 'Word Chain', desc: 'Connect the words', accent: '#f59e0b', soon: false },
  { id: 'countdown', label: 'Countdown', desc: 'Next big moment', accent: '#f97316', soon: false },
  { id: 'draw', label: 'Draw Together', desc: 'Shared canvas', accent: '#0ea5e9', soon: true },
]

export default function Guest() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100dvh', background: '#080808', display: 'flex', flexDirection: 'column', padding: '0 24px' }}>

      <div className="pointer-events-none fixed inset-0 z-0" style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(225,29,72,0.07) 0%, transparent 70%)',
      }} />

      <button
        onClick={() => navigate('/')}
        style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, textAlign: 'left', position: 'relative', zIndex: 10, paddingTop: 56, paddingBottom: 0 }}
      >
        ← Back
      </button>

      <div style={{ position: 'relative', zIndex: 10, marginTop: 36, display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* Header */}
        <div>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>Guest Mode</h2>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginTop: 10, lineHeight: 1.6 }}>
            Play right now — no account needed.<br />
            <span style={{ color: 'rgba(255,255,255,0.18)' }}>Nothing is saved. Create an account to keep your history.</span>
          </p>
        </div>

        {/* Game list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', marginBottom: 4 }}>Pick a game</p>
          {games.map(game => (
            <button
              key={game.id}
              onClick={() => !game.soon && navigate(`/game/${game.id}?guest=true`)}
              className="w-full text-left active:scale-95 transition-transform"
              style={{
                background: game.soon ? 'rgba(255,255,255,0.02)' : `linear-gradient(135deg, ${game.accent}12 0%, rgba(255,255,255,0.03) 100%)`,
                border: `1px solid ${game.soon ? 'rgba(255,255,255,0.04)' : game.accent + '28'}`,
                borderRadius: 16,
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: game.soon ? 0.35 : 1,
                cursor: game.soon ? 'default' : 'pointer',
                boxShadow: game.soon ? 'none' : `0 2px 16px ${game.accent}10`,
              }}
            >
              <div>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em' }}>{game.label}</p>
                <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12, marginTop: 3 }}>{game.desc}</p>
              </div>
              {game.soon
                ? <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 9, letterSpacing: '0.18em', fontWeight: 700, textTransform: 'uppercase' }}>Soon</span>
                : (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${game.accent}20`, border: `1px solid ${game.accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5h6M5 2l3 3-3 3" stroke={game.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )
              }
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate('/auth?mode=signup')}
          style={{
            width: '100%', padding: '16px', borderRadius: 16,
            background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
            boxShadow: '0 4px 28px rgba(225,29,72,0.35)',
            color: '#fff', fontWeight: 700, fontSize: 15,
            border: 'none', cursor: 'pointer', letterSpacing: '-0.01em',
          }}
          className="active:scale-95 transition-transform"
        >
          Create Free Account
        </button>

      </div>
    </div>
  )
}
