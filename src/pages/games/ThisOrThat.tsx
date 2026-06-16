import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const questions = [
  ['Morning cuddle', 'Midnight kiss'],
  ['Stay in tonight', 'Go out tonight'],
  ['Road trip together', 'Fly somewhere new'],
  ['Cook together', 'Order in'],
  ['Movie night', 'Game night'],
  ['Walk in the park', 'Lazy Sunday in'],
  ['Say it out loud', 'Write it in a note'],
  ['Surprise plans', 'Plan it together'],
  ['Beach getaway', 'Mountain escape'],
  ['Dance at home', 'Dance class together'],
  ['Long phone call', 'Short sweet text'],
  ['Anniversary trip', 'Anniversary dinner'],
  ['Window seat', 'Aisle seat'],
  ['Hold hands', 'Arms around'],
  ['First to say sorry', 'First to laugh it off'],
  ['Watch their show', 'Convince them to watch yours'],
  ['Breakfast in bed', 'Brunch out'],
  ['One big trip', 'Many small trips'],
  ['Tell them now', 'Wait for the right moment'],
  ['Daily voice note', 'Daily good morning text'],
  ['Match outfits', 'Totally different styles'],
  ['Split everything', 'Take turns treating'],
  ['Close to family', 'Create your own traditions'],
  ['Quiet night home', 'Spontaneous late night drive'],
  ['Say I love you first', 'Wait to hear it'],
]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function ThisOrThat() {
  const navigate = useNavigate()
  const [deck] = useState(() => shuffle(questions))
  const [index, setIndex] = useState(0)
  const [scores, setScores] = useState<{ a: number; b: number }>({ a: 0, b: 0 })
  const [chosen, setChosen] = useState<'a' | 'b' | null>(null)
  const [done, setDone] = useState(false)

  const current = deck[index]
  const progress = (index / deck.length) * 100

  function pick(side: 'a' | 'b') {
    if (chosen) return
    setChosen(side)
    const next = { ...scores, [side]: scores[side] + 1 }
    setScores(next)

    setTimeout(() => {
      if (index + 1 >= deck.length) {
        setDone(true)
      } else {
        setIndex(i => i + 1)
        setChosen(null)
      }
    }, 600)
  }

  if (done) {
    const total = scores.a + scores.b
    const aPercent = Math.round((scores.a / total) * 100)
    const bPercent = 100 - aPercent
    return (
      <div className="min-h-dvh bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center space-y-8">
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(225,29,72,0.12)',
          border: '1px solid rgba(225,29,72,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M16 4L8 16h8l-4 8 12-14h-8l4-6z" stroke="#e11d48" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.04em' }}>Done!</h2>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginTop: 8 }}>{total} rounds played</p>
        </div>
        <div style={{ width: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ color: '#ff4d6d', fontWeight: 700, fontSize: 28 }}>{aPercent}%</span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 28 }}>{bPercent}%</span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${aPercent}%`, background: 'linear-gradient(90deg, #e11d48, #ff4d6d)', borderRadius: 999, transition: 'width 1s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>First choices</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Second choices</span>
          </div>
        </div>
        <div className="w-full space-y-3">
          <button
            onClick={() => { setIndex(0); setScores({ a: 0, b: 0 }); setChosen(null); setDone(false) }}
            style={{
              width: '100%', padding: '16px', borderRadius: 16,
              background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
              boxShadow: '0 4px 24px rgba(225,29,72,0.3)',
              color: '#fff', fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer',
            }}
            className="active:scale-95 transition-transform"
          >
            Play Again
          </button>
          <button
            onClick={() => navigate(-1)}
            style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14, width: '100%', padding: '12px' }}
          >
            Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-[#0a0a0a] flex flex-col px-6 py-16">

      <div className="pointer-events-none fixed inset-0 z-0" style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% 20%, rgba(225,29,72,0.06) 0%, transparent 70%)',
      }} />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>← Back</button>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>{index + 1} / {deck.length}</span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 999, marginBottom: 48, position: 'relative', zIndex: 10 }}>
        <div style={{ height: '100%', width: `${progress}%`, background: '#e11d48', borderRadius: 999, transition: 'width 0.4s ease' }} />
      </div>

      {/* Question label */}
      <div className="relative z-10 flex-1 flex flex-col justify-center space-y-4">
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 8 }}>
          This or That?
        </p>

        {/* Option A */}
        <button
          onClick={() => pick('a')}
          className="w-full active:scale-95 transition-all"
          style={{
            padding: '28px 24px',
            borderRadius: 20,
            background: chosen === 'a'
              ? 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)'
              : chosen === 'b'
              ? 'rgba(255,255,255,0.02)'
              : 'rgba(255,255,255,0.05)',
            border: chosen === 'a'
              ? '1px solid #e11d48'
              : '1px solid rgba(255,255,255,0.08)',
            boxShadow: chosen === 'a' ? '0 4px 24px rgba(225,29,72,0.3)' : 'none',
            transition: 'all 0.3s ease',
            opacity: chosen === 'b' ? 0.3 : 1,
          }}
        >
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em' }}>
            {current[0]}
          </span>
        </button>

        {/* OR divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 12, letterSpacing: '0.2em', fontWeight: 600 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* Option B */}
        <button
          onClick={() => pick('b')}
          className="w-full active:scale-95 transition-all"
          style={{
            padding: '28px 24px',
            borderRadius: 20,
            background: chosen === 'b'
              ? 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)'
              : chosen === 'a'
              ? 'rgba(255,255,255,0.02)'
              : 'rgba(255,255,255,0.05)',
            border: chosen === 'b'
              ? '1px solid #e11d48'
              : '1px solid rgba(255,255,255,0.08)',
            boxShadow: chosen === 'b' ? '0 4px 24px rgba(225,29,72,0.3)' : 'none',
            transition: 'all 0.3s ease',
            opacity: chosen === 'a' ? 0.3 : 1,
          }}
        >
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em' }}>
            {current[1]}
          </span>
        </button>
      </div>
    </div>
  )
}
