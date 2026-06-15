import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100)
    const t2 = setTimeout(() => setPulse(true), 800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className="min-h-dvh bg-[#0d0d0d] flex flex-col items-center justify-between px-6 py-16 overflow-hidden">

      {/* Ambient glow background */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(225,29,72,0.08) 0%, transparent 70%)',
          transition: 'opacity 1.5s ease',
          opacity: visible ? 1 : 0,
        }}
      />

      <div />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center text-center">

        {/* Animated heart rings */}
        <div className="relative flex items-center justify-center mb-12" style={{ width: 120, height: 120 }}>
          {/* Outer ring */}
          <div
            className="absolute rounded-full border border-rose-600/10"
            style={{
              width: 120, height: 120,
              transform: pulse ? 'scale(1)' : 'scale(0.6)',
              opacity: pulse ? 1 : 0,
              transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 1.2s ease',
            }}
          />
          {/* Mid ring */}
          <div
            className="absolute rounded-full border border-rose-600/20"
            style={{
              width: 88, height: 88,
              transform: pulse ? 'scale(1)' : 'scale(0.5)',
              opacity: pulse ? 1 : 0,
              transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s, opacity 1s ease 0.1s',
            }}
          />
          {/* Inner circle */}
          <div
            className="absolute rounded-full flex items-center justify-center"
            style={{
              width: 60, height: 60,
              background: 'radial-gradient(circle, rgba(225,29,72,0.2) 0%, rgba(225,29,72,0.05) 100%)',
              border: '1px solid rgba(225,29,72,0.3)',
              transform: pulse ? 'scale(1)' : 'scale(0.3)',
              opacity: pulse ? 1 : 0,
              transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s, opacity 0.8s ease 0.2s',
            }}
          >
            <HeartIcon />
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            opacity: visible ? 1 : 0,
            transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, opacity 0.9s ease 0.3s',
          }}
        >
          <h1
            className="font-bold tracking-tight text-white"
            style={{ fontSize: 72, lineHeight: 1, letterSpacing: '-0.04em' }}
          >
            Lovt
          </h1>
        </div>

        {/* Tagline */}
        <div
          style={{
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            opacity: visible ? 1 : 0,
            transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.5s, opacity 0.9s ease 0.5s',
          }}
        >
          <p className="text-[#555] text-xs tracking-[0.25em] uppercase mt-3">
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
          transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.7s, opacity 0.9s ease 0.7s',
        }}
      >
        <button
          onClick={() => navigate('/auth?mode=signup')}
          className="w-full py-4 rounded-2xl font-semibold text-base text-white active:scale-95 transition-transform relative overflow-hidden"
          style={{ backgroundColor: '#e11d48' }}
        >
          <span className="relative z-10">Get Started</span>
          <div
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)' }}
          />
        </button>

        <button
          onClick={() => navigate('/auth?mode=login')}
          className="w-full py-4 rounded-2xl text-[#666] font-medium text-base active:scale-95 transition-transform"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          Sign In
        </button>

        <button
          onClick={() => navigate('/guest')}
          className="w-full py-3 text-[#444] text-sm active:scale-95 transition-transform"
        >
          Play as Guest
        </button>
      </div>

    </div>
  )
}

function HeartIcon() {
  return (
    <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
      <path
        d="M11 18.5C11 18.5 1.5 12.5 1.5 6.5C1.5 4.01 3.51 2 6 2C7.93 2 9.6 3.13 10.37 4.78C10.6 5.28 11.4 5.28 11.63 4.78C12.4 3.13 14.07 2 16 2C18.49 2 20.5 4.01 20.5 6.5C20.5 12.5 11 18.5 11 18.5Z"
        stroke="#e11d48"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
