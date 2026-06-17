import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const WORD_POOL: Record<string, string[]> = {
  A: ['ADVENTURE', 'ANCHOR', 'AMBER', 'ANGEL', 'ARROW', 'ATLAS', 'AUTUMN', 'AZURE'],
  B: ['BRAVE', 'BREEZE', 'BRIGHT', 'BLOOM', 'BLISS', 'BRIDGE', 'BRONZE', 'BUTTER'],
  C: ['CANDLE', 'CASTLE', 'CHARM', 'CHERRY', 'CLOUD', 'CORAL', 'COZY', 'CRYSTAL'],
  D: ['DANCE', 'DAYDREAM', 'DAZZLE', 'DELIGHT', 'DREAM', 'DRIFT', 'DUSK', 'DUNE'],
  E: ['EMBER', 'EMBRACE', 'ETERNAL', 'ECHO', 'ECLIPSE', 'ENERGY', 'ESCAPE', 'EDEN'],
  F: ['FLAME', 'FOREST', 'FOREVER', 'FRESH', 'FROST', 'FLUTTER', 'FAITH', 'FLAIR'],
  G: ['GARDEN', 'GENTLE', 'GLOW', 'GOLD', 'GRACE', 'GRAND', 'GRAVEL', 'GROVE'],
  H: ['HARBOR', 'HEART', 'HEAVEN', 'HONEY', 'HORIZON', 'HOPE', 'HAZE', 'HAVEN'],
  I: ['ISLAND', 'IVORY', 'IMAGINE', 'INSPIRE', 'IRIS', 'ICICLE', 'INK', 'INDIGO'],
  J: ['JADE', 'JEWEL', 'JOURNEY', 'JOY', 'JUNGLE', 'JASMINE', 'JETTY', 'JAZZ'],
  K: ['KINDNESS', 'KISS', 'KITE', 'KNOT', 'KARMA', 'KINDLE', 'KEEN', 'KELP'],
  L: ['LANTERN', 'LAUGHTER', 'LAVENDER', 'LIGHT', 'LOVE', 'LUNAR', 'LACE', 'LUSH'],
  M: ['MAGIC', 'MARBLE', 'MEADOW', 'MELODY', 'MIST', 'MOON', 'MORNING', 'MYSTIC'],
  N: ['NATURE', 'NESTLE', 'NIGHT', 'NOBLE', 'NORTH', 'NOVA', 'NEON', 'NECTAR'],
  O: ['OCEAN', 'OPAL', 'ORACLE', 'ORBIT', 'ORCHID', 'ORIGIN', 'ONYX', 'OLIVE'],
  P: ['PETAL', 'PEACE', 'PEARL', 'PHOENIX', 'PINE', 'PRISM', 'PURE', 'PILGRIM'],
  Q: ['QUIET', 'QUEST', 'QUARTZ', 'QUEEN', 'QUILL', 'QUIRK', 'QUIVER', 'QUASAR'],
  R: ['RADIANT', 'RAIN', 'RAINBOW', 'RIVER', 'ROSE', 'RUBY', 'RUSH', 'REALM'],
  S: ['SACRED', 'SAPPHIRE', 'SERENE', 'SILVER', 'SOLAR', 'SOUL', 'SPARK', 'STAR'],
  T: ['TENDER', 'THUNDER', 'TIDE', 'TIMBER', 'TOPAZ', 'TRAIL', 'TRUTH', 'TWILIGHT'],
  U: ['ULTRA', 'UMBRELLA', 'UNITY', 'UNIVERSE', 'UNIQUE', 'UPLIFT', 'UMBER', 'URBAN'],
  V: ['VALLEY', 'VELVET', 'VESSEL', 'VIBRANT', 'VIOLET', 'VISION', 'VIVID', 'VOYAGE'],
  W: ['WARM', 'WAVE', 'WILD', 'WILLOW', 'WIND', 'WINTER', 'WISDOM', 'WONDER'],
  X: ['XENON', 'XRAY', 'XEROX'],
  Y: ['YARN', 'YELLOW', 'YOGA', 'YOUNG', 'YOUTH', 'YONDER', 'YIELD', 'YELL'],
  Z: ['ZENITH', 'ZEPHYR', 'ZINC', 'ZEAL', 'ZERO', 'ZIGZAG', 'ZONE', 'ZINNIA'],
}

