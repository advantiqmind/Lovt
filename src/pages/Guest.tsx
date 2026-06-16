import { useNavigate } from 'react-router-dom'

const games = [
  { id: 'this-or-that', icon: '⚡', label: 'This or That', desc: 'Rapid fire choices' },
  { id: 'hangman', icon: '✏️', label: 'Hangman', desc: 'Guess the word', soon: true },
  { id: 'draw', icon: '🎨', label: 'Draw Together', desc: 'Shared canvas', soon: true },
  { id: 'word-chain', icon: '🔗', label: 'Word Chain', desc: 'Connect the words', soon: true },
]

export default function Guest() {
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-[#0a0a0a] flex flex-col px-6 py-16">

      <div className="pointer-events-none fixed inset-0 z-0" style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(225,29,72,0.06) 0%, transparent 70%)',
      }} />

      <button
        onClick={() => navigate('/')}
        style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, textAlign: 'left', position: 'relative', zIndex: 10 }}
      >
        ← Back
      </button>

      <div className="relative z-10 mt-10 space-y-8">

        {/* Guest notice */}
        <div style={{
          background: 'rgba(225,29,72,0.08)',
          border: '1px solid rgba(225,29,72,0.2)',
          borderRadius: 16,
          padding: '16px 20px',
        }}>
          <p style={{ color: '#ff4d6d', fontWeight: 600, fontSize: 14 }}>Guest Mode</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
            Play right now — no account needed. Nothing is saved. For keeps, create a free account.
          </p>
        </div>

        <div>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>
            Pick a game
          </p>
          <div className="space-y-3">
            {games.map(game => (
              <button
                key={game.id}
                onClick={() => !game.soon && navigate(`/game/${game.id}?guest=true`)}
                className="w-full text-left active:scale-95 transition-transform"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${game.soon ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 16,
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  opacity: game.soon ? 0.4 : 1,
                  cursor: game.soon ? 'default' : 'pointer',
                }}
              >
                <span style={{ fontSize: 28 }}>{game.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#fff', fontWeight: 600, fontSize: 16 }}>{game.label}</p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 2 }}>{game.desc}</p>
                </div>
                {game.soon
                  ? <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, letterSpacing: '0.1em' }}>SOON</span>
                  : <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 18 }}>›</span>
                }
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate('/auth?mode=signup')}
          style={{
            width: '100%', padding: '16px', borderRadius: 16,
            background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
            boxShadow: '0 4px 24px rgba(225,29,72,0.3)',
            color: '#fff', fontWeight: 600, fontSize: 15,
            border: 'none', cursor: 'pointer',
          }}
          className="active:scale-95 transition-transform"
        >
          Create Free Account
        </button>

      </div>
    </div>
  )
}
