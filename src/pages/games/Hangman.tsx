import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const WORD_LIST = [
  'ADVENTURE', 'BREAKFAST', 'CHOCOLATE', 'DANCING', 'ENVELOPE',
  'FIREWORKS', 'GETAWAY', 'HONEYMOON', 'JOURNEY', 'KITCHEN',
  'LAUGHTER', 'MEMORIES', 'NECKLACE', 'OCTOBER', 'PILLOW',
  'QUICKSAND', 'ROMANCE', 'SURPRISE', 'TOGETHER', 'UMBRELLA',
  'VACATION', 'WEEKEND', 'XYLOPHONE', 'YESTERDAY', 'ZINNIA',
  'BLANKET', 'CANDLE', 'DAYDREAM', 'EMBRACE', 'FOREVER',
  'GARDEN', 'HORIZON', 'IMAGINE', 'JOURNEY', 'KINDNESS',
  'LANTERN', 'MORNING', 'NATURE', 'ORCHARD', 'PROMISE',
  'QUIET', 'RAINBOW', 'SUNSET', 'TENDER', 'UNIVERSE',
]

const MAX_WRONG = 6
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function pickWord() {
  return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]
}

export default function Hangman() {
  const navigate = useNavigate()
  const [word, setWord] = useState(() => pickWord())
  const [guessed, setGuessed] = useState<Set<string>>(new Set())

  const wrong = [...guessed].filter(l => !word.includes(l))
  const wrongCount = wrong.length
  const won = word.split('').every(l => guessed.has(l))
  const lost = wrongCount >= MAX_WRONG
  const over = won || lost

  const guess = useCallback((letter: string) => {
    if (over || guessed.has(letter)) return
    setGuessed(prev => new Set([...prev, letter]))
  }, [over, guessed])

  function reset() {
    setWord(pickWord())
    setGuessed(new Set())
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#080808', display: 'flex', flexDirection: 'column', padding: '0 20px' }}>

      <div className="pointer-events-none fixed inset-0 z-0" style={{
        background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(124,58,237,0.08) 0%, transparent 65%)',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 52, paddingBottom: 16, position: 'relative', zIndex: 10 }}>
        <button onClick={() => navigate(-1)} style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>← Back</button>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>Hangman</span>
        <span style={{ color: wrongCount >= 4 ? '#ef4444' : 'rgba(255,255,255,0.25)', fontSize: 13, fontWeight: 600 }}>{wrongCount}/{MAX_WRONG}</span>
      </div>

      {/* Gallows SVG */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
          {/* Gallows structure */}
          <line x1="20" y1="150" x2="140" y2="150" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="50" y1="150" x2="50" y2="20" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="50" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="100" y1="20" x2="100" y2="38" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round"/>
          {/* Head */}
          {wrongCount >= 1 && <circle cx="100" cy="48" r="10" stroke="#7c3aed" strokeWidth="1.8" opacity={wrongCount >= 1 ? 1 : 0}/>}
          {/* Body */}
          {wrongCount >= 2 && <line x1="100" y1="58" x2="100" y2="98" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round"/>}
          {/* Left arm */}
          {wrongCount >= 3 && <line x1="100" y1="68" x2="78" y2="86" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round"/>}
          {/* Right arm */}
          {wrongCount >= 4 && <line x1="100" y1="68" x2="122" y2="86" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round"/>}
          {/* Left leg */}
          {wrongCount >= 5 && <line x1="100" y1="98" x2="80" y2="120" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round"/>}
          {/* Right leg */}
          {wrongCount >= 6 && <line x1="100" y1="98" x2="120" y2="120" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round"/>}
        </svg>
      </div>

      {/* Word display */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap', padding: '0 8px' }}>
        {word.split('').map((letter, i) => (
          <div key={i} style={{
            width: 28, height: 36,
            borderBottom: `2px solid ${guessed.has(letter) ? '#7c3aed' : 'rgba(255,255,255,0.15)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {guessed.has(letter) && (
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>{letter}</span>
            )}
          </div>
        ))}
      </div>

      {/* Wrong letters */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', marginBottom: 20, minHeight: 20 }}>
        {wrong.length > 0 && (
          <span style={{ color: 'rgba(239,68,68,0.6)', fontSize: 13, letterSpacing: '0.15em' }}>
            {wrong.join('  ')}
          </span>
        )}
      </div>

      {/* End state */}
      {over && (
        <div style={{
          position: 'relative', zIndex: 10,
          background: won ? 'rgba(124,58,237,0.12)' : 'rgba(239,68,68,0.08)',
          border: `1px solid ${won ? 'rgba(124,58,237,0.3)' : 'rgba(239,68,68,0.2)'}`,
          borderRadius: 16, padding: '16px 20px', marginBottom: 16, textAlign: 'center',
        }}>
          <p style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>{won ? '🎉 You got it!' : 'Better luck next time'}</p>
          {lost && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 6 }}>The word was <span style={{ color: '#fff', fontWeight: 700 }}>{word}</span></p>}
          <button
            onClick={reset}
            style={{
              marginTop: 14, padding: '12px 28px', borderRadius: 12,
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
            }}
            className="active:scale-95 transition-transform"
          >
            New Word
          </button>
        </div>
      )}

      {/* Keyboard */}
      {!over && (
        <div style={{ position: 'relative', zIndex: 10, flex: 1 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
            {ALPHABET.map(letter => {
              const isGuessed = guessed.has(letter)
              const isWrong = isGuessed && !word.includes(letter)
              const isCorrect = isGuessed && word.includes(letter)
              return (
                <button
                  key={letter}
                  onClick={() => guess(letter)}
                  disabled={isGuessed}
                  style={{
                    width: 36, height: 40, borderRadius: 8,
                    background: isWrong ? 'rgba(239,68,68,0.08)' : isCorrect ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.05)',
                    border: isWrong ? '1px solid rgba(239,68,68,0.2)' : isCorrect ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    color: isWrong ? 'rgba(239,68,68,0.4)' : isCorrect ? '#a78bfa' : '#fff',
                    fontWeight: 700, fontSize: 13,
                    cursor: isGuessed ? 'default' : 'pointer',
                    opacity: isGuessed ? 0.5 : 1,
                    transition: 'all 0.15s',
                  }}
                  className={isGuessed ? '' : 'active:scale-90'}
                >
                  {letter}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div style={{ height: 24 }} />
    </div>
  )
}