function getSuggestion(letter: string, used: string[]): string | null {
  const pool = (WORD_POOL[letter] ?? []).filter(w => !used.includes(w))
  if (pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

export default function WordChain() {
  const navigate = useNavigate()
  const [chain, setChain] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [turn, setTurn] = useState<'you' | 'partner'>('you')
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const started = chain.length > 0
  const lastWord = chain[chain.length - 1]
  const requiredLetter = started ? lastWord[lastWord.length - 1] : null

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
    if (requiredLetter && word[0] !== requiredLetter) {
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
    if (started) setTurn(t => t === 'you' ? 'partner' : 'you')
    inputRef.current?.focus()
  }

  function suggest() {
    const letter = requiredLetter ?? 'L'
    const word = getSuggestion(letter, chain)
    if (word) {
      setInput(word)
      setError('')
      inputRef.current?.focus()
    }
  }

  function reset() {
    setChain([])
    setInput('')
    setError('')
    setTurn('you')
  }

  const accent = '#f59e0b'

  return (
    <div style={{ minHeight: '100dvh', background: '#080808', display: 'flex', flexDirection: 'column', padding: '0 20px' }}>

      <div className="pointer-events-none fixed inset-0 z-0" style={{
        background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(245,158,11,0.07) 0%, transparent 65%)',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 52, paddingBottom: 16, position: 'relative', zIndex: 10 }}>
        <button onClick={() => navigate(-1)} style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>← Back</button>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>Word Chain</span>
        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, fontWeight: 600 }}>{chain.length} words</span>
      </div>

      {/* Turn indicator */}
      {started && (
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', gap: 8, marginBottom: 16 }}>
          {(['you', 'partner'] as const).map(t => (
            <div key={t} style={{
              flex: 1, padding: '10px', borderRadius: 12, textAlign: 'center',
              background: turn === t ? `${accent}18` : 'rgba(255,255,255,0.02)',
              border: `1px solid ${turn === t ? accent + '40' : 'rgba(255,255,255,0.05)'}`,
              transition: 'all 0.3s',
            }}>
              <p style={{ color: turn === t ? accent : 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {t === 'you' ? 'You' : 'Partner'}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Prompt */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', marginBottom: 12 }}>
        {!started ? (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Start the chain — type any word</p>
        ) : (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
            Next word must start with{' '}
            <span style={{ color: accent, fontWeight: 800, fontSize: 20 }}>{requiredLetter}</span>
          </p>
        )}
      </div>

      {/* Chain display */}
      <div
        ref={listRef}
        style={{
          position: 'relative', zIndex: 10,
          overflowY: 'auto', marginBottom: 16,
          display: 'flex', flexDirection: 'column', gap: 6,
          maxHeight: '42vh',
          padding: '4px 0',
        }}
      >
        {chain.map((word, i) => {
          const isLast = i === chain.length - 1
          const isYou = i % 2 === 0
          return (
            <div key={i} style={{
              alignSelf: isYou ? 'flex-start' : 'flex-end',
              background: isYou ? 'rgba(255,255,255,0.05)' : `${accent}18`,
              border: `1px solid ${isYou ? 'rgba(255,255,255,0.08)' : accent + '30'}`,
              borderRadius: 12,
              padding: '8px 16px',
            }}>
              <span style={{
                color: isLast ? '#fff' : 'rgba(255,255,255,0.55)',
                fontWeight: isLast ? 800 : 600,
                fontSize: isLast ? 18 : 15,
                letterSpacing: '0.05em',
              }}>
                {word.slice(0, -1)}
                <span style={{ color: accent }}>{word[word.length - 1]}</span>
              </span>
            </div>
          )
        })}
      </div>

      {/* Input */}
      <div style={{ position: 'relative', zIndex: 10, marginBottom: 24 }}>
        <form onSubmit={submit}>
          <div style={{ position: 'relative' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => { setInput(e.target.value); setError('') }}
              placeholder={requiredLetter ? `Start with ${requiredLetter}...` : 'Type any word...'}
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
                background: `linear-gradient(135deg, ${accent}, #d97706)`,
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
          onClick={suggest}
          style={{
            width: '100%', padding: '13px', marginTop: 8,
            borderRadius: 12,
            background: `${accent}10`,
            border: `1px solid ${accent}25`,
            color: accent, fontSize: 13, fontWeight: 600,
          }}
          className="active:scale-95 transition-transform"
        >
          Suggest a word
        </button>

        <button
          onClick={reset}
          style={{ width: '100%', padding: '11px', marginTop: 6, color: 'rgba(255,255,255,0.18)', fontSize: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', background: 'transparent' }}
        >
          New Game
        </button>
      </div>
    </div>
  )
}
