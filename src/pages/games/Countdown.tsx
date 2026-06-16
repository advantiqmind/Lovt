import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface CountdownEvent {
  id: string
  label: string
  date: string
}

const STORAGE_KEY = 'lovt_countdowns'

function load(): CountdownEvent[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function save(events: CountdownEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
}

function getTimeLeft(dateStr: string) {
  const target = new Date(dateStr).getTime()
  const now = Date.now()
  const diff = target - now

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, past: true }

  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return { days, hours, minutes, seconds, past: false }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function Countdown() {
  const navigate = useNavigate()
  const [events, setEvents] = useState<CountdownEvent[]>(() => load())
  const [, setTick] = useState(0)
  const [adding, setAdding] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newDate, setNewDate] = useState('')

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  function addEvent(e: React.FormEvent) {
    e.preventDefault()
    if (!newLabel.trim() || !newDate) return
    const event: CountdownEvent = {
      id: Date.now().toString(),
      label: newLabel.trim(),
      date: newDate,
    }
    const updated = [...events, event]
    setEvents(updated)
    save(updated)
    setNewLabel('')
    setNewDate('')
    setAdding(false)
  }

  function remove(id: string) {
    const updated = events.filter(e => e.id !== id)
    setEvents(updated)
    save(updated)
  }

  const accent = '#f97316'

  return (
    <div style={{ minHeight: '100dvh', background: '#080808', display: 'flex', flexDirection: 'column', padding: '0 20px' }}>

      <div className="pointer-events-none fixed inset-0 z-0" style={{
        background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(249,115,22,0.07) 0%, transparent 65%)',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 52, paddingBottom: 24, position: 'relative', zIndex: 10 }}>
        <button onClick={() => navigate(-1)} style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>← Back</button>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 }}>Countdown</span>
        <button
          onClick={() => setAdding(a => !a)}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            background: adding ? `${accent}30` : 'rgba(255,255,255,0.06)',
            border: `1px solid ${adding ? accent + '50' : 'rgba(255,255,255,0.08)'}`,
            color: adding ? accent : 'rgba(255,255,255,0.5)',
            fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1, fontWeight: 300,
          }}
        >
          {adding ? '×' : '+'}
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <form
          onSubmit={addEvent}
          style={{
            position: 'relative', zIndex: 10,
            background: `${accent}10`,
            border: `1px solid ${accent}25`,
            borderRadius: 20, padding: '20px', marginBottom: 20,
            display: 'flex', flexDirection: 'column', gap: 12,
          }}
        >
          <input
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            placeholder="What are you counting to?"
            autoFocus
            style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '13px 16px', color: '#fff', fontSize: 15,
              outline: 'none',
            }}
          />
          <input
            type="datetime-local"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '13px 16px', color: '#fff', fontSize: 15,
              outline: 'none', colorScheme: 'dark',
            }}
          />
          <button
            type="submit"
            disabled={!newLabel.trim() || !newDate}
            style={{
              padding: '14px', borderRadius: 12,
              background: `linear-gradient(135deg, ${accent}, #ea6a0a)`,
              color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer',
              opacity: !newLabel.trim() || !newDate ? 0.4 : 1,
            }}
          >
            Add Countdown
          </button>
        </form>
      )}

      {/* Events list */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        {events.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: `${accent}12`, border: `1px solid ${accent}25`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="10" stroke={accent} strokeWidth="1.8"/>
                <path d="M14 8v6l3.5 3.5" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 14, lineHeight: 1.6 }}>
              No countdowns yet.<br/>
              <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: 13 }}>Add your next big moment.</span>
            </p>
          </div>
        )}

        {events.map(event => {
          const { days, hours, minutes, seconds, past } = getTimeLeft(event.date)
          return (
            <div
              key={event.id}
              style={{
                background: past ? 'rgba(255,255,255,0.02)' : `${accent}08`,
                border: `1px solid ${past ? 'rgba(255,255,255,0.06)' : accent + '20'}`,
                borderRadius: 20, padding: '20px',
                opacity: past ? 0.5 : 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em' }}>{event.label}</p>
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 3 }}>
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <button
                  onClick={() => remove(event.id)}
                  style={{ color: 'rgba(255,255,255,0.15)', fontSize: 18, lineHeight: 1, padding: '0 4px' }}
                >
                  ×
                </button>
              </div>

              {past ? (
                <p style={{ color: accent, fontWeight: 700, fontSize: 15 }}>Time's up!</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {[
                    { val: days, label: 'Days' },
                    { val: hours, label: 'Hrs' },
                    { val: minutes, label: 'Min' },
                    { val: seconds, label: 'Sec' },
                  ].map(({ val, label }) => (
                    <div key={label} style={{
                      background: 'rgba(255,255,255,0.04)', borderRadius: 12,
                      padding: '10px 6px', textAlign: 'center',
                    }}>
                      <p style={{ color: '#fff', fontWeight: 800, fontSize: label === 'Days' && val > 99 ? 18 : 22, letterSpacing: '-0.03em', lineHeight: 1 }}>
                        {label === 'Days' ? val : pad(val)}
                      </p>
                      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9, marginTop: 4, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>{label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ height: 32 }} />
    </div>
  )
}
