import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const STARTER_WORDS = [
  'LOVE', 'ROSE', 'KISS', 'DATE', 'STAR', 'MOON', 'DREAM', 'HEART',
  'SWEET', 'DANCE', 'SMILE', 'FLAME', 'SPARK', 'LIGHT', 'TENDER',
]

function getStarter() {
  return STARTER_WORDS[Math.floor(Math.random() * STARTER_WORDS.length)]
}

export default function WordChain() {
  const navigate = useNavigate()
  const [chain, setChain] = useState<string[]>(() => [getStarter()])
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [turn, setTurn] = useState<'you' | 'partner'>('you')
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const lastWord = chain[chain.length - 1]
  const requiredLetter = lastWord[lastWord.length - 1]

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [chain])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const word = input.trim().toUpperCase().replace(/[^A-Z]/g, '')

    if (word.length < 2) {
      setError('Must be at least 2 letters')
      return
    }
    if (word[0] !== requiredLetter) {
      setError(`Must start with ${requiredLetter}`)
      return
    }
    if (chain.includes(word)) {
      setError('Already used!')
      return
    }

    setChain(prev => [...prev, word])
    setInput('')
    setError('')
    setTurn(t => t === 'you' ? 'partner' : 'you')
    inputRef.current?.focus()
  }

  function reset() {
    setChain([getStarter()])
    setInput('')
    setError('')
    setTurn('you')
  }

  const accentColor = '#f59e0b'

  return (
    <div style={{ minHeight: '100dvh', background: '#080808', display: 'flex', flexDirection: 'column', padding: '0 20px' }}>

      <div className="pointer-events-none fixed inset-0 z-0" style={{
        background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(245,158,11,0.07) 0%, transparent 65%)',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 52, paddingBottom: 16, position: 'relative', zIndex: 10 }}>
        <button onClick={() => navigate(-1)} style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>← Back</button>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>Word Chain</span>
        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, fontWeight: 600 }}>{chain.length - 1} links</span>
      </div>

      {/* Turn indicator */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['you', 'partner'] as const).map(t => (
          <div key={t} style={{
            flex: 1, padding: '10px', borderRadius: 12, textAlign: 'center',
            background: turn === t ? `${accentColor}18` : 'rgba(255,255,255,0.02)',
            border: `1px solid ${turn === t ? accentColor + '40' : 'rgba(255,255,255,0.05)'}`,
            transition: 'all 0.3s',
          }}>
            <p style={{ color: turn === t ? accentColor : 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {t === 'you' ? 'You' : 'Partner'}
            </p>
          </div>
        ))}
      </div>

      {/* Required letter prompt */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', marginBottom: 12 }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
          Next word must start with{' '}
          <span style={{ color: accentColor, fontWeight: 800, fontSize: 20 }}>{requiredLetter}</span>
        </p>
      </div>

      {/* Chain display */}
      <div
        ref={listRef}
        style={{
          position: 'relative', zIndex: 10,
          overflowY: 'auto', marginBottom: 16,
          display: 'flex', flexDirection: 'column', gap: 6,
          maxHeight: '45vh',
          padding: '4px 0',
        }}
      >
        {chain.map((word, i) => {
          const isLast = i === chain.length - 1
          const isYou = i % 2 === 1
          return (
            <div key={i} style={{
              alignSelf: i === 0 ? 'center' : isYou ? 'flex-end' : 'flex-start',
              background: i === 0
                ? 'rgba(255,255,255,0.04)'
                : isYou ? `${accentColor}18` : 'rgba(255,255,255,0.06)',
              border: `1px solid ${i === 0 ? 'rgba(255,255,255,0.08)' : isYou ? accentColor + '30' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 12,
              padding: '8px 16px',
            }}>
              <span style={{
                color: isLast ? '#fff' : 'rgba(255,255,255,0.6)',
                fontWeight: isLast ? 800 : 600,
                fontSize: isLast ? 18 : 15,
                letterSpacing: '0.05em',
              }}>
                {word.slice(0, -1)}
                <span style={{ color: accentColor }}>{word[word.length - 1]}</span>
              </span>
            </div>
          )
        })}
      </div>

      {/* Input form */}
      <div style={{ position: 'relative', zIndex: 10, marginBottom: 24 }}>
        <form onSubmit={submit}>
          <div style={{ position: 'relative' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => { setInput(e.target.value); setError('') }}
              placeholder={`Start with ${requiredLetter}...`}
              autoComplete="off"
              autoCapitalize="characters"
              style={{
                width: '100%', padding: '16px 60px 16px 20px',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${error ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 16, color: '#fff', fontSize: 18, fontWeight: 700,
                outline: 'none', letterSpacing: '0.06em', textTransform: 'uppercase',
                boxSizing: 'border-box',
              }}
            />
            <button
              type="submit"
              style={{
                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                width: 40, height: 40, borderRadius: 12,
                background: `linear-gradient(135deg, ${accentColor}, #d97706)`,
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          {error && (
            <p style={{ color: '#ef4444', fontSize: 12, marginTop: 8, paddingLeft: 4 }}>{error}</p>
          )}
        </form>

        <button
          onClick={reset}
          style={{ width: '100%', padding: '12px', marginTop: 12, color: 'rgba(255,255,255,0.18)', fontSize: 13, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', background: 'transparent' }}
        >
          New Game
        </button>
      </div>
    </div>
  )
}
