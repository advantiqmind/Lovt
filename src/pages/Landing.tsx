import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [pulse, setPulse] = useState(false)
  const [beat, setBeat] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100)
    const t2 = setTimeout(() => setPulse(true), 600)
    const t3 = setTimeout(() => setBeat(true), 1000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <div className="min-h-dvh bg-[#0a0a0a] flex flex-col items-center justify-between px-6 py-16 overflow-hidden">

      {/* Multi-layer ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{ opacity: visible ? 1 : 0, transition: 'opacity 2s ease' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 100% 70% at 50% 55%, rgba(225,29,72,0.18) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(255,60,100,0.1) 0%, transparent 55%)' }} />
      </div>

      <div />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center text-center">

        {/* Heart rings — large */}
        <div className="relative flex items-center justify-center mb-10" style={{ width: 200, height: 200 }}>

          {/* Outermost ring */}
          <div style={{
            position: 'absolute',
            width: 200, height: 200,
            borderRadius: '50%',
            border: '1px solid rgba(225,29,72,0.08)',
            transform: pulse ? 'scale(1)' : 'scale(0.4)',
            opacity: pulse ? 1 : 0,
            transition: 'transform 1.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 1.4s ease',
            animation: beat ? 'heartbeat-outer 1.4s ease-in-out infinite' : 'none',
          }} />

          {/* Outer ring */}
          <div style={{
            position: 'absolute',
            width: 160, height: 160,
            borderRadius: '50%',
            border: '1px solid rgba(225,29,72,0.15)',
            transform: pulse ? 'scale(1)' : 'scale(0.4)',
            opacity: pulse ? 1 : 0,
            transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) 0.08s, opacity 1.2s ease 0.08s',
            animation: beat ? 'heartbeat-outer 1.4s ease-in-out infinite 0.02s' : 'none',
          }} />

          {/* Mid ring */}
          <div style={{
            position: 'absolute',
            width: 120, height: 120,
            borderRadius: '50%',
            border: '1px solid rgba(225,29,72,0.3)',
            transform: pulse ? 'scale(1)' : 'scale(0.3)',
            opacity: pulse ? 1 : 0,
            transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s, opacity 1s ease 0.15s',
            animation: beat ? 'heartbeat-mid 1.4s ease-in-out infinite' : 'none',
          }} />

          {/* Inner glow circle */}
          <div style={{
            position: 'absolute',
            width: 82, height: 82,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(225,29,72,0.35) 0%, rgba(225,29,72,0.08) 100%)',
            border: '1px solid rgba(225,29,72,0.5)',
            boxShadow: '0 0 30px rgba(225,29,72,0.25), inset 0 0 20px rgba(225,29,72,0.1)',
            transform: pulse ? 'scale(1)' : 'scale(0.2)',
            opacity: pulse ? 1 : 0,
            transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s, opacity 0.8s ease 0.25s',
            animation: beat ? 'heartbeat-inner 1.4s ease-in-out infinite' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <HeartIcon />
          </div>
        </div>

        {/* Title */}
        <div style={{
          transform: visible ? 'translateY(0)' : 'translateY(28px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.35s, opacity 1s ease 0.35s',
        }}>
          <h1 style={{
            fontSize: 86,
            lineHeight: 1,
            letterSpacing: '-0.05em',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.75) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Lovt
          </h1>
        </div>

        {/* Tagline */}
        <div style={{
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.55s, opacity 1s ease 0.55s',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', marginTop: 12 }}>
            Just the two of you
          </p>
        </div>

      </div>

      {/* Buttons */}
      <div
        className="w-full space-y-3 relative z-10"
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(32px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.75s, opacity 1s ease 0.75s',
        }}
      >
        <button
          onClick={() => navigate('/auth?mode=signup')}
          className="w-full py-4 rounded-2xl font-semibold text-base text-white active:scale-95 transition-transform relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
            boxShadow: '0 4px 24px rgba(225,29,72,0.4)',
          }}
        >
          Get Started
        </button>

        <button
          onClick={() => navigate('/auth?mode=login')}
          className="w-full py-4 rounded-2xl font-medium text-base active:scale-95 transition-transform"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          Sign In
        </button>

        <button
          onClick={() => navigate('/guest')}
          className="w-full py-3 text-sm active:scale-95 transition-transform"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          Continue as Guest
        </button>
      </div>

    </div>
  )
}

function HeartIcon() {
  return (
    <svg width="30" height="27" viewBox="0 0 22 20" fill="none">
      <path
        d="M11 18.5C11 18.5 1.5 12.5 1.5 6.5C1.5 4.01 3.51 2 6 2C7.93 2 9.6 3.13 10.37 4.78C10.6 5.28 11.4 5.28 11.63 4.78C12.4 3.13 14.07 2 16 2C18.49 2 20.5 4.01 20.5 6.5C20.5 12.5 11 18.5 11 18.5Z"
        fill="rgba(225,29,72,0.6)"
        stroke="#ff4d6d"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
